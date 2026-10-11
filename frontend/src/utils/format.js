const pad = n => String(n).padStart(2, '0');

// Fecha local (no UTC) en formato YYYY-MM-DD
export const todayLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
export const nowHHMM = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
export const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
export const shortDate = iso => {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
};
export const initials = name =>
  (name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || '?';
