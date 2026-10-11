import './styles/main.css';
import { getToken } from './api/session.js';
import { setUnauthorizedHandler } from './api/http.js';
import { showLogin } from './features/auth/login.js';
import { startApp } from './app.js';

// Si el servidor responde 401 (token vencido), volver al login
setUnauthorizedHandler(() => {
  sessionStorage.setItem('mqv_expired', '1');
  location.reload();
});

if (getToken()) startApp();
else showLogin(startApp);
