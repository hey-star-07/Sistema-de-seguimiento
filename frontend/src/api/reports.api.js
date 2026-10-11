import { http } from './http.js';
export const summary = date => http('/reports/summary', { query: { date } });
