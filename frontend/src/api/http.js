import { API_URL } from '../config.js';
import { getToken, clearSession } from './session.js';

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

let onUnauthorized = () => {};
export const setUnauthorizedHandler = fn => { onUnauthorized = fn; };

export async function http(path, { method = 'GET', body, query, auth = true } = {}) {
  const qs = query ? '?' + new URLSearchParams(Object.entries(query).filter(([, v]) => v != null && v !== '')) : '';
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}${qs}`, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Revisa tu conexión.');
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401 && auth) {
      clearSession();
      onUnauthorized();
    }
    const detail = Array.isArray(data?.details) && data.details.length
      ? ' — ' + data.details.map(d => (d.field ? `${d.field}: ` : '') + d.message).join('; ')
      : '';
    throw new ApiError(res.status, (data?.error || `Error ${res.status}`) + detail, data?.details);
  }
  return data;
}
