import type { Auth } from "./auth";

export type RegisterResult = { ok: boolean };

export async function registerUser(
  auth: Auth,
  input: { email: string; password: string },
): Promise<RegisterResult> {
  // Better Auth exige `name`; el formulario no lo pide (nombre fuera de alcance en #1a).
  await auth.api.signUpEmail({ body: { name: "", ...input } });
  return { ok: true };
}
