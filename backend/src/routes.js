import { Router } from 'express';
import { authenticate } from './middlewares/auth.js';
import auth from './modules/auth/auth.routes.js';
import programs from './modules/programs/programs.routes.js';
import participants from './modules/participants/participants.routes.js';
import attendance from './modules/attendance/attendance.routes.js';
import reports from './modules/reports/reports.routes.js';

const api = Router();
api.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
api.use('/auth', auth);                                   // login público; el resto protegido dentro
api.use('/programs', authenticate, programs);
api.use('/participants', authenticate, participants);
api.use('/attendance', authenticate, attendance);
api.use('/reports', authenticate, reports);
export default api;
