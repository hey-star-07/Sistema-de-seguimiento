import * as repo from './attendance.repository.js';
import { today } from '../../utils/today.js';

export async function list(req, res) {
  const date = req.query.date || today();
  res.json({ date, records: await repo.listByDate(date) });
}

export async function saveBulk(req, res) {
  const { date, records } = req.body;
  const saved = await repo.saveBulk(date, records);
  res.json({ date, saved });
}
