// @vitest-environment node
import { sql } from "drizzle-orm";
import { expect, test } from "vitest";
import { createTestDb } from "./test-db";

test("crea una base PGlite con la que se puede consultar", async () => {
  const { db, close } = await createTestDb();

  const result = await db.execute(sql`select 1 as ok`);
  expect(result.rows).toEqual([{ ok: 1 }]);

  await close();
});
