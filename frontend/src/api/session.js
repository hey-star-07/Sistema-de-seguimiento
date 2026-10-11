const KEY = 'mqv_session';

export const getSession = () => {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
};
export const setSession = session => localStorage.setItem(KEY, JSON.stringify(session));
export const clearSession = () => localStorage.removeItem(KEY);
export const getToken = () => getSession()?.token || null;
export const getUser = () => getSession()?.user || null;
