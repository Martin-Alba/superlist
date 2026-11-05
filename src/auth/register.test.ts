// @vitest-environment node
import { afterEach, beforeEach, expect, test } from "vitest";
import { eq } from "drizzle-orm";
import { session, user } from "@/db/schema";
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

test("tras registrarse queda una sesión iniciada para ese email", async () => {
  await registerUser(auth, {
    email: "ana@test.com",
    password: "contraseña-segura",
  });

  const sessions = await testDb.db
    .select({ email: user.email })
    .from(session)
    .innerJoin(user, eq(session.userId, user.id));
  expect(sessions).toEqual([{ email: "ana@test.com" }]);
});

test("el email se guarda sin espacios y en minúsculas", async () => {
  await expect(
    registerUser(auth, {
      email: "  Ana@Test.com ",
      password: "contraseña-segura",
    }),
  ).resolves.toMatchObject({ ok: true });

  const users = await testDb.db.select({ email: user.email }).from(user);
  expect(users).toEqual([{ email: "ana@test.com" }]);
});

test("rechaza un email ya registrado con otras mayúsculas", async () => {
  await registerUser(auth, {
    email: "ana@test.com",
    password: "contraseña-segura",
  });

  await expect(
    registerUser(auth, {
      email: "Ana@test.com",
      password: "otra-contraseña-segura",
    }),
  ).resolves.toEqual({
    ok: false,
    errors: { email: "Ya existe una cuenta con ese email" },
  });

  const users = await testDb.db.select({ email: user.email }).from(user);
  expect(users).toEqual([{ email: "ana@test.com" }]);
});

test("rechaza un email ya registrado con espacios alrededor", async () => {
  await registerUser(auth, {
    email: "ana@test.com",
    password: "contraseña-segura",
  });

  await expect(
    registerUser(auth, {
      email: "  ana@test.com ",
      password: "otra-contraseña-segura",
    }),
  ).resolves.toEqual({
    ok: false,
    errors: { email: "Ya existe una cuenta con ese email" },
  });

  const users = await testDb.db.select({ email: user.email }).from(user);
  expect(users).toEqual([{ email: "ana@test.com" }]);
});
