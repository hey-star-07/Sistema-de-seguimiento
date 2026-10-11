import { z } from 'zod';

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD');
const time = z.union([z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato HH:MM'), z.literal('')]).default('');

export const dateQuerySchema = z.object({ date: date.optional() });

export const bulkSchema = z.object({
  date,
  records: z.array(z.object({
    participantId: z.string().uuid(),
    ingreso: time,
    salida: time,
  })).max(500),
});
