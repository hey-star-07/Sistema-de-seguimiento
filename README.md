# M.Q.V 19+ — Sistema de seguimiento

```
mqv-sistema/
├── backend/    Express + PostgreSQL (Neon) + JWT
└── frontend/   Vite + Tailwind + JS modular
```

## 1) Base de datos (Neon)
1. Crea un proyecto en https://neon.tech y copia la cadena de conexión **pooled** (host con `-pooler`).

## 2) Backend
1. En `backend/` copia `.env.example` a `.env` y completa:
   `DATABASE_URL`, `JWT_SECRET` (32+ caracteres), `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
2. Desde tu PC, una sola vez:
   ```bash
   cd backend && npm install
   npm run db:migrate      # crea las tablas
   npm run db:seed         # carga los 3 programas y crea el admin
   ```


## Notas
- Entra con el `ADMIN_EMAIL` / `ADMIN_PASSWORD` del seed. La app no crea cuentas: para agregar otra, corre `npm run db:seed` con otro `ADMIN_EMAIL`/`ADMIN_PASSWORD`.
- `CORS_ORIGIN` acepta varias URLs separadas por coma (por ejemplo la de Vercel y `http://localhost:5173`).
