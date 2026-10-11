import { getUser, clearSession } from './api/session.js';
import { listPrograms } from './api/programs.api.js';
import { state } from './store/state.js';
import { byId, $$, show, hide, esc } from './ui/dom.js';
import { toast } from './ui/toast.js';
import { initials } from './utils/format.js';
import * as plan from './features/plan/plan.js';
import * as participants from './features/participants/participants.js';
import * as attendance from './features/attendance/attendance.js';
import * as reports from './features/reports/reports.js';

const features = { dashboard: plan, participants, attendance, reports };
const titles = {
  dashboard: 'Plan Programático',
  participants: 'Gestión de Participantes',
  attendance: 'Registro de Asistencia',
  reports: 'Reportes y Resumen',
};
const ACTIVE = ['bg-slate-700', 'text-orange-400'];
const IDLE = ['text-gray-300', 'hover:bg-slate-700', 'hover:text-white'];

export function logout() {
  clearSession();
  location.reload();
}

export async function startApp() {
  const user = getUser();
  state.user = user;

  byId('user-name').textContent = user.name;
  byId('user-role').textContent = user.role === 'admin' ? 'Administrador' : 'Usuario';
  byId('user-avatar').textContent = initials(user.name);
  byId('current-date').textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  byId('btn-logout').onclick = logout;
  show(byId('app-view'));

  try {
    state.programs = await listPrograms();
  } catch (e) {
    toast(e.message, 'error');
    return;
  }

  participants.init();
  attendance.init();

  $$('.nav-btn').forEach(btn => (btn.onclick = () => switchTab(btn.dataset.tab)));
  await switchTab('dashboard');
}

export async function switchTab(id) {
  $$('.nav-btn').forEach(btn => {
    const on = btn.dataset.tab === id;
    ACTIVE.forEach(c => btn.classList.toggle(c, on));
    IDLE.forEach(c => btn.classList.toggle(c, !on));
  });
  Object.keys(features).forEach(k => {
    const sec = byId(`tab-${k}`);
    k === id ? show(sec) : hide(sec);
  });
  byId('page-title').textContent = titles[id];
  await features[id].load();
}
