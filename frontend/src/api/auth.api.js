import { http } from './http.js';

export const login = (email, password) => http('/auth/login', { method: 'POST', body: { email, password }, auth: false });
export const me = () => http('/auth/me');
