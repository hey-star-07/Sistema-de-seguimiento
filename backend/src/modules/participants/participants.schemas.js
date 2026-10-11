import { z } from 'zod';

export const participantSchema = z.object({
  codigo: z.coerce.number().int().positive(),
  name: z.string().trim().min(2).max(120),
  age: z.coerce.number().int().min(0).max(99),
  programId: z.string().min(1),
  necesidad: z.string().trim().min(1).max(1000),
  debilidades: z.string().trim().min(1).max(1000),
  accion: z.string().trim().min(1).max(1000),
  nivel: z.enum(['Bajo', 'Medio', 'Alto']).default('Medio'),
  logrado: z.enum(['Si', 'No']).default('No'),
});

export const listQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  programId: z.string().max(30).optional(),
});

export const idParamSchema = z.object({ id: z.string().uuid('ID inválido') });
