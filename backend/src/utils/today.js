import { env } from '../config/env.js';

// Fecha de hoy (YYYY-MM-DD) en la zona horaria configurada, no en UTC
export const today = () => new Date().toLocaleDateString('en-CA', { timeZone: env.timezone });
