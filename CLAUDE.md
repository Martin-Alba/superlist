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
