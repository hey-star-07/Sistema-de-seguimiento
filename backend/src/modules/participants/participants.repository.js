import { query } from '../../config/db.js';

// Se devuelven con los mismos nombres que usa el frontend actual
const COLS = `id, code::text AS codigo, name, age, program_id AS "programId", need AS necesidad,
  weaknesses AS debilidades, action AS accion, level AS nivel,
  CASE WHEN achieved THEN 'Si' ELSE 'No' END AS logrado, created_at AS date`;

export async function list({ search, programId }) {
  const params = [];
  const where = [];
  if (search) { params.push(`%${search}%`); where.push(`name ILIKE $${params.length}`); }
  if (programId && programId !== 'all') { params.push(programId); where.push(`program_id = $${params.length}`); }
  const sql = `SELECT ${COLS} FROM participants ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC`;
  return (await query(sql, params)).rows;
}

export const findById = async id => (await query(`SELECT ${COLS} FROM participants WHERE id = $1`, [id])).rows[0];

export const create = async d =>
  (await query(
    `INSERT INTO participants (code,name,age,program_id,need,weaknesses,action,level,achieved)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING ${COLS}`,
    [d.codigo, d.name, d.age, d.programId, d.necesidad, d.debilidades, d.accion, d.nivel, d.logrado === 'Si']
  )).rows[0];

export const update = async (id, d) =>
  (await query(
    `UPDATE participants SET code=$2,name=$3,age=$4,program_id=$5,need=$6,weaknesses=$7,action=$8,
       level=$9,achieved=$10,updated_at=now() WHERE id=$1 RETURNING ${COLS}`,
    [id, d.codigo, d.name, d.age, d.programId, d.necesidad, d.debilidades, d.accion, d.nivel, d.logrado === 'Si']
  )).rows[0];

export const remove = async id => (await query('DELETE FROM participants WHERE id = $1', [id])).rowCount > 0;
