import { byId } from './dom.js';

// confirmDialog({ title, message, confirmText }) → Promise<boolean>
export function confirmDialog({ title, message, confirmText = 'Eliminar' }) {
  const modal = byId('confirm-modal');
  byId('confirm-title').textContent = title;
  byId('confirm-message').textContent = message;
  byId('confirm-ok').textContent = confirmText;
  modal.classList.remove('opacity-0', 'pointer-events-none');

  return new Promise(resolve => {
    const done = value => {
      modal.classList.add('opacity-0', 'pointer-events-none');
      byId('confirm-ok').onclick = byId('confirm-cancel').onclick = byId('confirm-backdrop').onclick = null;
      resolve(value);
    };
    byId('confirm-ok').onclick = () => done(true);
    byId('confirm-cancel').onclick = () => done(false);
    byId('confirm-backdrop').onclick = () => done(false);
  });
}
