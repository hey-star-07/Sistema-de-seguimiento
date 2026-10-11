import { query } from '../../config/db.js';

const PUBLIC = 'id, name, email, role, created_at AS "createdAt"';

export const findByEmail = async email =>
  (await query('SELECT id, name, email, role, password_hash AS "passwordHash" FROM users WHERE email = $1', [email.toLowerCase()])).rows[0];

export const findById = async id =>
  (await query(`SELECT ${PUBLIC} FROM users WHERE id = $1`, [id])).rows[0];
