import * as reportsApi from '../../api/reports.api.js';
import * as participantsApi from '../../api/participants.api.js';
import * as attendanceApi from '../../api/attendance.api.js';
import { state } from '../../store/state.js';
import { byId, esc } from '../../ui/dom.js';
import { toast } from '../../ui/toast.js';
import { donut, columnChart, COLORS } from '../../ui/charts.js';
import { todayLocal, pct, shortDate } from '../../utils/format.js';

export async function load() {
  const date = todayLocal();
  try {
    const [summary, participants, att] = await Promise.all([
      reportsApi.summary(date),
      participantsApi.list(),
      attendanceApi.getByDate(date),
    ]);
    render(summary, participants, att.records);
  } catch (e) { toast(e.message, 'error'); }
}

const chip = (t, v, c) => `<span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#374151"><span style="width:10px;height:10px;border-radius:2px;background:${c}"></span>${t}: <b>${v}</b></span>`;

function kpi(label, value, icon, color, sub) {
  return `<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
    <div><p class="text-sm font-medium text-gray-500">${label}</p><p class="text-3xl font-bold text-gray-800 mt-1">${value}</p><p class="text-xs text-gray-400 mt-1">${sub}</p></div>
    <div class="p-3 rounded-full w-12 h-12 flex items-center justify-center ${color}"><i class="fa-solid ${icon} text-xl"></i></div></div>`;
}

