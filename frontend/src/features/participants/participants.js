import * as api from '../../api/participants.api.js';
import { state } from '../../store/state.js';
import { byId, $, esc, setBusy } from '../../ui/dom.js';
import { toast } from '../../ui/toast.js';
import { confirmDialog } from '../../ui/confirm.js';

let list = [];

export function init() {
  const sel = byId('part-intervencion'), fil = byId('filter-intervencion');
  state.programs.forEach(p => {
    sel.add(new Option(`${p.programa} - ${p.intervencion}`, p.id));
    fil.add(new Option(p.intervencion, p.id));
  });

  sel.addEventListener('change', () => showContext(sel.value));
  byId('search-input').addEventListener('input', render);
  fil.addEventListener('change', render);
  byId('btn-new-participant').onclick = () => openModal();
  byId('btn-empty-add').onclick = () => openModal();
  byId('btn-save-participant').onclick = save;
  document.querySelectorAll('[data-close-participant]').forEach(el => (el.onclick = closeModal));

  byId('participants-container').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const p = list.find(x => x.id === btn.dataset.id);
    if (!p) return;
    btn.dataset.action === 'edit' ? openModal(p) : askDelete(p);
  });
}

export async function load() {
  try {
    list = await api.list();
    render();
  } catch (e) { toast(e.message, 'error'); }
}

function render() {
  const text = byId('search-input').value.toLowerCase();
  const prog = byId('filter-intervencion').value;
  const filtered = list.filter(p => p.name.toLowerCase().includes(text) && (prog === 'all' || p.programId === prog));

  const container = byId('participants-container'), empty = byId('empty-state');
  if (!filtered.length) {
    container.classList.add('hidden');
    empty.classList.remove('hidden'); empty.classList.add('flex');
    return;
  }
  container.classList.remove('hidden');
  empty.classList.add('hidden'); empty.classList.remove('flex');

  container.innerHTML = filtered.map(p => {
    const pd = state.programById(p.programId);
    const badge = p.nivel === 'Alto' ? 'bg-green-100 text-green-800' : p.nivel === 'Medio' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
    return `<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow relative group">
      <div style="height:8px;background:${esc(pd?.hex || '#9ca3af')}"></div>
      <div class="p-5">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h4 class="font-bold text-lg text-gray-800"><span class="text-orange-500 font-mono text-sm mr-2">#${esc(p.codigo)}</span>${esc(p.name)}</h4>
            <p class="text-xs text-gray-500"><i class="fa-regular fa-clock mr-1"></i> Edad: ${esc(p.age)} años | Reg: ${new Date(p.date).toLocaleDateString()}</p>
          </div>
          <div class="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
            <button data-action="edit" data-id="${p.id}" class="text-blue-500 hover:text-blue-700 bg-blue-50 p-1.5 rounded" title="Editar"><i class="fa-solid fa-pen text-sm"></i></button>
            <button data-action="delete" data-id="${p.id}" class="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded" title="Eliminar"><i class="fa-solid fa-trash text-sm"></i></button>
          </div>
        </div>
        <div class="mt-3 mb-4 inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-bold border border-orange-200">${esc(pd?.intervencion || 'Desconocido')}</div>
        <div class="space-y-3 mt-2">
          <div><p class="text-xs font-semibold text-gray-500 uppercase">Necesidad / Debilidad:</p><p class="text-sm text-gray-700 line-clamp-2" title="${esc(p.necesidad)} | ${esc(p.debilidades)}">${esc(p.necesidad)}</p></div>
          <div class="bg-slate-50 p-2 rounded border border-slate-100"><p class="text-xs font-semibold text-slate-500 uppercase">Acción a realizar:</p><p class="text-sm text-slate-700 font-medium">${esc(p.accion)}</p></div>
        </div>
      </div>
      <div class="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span class="text-xs text-gray-500 font-medium">Participación:</span>
        <span class="px-2 py-1 rounded text-xs font-bold ${badge}">${esc(p.nivel)}</span>
      </div></div>`;
  }).join('');
}

function showContext(id) {
  const d = state.programById(id), box = byId('context-data-box');
  if (d) {
    byId('context-resultado').textContent = d.resultado;
    byId('context-indicador').textContent = d.indicador;
    box.classList.remove('hidden');
  } else box.classList.add('hidden');
}

function openModal(p) {
  const form = byId('participant-form');
  form.reset();
  byId('part-id').value = p?.id || '';
  if (p) {
    byId('part-code').value = p.codigo;
    byId('part-name').value = p.name;
    byId('part-age').value = p.age;
    byId('part-intervencion').value = p.programId;
    byId('part-necesidad').value = p.necesidad;
    byId('part-debilidades').value = p.debilidades;
    byId('part-accion').value = p.accion;
    $(`input[name="part-nivel"][value="${p.nivel}"]`).checked = true;
    $(`input[name="part-logrado"][value="${p.logrado}"]`).checked = true;
  }
  showContext(byId('part-intervencion').value);
  byId('modal-title').textContent = p ? 'Editar Registro' : 'Registrar Participante';

  document.body.classList.add('modal-active');
  byId('participant-modal').classList.remove('pointer-events-none');
  setTimeout(() => {
    byId('participant-modal').classList.remove('opacity-0');
    byId('modal-content').classList.replace('scale-95', 'scale-100');
  }, 10);
}

function closeModal() {
  byId('participant-modal').classList.add('opacity-0');
  byId('modal-content').classList.replace('scale-100', 'scale-95');
  setTimeout(() => {
    byId('participant-modal').classList.add('pointer-events-none');
    document.body.classList.remove('modal-active');
  }, 300);
}

async function save() {
  const form = byId('participant-form');
  if (!form.checkValidity()) { form.reportValidity(); return; }

  const id = byId('part-id').value;
  const body = {
    codigo: byId('part-code').value,
    name: byId('part-name').value,
    age: byId('part-age').value,
    programId: byId('part-intervencion').value,
    necesidad: byId('part-necesidad').value,
    debilidades: byId('part-debilidades').value,
    accion: byId('part-accion').value,
    nivel: $('input[name="part-nivel"]:checked').value,
    logrado: $('input[name="part-logrado"]:checked').value,
  };

  const btn = byId('btn-save-participant');
  setBusy(btn, true);
  try {
    id ? await api.update(id, body) : await api.create(body);
    toast(id ? 'Registro actualizado exitosamente' : 'Participante registrado exitosamente');
    closeModal();
    await load();
  } catch (e) {
    toast(e.message, 'error');
  } finally { setBusy(btn, false); }
}

async function askDelete(p) {
  const ok = await confirmDialog({
    title: 'Eliminar participante',
    message: `Se eliminará a ${p.name} y todo su historial de asistencia. Esta acción no se puede deshacer.`,
  });
  if (!ok) return;
  try {
    await api.remove(p.id);
    toast('Registro eliminado', 'info');
    await load();
  } catch (e) { toast(e.message, 'error'); }
}
