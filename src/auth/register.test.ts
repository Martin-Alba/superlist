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

function signUpRequest(email: string) {
  return new Request("http://localhost:3000/api/auth/sign-up/email", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "",
      email,
      password: "contraseña-segura",
    }),
  });
}

test("por el endpoint público, ' Ana@Test.com ' con ana@test.com ya existente responde 422 USER_ALREADY_EXISTS y sigue habiendo 1 usuario", async () => {
  await registerUser(auth, {
    email: "ana@test.com",
    password: "contraseña-segura",
  });

  const response = await auth.handler(signUpRequest(" Ana@Test.com "));

  expect(response.status).toBe(422);
  expect(await response.json()).toMatchObject({
    code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
  });
  const users = await testDb.db.select({ email: user.email }).from(user);
  expect(users).toEqual([{ email: "ana@test.com" }]);
});

test("por el endpoint público, ' Ana@Test.com ' sin cuenta previa crea la cuenta guardada como ana@test.com", async () => {
  const response = await auth.handler(signUpRequest(" Ana@Test.com "));

  expect(response.status).toBe(200);
  const users = await testDb.db.select({ email: user.email }).from(user);
  expect(users).toEqual([{ email: "ana@test.com" }]);
});

test("rechaza un email con formato incorrecto indicando el campo email", async () => {
  await expect(
    registerUser(auth, {
      email: "no-es-un-email",
      password: "contraseña-segura",
    }),
  ).resolves.toEqual({
    ok: false,
    errors: { email: "Introduce un email válido" },
  });

  const users = await testDb.db.select({ email: user.email }).from(user);
  expect(users).toEqual([]);
});

test("rechaza una contraseña de 7 caracteres indicando el campo contraseña", async () => {
  await expect(
    registerUser(auth, { email: "ana@test.com", password: "1234567" }),
  ).resolves.toEqual({
    ok: false,
    errors: { password: "La contraseña debe tener al menos 8 caracteres" },
  });

  const users = await testDb.db.select({ email: user.email }).from(user);
  expect(users).toEqual([]);
});

test("acepta una contraseña de exactamente 8 caracteres", async () => {
  await expect(
    registerUser(auth, { email: "ana@test.com", password: "12345678" }),
  ).resolves.toEqual({ ok: true });

  const users = await testDb.db.select({ email: user.email }).from(user);
  expect(users).toEqual([{ email: "ana@test.com" }]);
});
