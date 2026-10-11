import { AppError } from '../../utils/AppError.js';
import * as repo from './participants.repository.js';

export const list = async (req, res) => res.json(await repo.list(req.query));

export async function get(req, res) {
  const p = await repo.findById(req.params.id);
  if (!p) throw new AppError(404, 'Participante no encontrado');
  res.json(p);
}

export const create = async (req, res) => res.status(201).json(await repo.create(req.body));

export async function update(req, res) {
  const p = await repo.update(req.params.id, req.body);
  if (!p) throw new AppError(404, 'Participante no encontrado');
  res.json(p);
}

export async function remove(req, res) {
  if (!(await repo.remove(req.params.id))) throw new AppError(404, 'Participante no encontrado');
  res.status(204).end();
}
