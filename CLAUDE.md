@AGENTS.md

## Context
Lista de la compra compartida para grupos (familia, piso, pareja): sus miembros apuntan qué comprar, con unidades, precio y tienda. El análisis de compras viene después del MVP.

Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4 + pnpm · Postgres (Neon) + Drizzle · Better Auth · Vitest + Playwright · Vercel

Expensive decisions:
- Multi-tenant: cada grupo es un espacio aislado; un usuario puede estar en varios grupos.
- Roles: dueño / miembro, con la propiedad transferible.
- Solo online en el MVP (offline se evalúa después).
- Solo español y EUR; precios guardados en céntimos (1 € = 100).

## Conventions
- Base de datos: las funciones que acceden a datos reciben la base como parámetro de tipo `PgDatabase` (no importan `@/db`), para que los tests les pasen PGlite (`createTestDb()`) y la app les pase Neon.
- Migraciones: el build de Vercel migra con `pnpm db:migrate && pnpm build` (`vercel.json`); `pnpm build` en local no migra, se hace a mano con `pnpm db:migrate`. La rama `dev` de Neon (la que usa el e2e) y cada rama `preview/*` deben estar migradas.
- Si un preview de Vercel falla en "Provisioning Integrations" → "Create database branch for deployment" (antes del build, sin logs, ~3 min y "Resource provisioning timed out"): borrar la rama `preview/<rama-de-git>` en la consola de Neon y hacer Redeploy. Pasó en #1a (5-nov-2026) con causa sin identificar; si se repite, abrir un caso de soporte con los ids de despliegue y la ausencia de operaciones en la rama de Neon.
