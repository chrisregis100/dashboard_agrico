# AGENTS.md

## Cursor Cloud specific instructions

Dashboard AGRICO is a two-service app (no monorepo tool): an Express + Prisma API in `backend/`
and a Next.js App Router dashboard in `frontend/`. They are independent npm projects with their
own `package-lock.json`. Standard commands, env vars, and demo accounts are documented in
`README.md`; only non-obvious startup caveats are captured here.

### Services & how to run
- Backend API (`backend/`): `npm run dev` — Express on port `4000` (`tsx watch`, hot reload).
- Frontend (`frontend/`): `npm run dev` — Next.js on port `3000`. It proxies `/api/*`
  (including `/api/auth/*`) to the backend via a rewrite in `next.config.ts`, so the browser
  talks only to port 3000. Always exercise the app through `http://localhost:3000`.
- Lint: `cd frontend && npm run lint` (the backend has no lint script). Lint currently reports
  pre-existing issues in `components/forms/SaleForm.tsx` and `hooks/use-mobile.ts` — these are
  not environment problems.
- No automated test suite exists (Vitest/Playwright are only on the README roadmap).

### PostgreSQL (non-obvious)
- The app requires PostgreSQL. It is installed locally (cluster `16 main`) but is NOT started
  automatically on boot. Start it before running the backend:
  `sudo pg_ctlcluster 16 main start`
- Local connection used by `backend/.env`: `postgresql://postgres:postgres@localhost:5432/agrico`
  (do NOT append `sslmode=require` for the local DB — that is only for hosted/Neon).

### Environment files (non-obvious)
- `backend/.env` and `frontend/.env.local` are git-ignored, so they are never committed and are
  only preserved by the VM snapshot. If they are missing, recreate them:
  - `backend/.env`: `DATABASE_URL` (local string above), `BETTER_AUTH_SECRET` (>=32 chars),
    `BETTER_AUTH_URL=http://localhost:4000`, `FRONTEND_URL=http://localhost:3000`, `PORT=4000`.
  - `frontend/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:4000`,
    `NEXT_PUBLIC_APP_URL=http://localhost:3000`.

### Database schema & seed
- Schema sync (not a migration): `cd backend && npx prisma db push`.
- Seed demo data: `cd backend && npm run db:seed` (creates 5 users, 10 produits, 40 clients,
  ~600 ventes). Demo admin login: `admin@agrico.bj` / `Admin2024!`.
- The seed is idempotent-ish for setup but re-running adds/refreshes demo rows; only reseed if the
  DB is empty or you intentionally want to reset demo data.
