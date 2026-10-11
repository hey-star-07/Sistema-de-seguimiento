# M.Q.V 19+ — Backend

Express + PostgreSQL (Neon) + JWT. Arquitectura por módulos: `routes → controller → repository`.

## Local
```bash
npm install
cp .env.example .env     # completa DATABASE_URL (Neon) y JWT_SECRET
npm run db:migrate       # crea tablas
npm run db:seed          # programas del plan + usuario admin
npm run dev
```

## Endpoints (todos con `Authorization: Bearer <token>` salvo login)
| Método | Ruta | Descripción |
|---|---|---|
| POST | /api/auth/login | `{email,password}` → `{token,user}` |
| GET | /api/auth/me | usuario actual |
| GET | /api/programs | plan programático |
| GET/POST | /api/participants | listar (`?search=&programId=`) / crear |
| GET/PUT/DELETE | /api/participants/:id | detalle / editar / eliminar |
| GET | /api/attendance?date=YYYY-MM-DD | asistencia de todos en esa fecha |
| PUT | /api/attendance | guardado general `{date, records:[{participantId,ingreso,salida}]}` |
| GET | /api/reports/summary?date= | datos del resumen y gráficos |

## Deploy (Vercel, gratis y sin "dormirse")
1. Sube la carpeta `backend/` a un repo (o ponla como Root Directory en Vercel).
2. Nuevo proyecto en Vercel → Framework "Other".
3. Variables de entorno: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN` (URL de tu frontend), `NODE_ENV=production`.
4. Deploy. Las migraciones se corren una vez desde tu PC con el `.env` apuntando a Neon.
