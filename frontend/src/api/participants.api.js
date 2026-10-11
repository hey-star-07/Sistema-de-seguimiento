import { http } from './http.js';

export const list = () => http('/participants');
export const create = data => http('/participants', { method: 'POST', body: data });
export const update = (id, data) => http(`/participants/${id}`, { method: 'PUT', body: data });
export const remove = id => http(`/participants/${id}`, { method: 'DELETE' });
