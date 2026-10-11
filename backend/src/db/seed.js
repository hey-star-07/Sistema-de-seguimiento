import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

const programs = [
  { id: 'prog1', name: 'Crecimiento en Cristo', intervention: 'Más que Vencedores',
    result: 'Los niños y jóvenes se sienten conectados y comprometidos con Dios, están integrados en una comunidad de fe y practican disciplinas bíblicas y otras prácticas espirituales.',
    indicator: '60% de los participantes (18) de 19+ años, realiza servicio en la iglesia semanalmente.',
    years: { 2026: true, 2027: false, 2028: true }, color_class: 'bg-blue-600 text-white', hex: '#2563eb', meta: 60,
    ok_text: 'realiza servicio en la iglesia semanalmente', ko_text: 'aún no realiza servicio semanal' },
  { id: 'prog2', name: 'Protección Infantil', intervention: 'Abrigo del Mañana',
    result: 'Los niños y jóvenes están seguros y no sufren formas violentas de castigo.',
    indicator: '30% de los participantes (37) de 19+ años, sufrió formas violentas de castigo tales como agresión psicológica o castigo físico.',
    years: { 2026: true, 2027: true, 2028: true }, color_class: 'bg-emerald-600 text-white', hex: '#059669', meta: 70,
    ok_text: 'está seguro y no sufre castigo violento', ko_text: 'aún sufre formas violentas de castigo' },
  { id: 'prog3', name: 'Salud Sexual y Reproductiva', intervention: 'Un Pacto con Dios',
    result: 'Los niños y jóvenes demuestran conocimientos básicos sobre prevención de embarazos a temprana edad y enfermedades de transmisión sexual.',
    indicator: '51% de los participantes (37) de 19+ años tiene conocimientos sobre Salud Sexual y Reproductiva.',
    years: { 2026: true, 2027: true, 2028: true }, color_class: 'bg-teal-700 text-white', hex: '#0f766e', meta: 51,
    ok_text: 'tiene conocimientos sobre salud sexual y reproductiva', ko_text: 'aún no demuestra esos conocimientos' },
];

for (const p of programs) {
  await pool.query(
    `INSERT INTO programs (id,name,intervention,result,indicator,years,color_class,hex,meta,ok_text,ko_text)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     ON CONFLICT (id) DO UPDATE SET name=$2,intervention=$3,result=$4,indicator=$5,years=$6,
       color_class=$7,hex=$8,meta=$9,ok_text=$10,ko_text=$11`,
    [p.id, p.name, p.intervention, p.result, p.indicator, JSON.stringify(p.years), p.color_class, p.hex, p.meta, p.ok_text, p.ko_text]
  );
}
console.log('✔ Programas cargados');

const { ADMIN_NAME = 'Administrador', ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (ADMIN_EMAIL && ADMIN_PASSWORD) {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await pool.query(
    `INSERT INTO users (name,email,password_hash,role) VALUES ($1,$2,$3,'admin')
     ON CONFLICT (email) DO NOTHING`,
    [ADMIN_NAME, ADMIN_EMAIL.toLowerCase(), hash]
  );
  console.log(`✔ Admin listo: ${ADMIN_EMAIL}`);
} else {
  console.log('! ADMIN_EMAIL / ADMIN_PASSWORD no definidos: no se creó admin');
}
await pool.end();
