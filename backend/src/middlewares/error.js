import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export const notFound = (_req, _res, next) => next(new AppError(404, 'Ruta no encontrada'));

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: err.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
    });
  }
  if (err instanceof AppError) return res.status(err.status).json({ error: err.message, details: err.details });
  if (err.code === '23505') return res.status(409).json({ error: 'Ya existe un registro con ese valor único (código o correo)' });
  if (err.code === '23503') return res.status(400).json({ error: 'Referencia inválida (programa o participante inexistente)' });
  if (err.code === '22P02') return res.status(400).json({ error: 'Identificador con formato inválido' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido' });

  console.error(err);
  res.status(500).json({ error: env.nodeEnv === 'production' ? 'Error interno del servidor' : err.message });
}
