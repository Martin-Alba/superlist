import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Un pool por instancia (Fluid Compute la reutiliza entre requests).
// attachDatabasePool cierra las conexiones inactivas antes de que Vercel suspenda la instancia.
function createPool() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 5000,
  });
  attachDatabasePool(pool);
  return pool;
}

// En desarrollo el HMR reevalúa este módulo: reutilizamos el pool para no abrir uno nuevo en cada cambio.
const globalForDb = globalThis as unknown as { pool?: Pool };
const pool = globalForDb.pool ?? createPool();
if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export const db = drizzle({ client: pool, schema });
