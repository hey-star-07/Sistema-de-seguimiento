# M.Q.V 19+ — Sistema de seguimiento

```
mqv-sistema/
├── backend/    Express + PostgreSQL (Neon) + JWT
└── frontend/   Vite + Tailwind + JS modular
```

## 1) Base de datos (Neon)
1. Crea un proyecto en https://neon.tech y copia la cadena de conexión **pooled** (host con `-pooler`).

## 2) Backend (Vercel, proyecto nuevo)
1. En `backend/` copia `.env.example` a `.env` y completa:
   `DATABASE_URL`, `JWT_SECRET` (32+ caracteres), `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
2. Desde tu PC, una sola vez:
   ```bash
   cd backend && npm install
   npm run db:migrate      # crea las tablas
   npm run db:seed         # carga los 3 programas y crea el admin
   ```
3. Sube `backend/` a un repo de GitHub → Vercel → *Add New Project* (Framework: Other).
4. Variables de entorno en Vercel: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN=8h`,
   `CORS_ORIGIN=https://TU-LINK-ACTUAL.vercel.app`, `TIMEZONE=America/La_Paz`, `NODE_ENV=production`.
5. Deploy y prueba `https://TU-BACKEND.vercel.app/api/health`.

## 3) Frontend (mismo link que ya tienes en Vercel)
1. Reemplaza el contenido del repo del frontend por la carpeta `frontend/` (o ponla como *Root Directory*).
2. En Vercel → proyecto actual → *Settings → Environment Variables*:
   `VITE_API_URL=https://TU-BACKEND.vercel.app/api`
3. *Settings → General*: Framework Preset = **Vite** (build `npm run build`, salida `dist`).
4. Haz push (o *Redeploy*). Se publica en el mismo link.

## Notas
- Entra con el `ADMIN_EMAIL` / `ADMIN_PASSWORD` del seed. La app no crea cuentas: para agregar otra, corre `npm run db:seed` con otro `ADMIN_EMAIL`/`ADMIN_PASSWORD`.
- `CORS_ORIGIN` acepta varias URLs separadas por coma (por ejemplo la de Vercel y `http://localhost:5173`).
- Los datos que tenías en `localStorage` del navegador no pasan solos a la base: vuelve a registrarlos.
