import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler as h } from '../../utils/asyncHandler.js';
import { validate } from '../../middlewares/validate.js';
import * as repo from './reports.repository.js';
import { today } from '../../utils/today.js';

const q = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() });

const r = Router();
r.get('/summary', validate(q, 'query'), h(async (req, res) => {
  res.json(await repo.summary(req.query.date || today()));
}));
export default r;
