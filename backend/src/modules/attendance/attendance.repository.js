import { query, withTransaction } from '../../config/db.js';

export async function listByDate(date) {
  const { rows } = await query(
    `SELECT p.id AS "participantId", p.code::text AS codigo, p.name,
            COALESCE(to_char(a.check_in,'HH24:MI'),'') AS ingreso,
            COALESCE(to_char(a.check_out,'HH24:MI'),'') AS salida
     FROM participants p
     LEFT JOIN attendance a ON a.participant_id = p.id AND a.date = $1
     ORDER BY p.code`, [date]);
  return rows;
}

// Guarda la asistencia de todos de una sola vez (una transacción)
export const saveBulk = (date, records) => withTransaction(async client => {
  for (const r of records) {
    if (!r.ingreso && !r.salida) {
      await client.query('DELETE FROM attendance WHERE participant_id=$1 AND date=$2', [r.participantId, date]);
    } else {
      await client.query(
        `INSERT INTO attendance (participant_id,date,check_in,check_out) VALUES ($1,$2,$3,$4)
         ON CONFLICT (participant_id,date) DO UPDATE SET check_in=EXCLUDED.check_in, check_out=EXCLUDED.check_out`,
        [r.participantId, date, r.ingreso || null, r.salida || null]);
    }
  }
  return records.length;
});