function render({ totals, programs, ages, attendance }, participants, attRecords) {
  const { total, achieved, notAchieved, avgAge } = totals;
  const empty = '<p class="text-sm text-gray-500 italic py-6 text-center">No hay datos suficientes.</p>';

  byId('rep-kpis').innerHTML =
    kpi('Total Participantes', total, 'fa-users', 'bg-blue-50 text-blue-500', `Edad promedio: ${avgAge} años`) +
    kpi('Indicador logrado', pct(achieved, total) + '%', 'fa-circle-check', 'bg-green-50 text-green-600', `${achieved} participantes`) +
    kpi('Indicador no logrado', pct(notAchieved, total) + '%', 'fa-circle-xmark', 'bg-red-50 text-red-500', `${notAchieved} participantes`) +
    kpi('Asistencia de hoy', pct(attendance.present, total) + '%', 'fa-clipboard-check', 'bg-orange-50 text-orange-500', `${attendance.present} de ${total}`);

  if (!total) {
    ['rep-overall', 'rep-bars', 'rep-programs', 'rep-levels'].forEach(id => (byId(id).innerHTML = empty));
    ['rep-ages', 'rep-history', 'rep-table'].forEach(id => (byId(id).innerHTML = ''));
    return;
  }

  // Resultado general
  byId('rep-overall').innerHTML = donut(pct(achieved, total), COLORS.ok, 170, 'Logrado') + `
    <div class="w-full mt-5 space-y-2 text-sm">
      <div class="flex justify-between bg-green-50 border border-green-100 rounded px-3 py-2"><span>Lograron</span><b>${pct(achieved, total)}% (${achieved})</b></div>
      <div class="flex justify-between bg-red-50 border border-red-100 rounded px-3 py-2"><span>No lograron</span><b>${pct(notAchieved, total)}% (${notAchieved})</b></div></div>`;

  let bars = '', cards = '', levels = '';
  programs.forEach(p => {
    const n = p.total, ok = p.achieved, ko = n - ok;
    const po = pct(ok, n), pk = n ? 100 - po : 0, met = n && po >= p.meta;

    bars += `<div><div class="flex justify-between text-sm mb-1"><span class="font-semibold text-gray-700">${esc(p.intervencion)}</span><span class="text-xs text-gray-500">${n} participantes · meta ${p.meta}%</span></div>
      <div class="relative h-7 rounded-full overflow-hidden bg-gray-100 flex">
        <div class="bar-fill h-full flex items-center justify-center text-white text-xs font-bold" style="width:${po}%;background:#22c55e">${po ? po + '%' : ''}</div>
        <div class="bar-fill h-full flex items-center justify-center text-white text-xs font-bold" style="width:${pk}%;background:#f87171">${pk ? pk + '%' : ''}</div>
        <div class="absolute top-0 bottom-0" style="left:${p.meta}%;border-left:2px dashed #1e293b" title="Meta ${p.meta}%"></div></div></div>`;

    cards += `<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div style="height:6px;background:${esc(p.hex)}"></div><div class="p-5">
      <p class="text-xs font-bold uppercase text-gray-400">${esc(p.programa)}</p><h5 class="font-bold text-gray-800 mb-4">${esc(p.intervencion)}</h5>
      <div class="flex justify-center mb-4">${donut(po, p.hex, 130, 'Logrado')}</div>
      <div class="space-y-2 text-sm">
        <p class="bg-green-50 border border-green-100 rounded px-3 py-2"><b class="text-green-700">${po}%</b> ${esc(p.okText)} <span class="text-gray-400">(${ok})</span></p>
        <p class="bg-red-50 border border-red-100 rounded px-3 py-2"><b class="text-red-600">${pk}%</b> ${esc(p.koText)} <span class="text-gray-400">(${ko})</span></p></div>
      <div class="mt-4 text-xs font-semibold ${!n ? 'text-gray-400' : met ? 'text-green-700' : 'text-amber-700'}">${!n ? 'Sin datos' : met ? '✔ Meta alcanzada' : `Faltan ${p.meta - po} pts para la meta de ${p.meta}%`}</div>
      </div></div>`;

    levels += `<div><div style="font-size:14px;font-weight:600;color:#374151;margin-bottom:6px">${esc(p.intervencion)} <span style="font-weight:400;color:#9ca3af;font-size:12px">(${n} participantes)</span></div>
      <div style="display:flex;height:16px;border-radius:999px;overflow:hidden;background:#e5e7eb">${n ? `<div style="width:${pct(p.bajo, n)}%;background:${COLORS.low}"></div><div style="width:${pct(p.medio, n)}%;background:${COLORS.mid}"></div><div style="width:${pct(p.alto, n)}%;background:${COLORS.high}"></div>` : ''}</div>
      <div style="display:flex;gap:16px;margin-top:6px;flex-wrap:wrap">${chip('Bajo', p.bajo, COLORS.low)}${chip('Medio', p.medio, COLORS.mid)}${chip('Alto', p.alto, COLORS.high)}</div></div>`;
  });
  byId('rep-bars').innerHTML = bars;
  byId('rep-programs').innerHTML = cards;
  byId('rep-levels').innerHTML = levels;

  byId('rep-ages').innerHTML = columnChart(ages.map(a => ({ label: a.label, value: a.count })));
  byId('rep-history').innerHTML = attendance.history.length
    ? columnChart(attendance.history.map(h => ({ label: shortDate(h.date), value: h.present })), { color: '#38bdf8' })
    : '<p class="text-sm text-gray-500 italic w-full text-center self-center">Aún no hay asistencia registrada.</p>';

  const presentIds = new Set(attRecords.filter(r => r.ingreso).map(r => r.participantId));
  byId('rep-table').innerHTML = participants.map(p => {
    const nv = p.nivel === 'Alto' ? 'bg-green-100 text-green-800' : p.nivel === 'Medio' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
    return `<tr class="border-t border-gray-100 hover:bg-gray-50">
      <td class="px-6 py-3 font-mono text-slate-500">${esc(p.codigo)}</td>
      <td class="px-6 py-3 font-medium">${esc(p.name)}</td>
      <td class="px-6 py-3">${esc(state.programById(p.programId)?.intervencion || '-')}</td>
      <td class="px-6 py-3 text-center"><span class="px-2 py-1 rounded text-xs font-bold ${nv}">${esc(p.nivel)}</span></td>
      <td class="px-6 py-3 text-center">${p.logrado === 'Si' ? '<i class="fa-solid fa-circle-check text-green-600"></i>' : '<i class="fa-solid fa-circle-xmark text-red-400"></i>'}</td>
      <td class="px-6 py-3 text-center">${presentIds.has(p.id) ? '<i class="fa-solid fa-user-check text-green-600"></i>' : '<i class="fa-solid fa-user-xmark text-gray-300"></i>'}</td></tr>`;
  }).join('');
}
