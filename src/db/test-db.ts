import { existsSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "./schema";

const migrationsFolder = path.resolve(process.cwd(), "drizzle");

// Postgres en memoria para tests. Aplica las migraciones de ./drizzle si existen.
export async function createTestDb() {
  const client = new PGlite();
  const db = drizzle({ client, schema });

  if (existsSync(path.join(migrationsFolder, "meta/_journal.json"))) {
    await migrate(db, { migrationsFolder });
  }

  return { db, close: () => client.close() };
}
