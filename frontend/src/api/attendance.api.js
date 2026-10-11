import { http } from './http.js';

export const getByDate = date => http('/attendance', { query: { date } });
export const saveAll = (date, records) => http('/attendance', { method: 'PUT', body: { date, records } });
