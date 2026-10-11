import { query } from '../../config/db.js';

export async function summary(date) {
  const [totals, programs, ages, today, history] = await Promise.all([
    query(`SELECT count(*)::int AS total, count(*) FILTER (WHERE achieved)::int AS achieved,
                  COALESCE(round(avg(age)),0)::int AS "avgAge" FROM participants`),
    query(`SELECT pr.id, pr.name AS programa, pr.intervention AS intervencion, pr.meta, pr.hex,
                  pr.ok_text AS "okText", pr.ko_text AS "koText",
                  count(p.id)::int AS total,
                  count(p.id) FILTER (WHERE p.achieved)::int AS achieved,
                  count(p.id) FILTER (WHERE p.level='Bajo')::int AS bajo,
                  count(p.id) FILTER (WHERE p.level='Medio')::int AS medio,
                  count(p.id) FILTER (WHERE p.level='Alto')::int AS alto
           FROM programs pr LEFT JOIN participants p ON p.program_id = pr.id
           GROUP BY pr.id ORDER BY pr.id`),
    query(`SELECT count(*) FILTER (WHERE age<=18)::int AS "r18",
                  count(*) FILTER (WHERE age BETWEEN 19 AND 21)::int AS "r19_21",
                  count(*) FILTER (WHERE age BETWEEN 22 AND 25)::int AS "r22_25"
           FROM participants`),
    query(`SELECT count(*) FILTER (WHERE check_in IS NOT NULL)::int AS present FROM attendance WHERE date=$1`, [date]),
    query(`SELECT to_char(date,'YYYY-MM-DD') AS date, count(*) FILTER (WHERE check_in IS NOT NULL)::int AS present
           FROM attendance GROUP BY date ORDER BY date DESC LIMIT 10`),
  ]);

  const t = totals.rows[0];
  const a = ages.rows[0];
  return {
    totals: { ...t, notAchieved: t.total - t.achieved },
    programs: programs.rows,
    ages: [
      { label: '≤18', count: a.r18 }, { label: '19-21', count: a.r19_21 }, { label: '22-25', count: a.r22_25 },
    ],
    attendance: { date, present: today.rows[0].present, absent: t.total - today.rows[0].present, history: history.rows.reverse() },
  };
}
