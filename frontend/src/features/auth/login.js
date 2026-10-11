import * as authApi from '../../api/auth.api.js';
import { setSession } from '../../api/session.js';
import { byId, show, hide, setBusy } from '../../ui/dom.js';

export function showLogin(onSuccess) {
  show(byId('login-view'));
  hide(byId('app-view'));

  const expired = sessionStorage.getItem('mqv_expired');
  const err = byId('login-error');
  if (expired) {
    err.textContent = 'Tu sesión expiró. Vuelve a ingresar.';
    show(err);
    sessionStorage.removeItem('mqv_expired');
  }

  // Ojito: mostrar / ocultar contraseña
  const pass = byId('login-password'), eye = byId('toggle-password');
  pass.type = 'password';
  eye.onclick = () => {
    const visible = pass.type === 'password';
    pass.type = visible ? 'text' : 'password';
    eye.innerHTML = `<i class="fa-solid ${visible ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
    eye.setAttribute('aria-pressed', String(visible));
    eye.setAttribute('aria-label', visible ? 'Ocultar contraseña' : 'Mostrar contraseña');
    eye.title = visible ? 'Ocultar contraseña' : 'Mostrar contraseña';
    pass.focus();
  };

  const form = byId('login-form');
  form.onsubmit = async e => {
    e.preventDefault();
    hide(err);
    const email = byId('login-email').value.trim();
    const password = byId('login-password').value;
    if (!email || !password) { err.textContent = 'Ingresa tu correo y contraseña.'; show(err); return; }

    const btn = byId('login-submit');
    setBusy(btn, true);
    btn.textContent = 'Ingresando...';
    try {
      const { token, user } = await authApi.login(email, password);
      setSession({ token, user });
      byId('login-password').value = '';
      pass.type = 'password';
      hide(byId('login-view'));
      onSuccess();
    } catch (ex) {
      err.textContent = ex.message;
      show(err);
    } finally {
      setBusy(btn, false);
      btn.textContent = 'Ingresar';
    }
  };
}
