// Comprueba la conexión a Neon con las URLs de .env.local. Uso: pnpm db:check
// @next/env y pg son CommonJS: en ESM solo exponen el export por defecto.
import nextEnv from "@next/env";
import pg from "pg";

nextEnv.loadEnvConfig(process.cwd());

let failed = false;

for (const name of ["DATABASE_URL", "DATABASE_URL_UNPOOLED"]) {
  const url = process.env[name];
  if (!url) {
    console.error(`✗ ${name}: no está definida en .env.local`);
    failed = true;
    continue;
  }
  const client = new pg.Client({
    connectionString: url,
    connectionTimeoutMillis: 10_000,
  });
  try {
    await client.connect();
    const { rows } = await client.query("select current_database() as db");
    console.log(`✓ ${name}: conectado a "${rows[0].db}"`);
  } catch (error) {
    console.error(`✗ ${name}:`, error instanceof Error ? error.message : error);
    failed = true;
  } finally {
    await client.end().catch(() => {});
  }
}

process.exit(failed ? 1 : 0);
