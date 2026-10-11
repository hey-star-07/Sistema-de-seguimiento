import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pool } from '../config/db.js';

const sql = readFileSync(fileURLToPath(new URL('./schema.sql', import.meta.url)), 'utf8');
await pool.query(sql);
console.log('✔ Migración aplicada');
await pool.end();
