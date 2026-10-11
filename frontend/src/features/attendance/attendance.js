import * as api from '../../api/attendance.api.js';
import { byId, $$, esc, setBusy } from '../../ui/dom.js';
import { toast } from '../../ui/toast.js';
import { confirmDialog } from '../../ui/confirm.js';
import { todayLocal, nowHHMM, pct } from '../../utils/format.js';

let records = [];
let date = todayLocal();
let dirty = false;

export function init() {
  const input = byId('att-date');
  input.value = date;
  input.max = todayLocal();

  input.addEventListener('change', async () => {
    if (!input.value) { input.value = date; return; }
    if (dirty) {
      const ok = await confirmDialog({
        title: 'Cambios sin guardar',
        message: 'Si cambias de fecha perderás los cambios no guardados. ¿Continuar?',
        confirmText: 'Descartar cambios',
      });
      if (!ok) { input.value = date; return; }
    }
    date = input.value;
    await load();
  });

  const tbody = byId('attendance-table-body');
  tbody.addEventListener('input', e => {
    const tr = e.target.closest('tr[data-id]');
    if (tr) { setDirty(true); paintStatus(tr); renderKpis(); }
  });
  tbody.addEventListener('click', e => {
    const btn = e.target.closest('[data-now]');
    if (!btn) return;
    const tr = btn.closest('tr');
    tr.querySelector(`input[data-field="${btn.dataset.now}"]`).value = nowHHMM();
    setDirty(true); paintStatus(tr); renderKpis();
  });

  document.querySelectorAll('[data-save-attendance]').forEach(b => (b.onclick = save));
  window.addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
}

export async function load() {
  try {
    const res = await api.getByDate(date);
    records = res.records;
    setDirty(false);
    render();
  } catch (e) { toast(e.message, 'error'); }
}

function setDirty(v) {
  dirty = v;
  byId('att-dirty').classList.toggle('hidden', !v);
}

function render() {
  const tbody = byId('attendance-table-body');
  if (!records.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-6 text-center text-gray-500">No hay participantes registrados.</td></tr>';
    renderKpis();
    return;
  }
  const cell = (field, v) => `<div class="flex items-center justify-center gap-2">
    <input type="time" data-field="${field}" value="${esc(v)}" class="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none w-28 text-center font-mono">
    <button type="button" data-now="${field}" title="Poner hora actual" class="p-1.5 text-slate-400 hover:text-orange-500"><i class="fa-regular fa-clock"></i></button></div>`;

  tbody.innerHTML = records.map(r => `
    <tr data-id="${r.participantId}" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td class="px-6 py-4 font-mono font-bold text-slate-600">${esc(r.codigo)}</td>
      <td class="px-6 py-4 font-medium text-gray-800">${esc(r.name)}</td>
      <td class="px-6 py-4 text-center">${cell('ingreso', r.ingreso)}</td>
      <td class="px-6 py-4 text-center">${cell('salida', r.salida)}</td>
      <td class="px-6 py-4 text-center" data-status></td>
    </tr>`).join('');
  $$('tr[data-id]', tbody).forEach(paintStatus);
  renderKpis();
}

const rowValues = tr => ({
  participantId: tr.dataset.id,
  ingreso: tr.querySelector('input[data-field="ingreso"]').value,
  salida: tr.querySelector('input[data-field="salida"]').value,
});

function paintStatus(tr) {
  const { ingreso, salida } = rowValues(tr);
  tr.querySelector('[data-status]').innerHTML =
    ingreso && salida ? '<span class="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">Completo</span>'
    : ingreso ? '<span class="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">En curso</span>'
    : '<span class="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">Ausente</span>';
}

function renderKpis() {
  const rows = $$('#attendance-table-body tr[data-id]').map(rowValues);
  const total = rows.length, present = rows.filter(r => r.ingreso).length;
  const k = (l, v, ic, c) => `<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center"><div class="rounded-full p-3 mr-3 w-11 h-11 flex items-center justify-center ${c}"><i class="fa-solid ${ic}"></i></div><div><p class="text-xs text-gray-500 font-medium">${l}</p><p class="text-2xl font-bold text-gray-800">${v}</p></div></div>`;
  byId('att-kpis').innerHTML =
    k('Total', total, 'fa-users', 'bg-blue-50 text-blue-500') +
    k('Presentes', present, 'fa-user-check', 'bg-green-50 text-green-600') +
    k('Ausentes', total - present, 'fa-user-xmark', 'bg-red-50 text-red-500') +
    k('% Asistencia', pct(present, total) + '%', 'fa-percent', 'bg-orange-50 text-orange-500');
}

async function save() {
  const rows = $$('#attendance-table-body tr[data-id]').map(rowValues);
  if (!rows.length) { toast('No hay participantes para guardar', 'info'); return; }

  const btns = [...document.querySelectorAll('[data-save-attendance]')];
  btns.forEach(b => setBusy(b, true));
  try {
    await api.saveAll(date, rows);
    setDirty(false);
    toast('Asistencia de todos guardada con éxito');
  } catch (e) {
    toast(e.message, 'error');
  } finally { btns.forEach(b => setBusy(b, false)); }
}
