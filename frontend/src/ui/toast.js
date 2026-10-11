import { byId } from './dom.js';

let timer;
export function toast(msg, type = 'success') {
  const n = byId('notification');
  byId('notif-msg').textContent = msg;
  byId('notif-icon').className =
    type === 'success' ? 'fa-solid fa-check-circle text-green-400 mr-3 text-xl'
    : type === 'error' ? 'fa-solid fa-circle-exclamation text-red-400 mr-3 text-xl'
    : 'fa-solid fa-info-circle text-blue-400 mr-3 text-xl';
  n.classList.remove('translate-y-20', 'opacity-0');
  clearTimeout(timer);
  timer = setTimeout(() => n.classList.add('translate-y-20', 'opacity-0'), type === 'error' ? 5000 : 3000);
}
