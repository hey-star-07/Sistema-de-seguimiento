import { state } from '../../store/state.js';
import { byId, esc } from '../../ui/dom.js';

const CARD_STYLE = [
  { bg: 'bg-blue-50 border-blue-100', ic: 'bg-blue-100 text-blue-600', icon: 'fa-cross' },
  { bg: 'bg-green-50 border-green-100', ic: 'bg-green-100 text-green-600', icon: 'fa-shield-alt' },
  { bg: 'bg-rose-50 border-rose-100', ic: 'bg-rose-100 text-rose-600', icon: 'fa-heart-pulse' },
];

export function load() {
  const mark = v => (v ? '<i class="fa-solid fa-xmark text-orange-600 font-bold text-lg"></i>' : '');
  byId('plan-table-body').innerHTML = state.programs.map(r => `
    <tr class="border-b border-gray-200 hover:bg-orange-50 transition-colors">
      <td class="px-6 py-4 align-top border-r border-gray-200"><span class="inline-block px-2 py-1 rounded text-xs font-bold shadow-sm" style="background:${esc(r.hex)};color:#fff">${esc(r.programa)}</span></td>
      <td class="px-6 py-4 align-top text-sm text-gray-700 bg-orange-100/30 border-r border-gray-200">${esc(r.resultado)}</td>
      <td class="px-6 py-4 align-top text-sm font-medium text-gray-800 bg-orange-100/50 border-r border-gray-200">${esc(r.indicador)}</td>
      <td class="px-6 py-4 align-middle text-center border-r border-gray-200"><span class="bg-orange-200 text-orange-800 py-1.5 px-3 rounded-md font-bold shadow-sm inline-block w-full">${esc(r.intervencion)}</span></td>
      ${[2026, 2027, 2028].map(y => `<td class="px-3 py-4 text-center bg-orange-50/50">${mark(r.years?.[y])}</td>`).join('')}
    </tr>`).join('');

  byId('plan-cards').innerHTML = state.programs.map((p, i) => {
    const s = CARD_STYLE[i % CARD_STYLE.length];
    return `<div class="${s.bg} border rounded-lg p-5 flex items-center shadow-sm">
      <div class="rounded-full ${s.ic} p-3 mr-4 w-12 h-12 flex items-center justify-center"><i class="fa-solid ${s.icon} text-xl"></i></div>
      <div><p class="text-sm text-gray-500 font-medium">Programa ${i + 1}</p><p class="text-lg font-bold text-gray-800">${esc(p.programa)}</p></div></div>`;
  }).join('');
}
