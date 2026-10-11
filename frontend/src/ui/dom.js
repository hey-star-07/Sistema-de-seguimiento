export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const byId = id => document.getElementById(id);

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const show = el => el.classList.remove('hidden');
export const hide = el => el.classList.add('hidden');

export function setBusy(btn, busy) {
  btn.disabled = busy;
  btn.classList.toggle('cursor-wait', busy);
}
