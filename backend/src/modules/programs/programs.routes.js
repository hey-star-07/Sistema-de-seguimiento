import { Router } from 'express';
import { query } from '../../config/db.js';
import { asyncHandler as h } from '../../utils/asyncHandler.js';

const r = Router();
r.get('/', h(async (_req, res) => {
  const { rows } = await query(
    `SELECT id, name AS programa, intervention AS intervencion, result AS resultado, indicator AS indicador,
            years, color_class AS "colorClass", hex, meta, ok_text AS "okText", ko_text AS "koText"
     FROM programs ORDER BY id`);
  res.json(rows);
}));
export default r;
