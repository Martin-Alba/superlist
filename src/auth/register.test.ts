// @vitest-environment node
import { afterEach, beforeEach, expect, test } from "vitest";
import { user } from "@/db/schema";
import { createTestDb } from "@/db/test-db";
import { createAuth } from "./auth";
import { registerUser } from "./register";

let testDb: Awaited<ReturnType<typeof createTestDb>>;
let auth: ReturnType<typeof createAuth>;

beforeEach(async () => {
  testDb = await createTestDb();
  auth = createAuth(testDb.db, {
    secret: "secreto-solo-para-tests-0123456789abcdef",
    baseURL: "http://localhost:3000",
  });
});

afterEach(async () => {
  await testDb.close();
});

test("registrarse con email y contraseña válidos crea la cuenta", async () => {
  const result = await registerUser(auth, {
    email: "ana@test.com",
    password: "contraseña-segura",
  });

  expect(result.ok).toBe(true);
  const users = await testDb.db.select({ email: user.email }).from(user);
  expect(users).toEqual([{ email: "ana@test.com" }]);
});
