// Gráficos simples en SVG/CSS (sin librerías)
export const COLORS = { ok: '#16a34a', ko: '#f87171', low: '#f87171', mid: '#facc15', high: '#22c55e', bar: '#fb923c' };

export function donut(percent, color, size = 150, sub = '') {
  const r = 40, c = 2 * Math.PI * r, d = (c * percent) / 100;
  return `<div class="relative" style="width:${size}px;height:${size}px">
    <svg viewBox="0 0 100 100" class="-rotate-90 w-full h-full">
      <circle cx="50" cy="50" r="${r}" fill="none" stroke-width="12" class="ring-bg"/>
      ${percent > 0 ? `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="${percent >= 100 ? 'butt' : 'round'}" class="donut-arc" stroke-dasharray="${d} ${c}"/>` : ''}
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="font-black text-gray-800" style="font-size:${Math.round(size * 0.2)}px;line-height:1">${percent}%</span>
      <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">${sub}</span>
    </div></div>`;
}

export function columnChart(items, { color = COLORS.bar, maxBarPx = 110 } = {}) {
  const max = Math.max(...items.map(i => i.value), 1);
  return items.map(i => `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%">
      <span style="font-size:12px;font-weight:700;color:#4b5563;margin-bottom:4px">${i.value}</span>
      <div style="width:100%;max-width:56px;background:${color};border-radius:6px 6px 0 0;height:${i.value ? Math.max(8, (i.value / max) * maxBarPx) : 2}px"></div>
      <span style="font-size:12px;color:#6b7280;margin-top:8px">${i.label}</span>
    </div>`).join('');
}
