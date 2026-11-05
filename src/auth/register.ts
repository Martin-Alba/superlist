import { isAPIError } from "better-auth/api";
import type { Auth } from "./auth";

export type RegisterErrors = { email?: string; password?: string };

export type RegisterResult =
  | { ok: true }
  | { ok: false; errors: RegisterErrors };

export async function registerUser(
  auth: Auth,
  input: { email: string; password: string },
): Promise<RegisterResult> {
  try {
    // Better Auth exige `name`; el formulario no lo pide (nombre fuera de alcance en #1a).
    await auth.api.signUpEmail({ body: { name: "", ...input } });
    return { ok: true };
  } catch (error) {
    if (
      isAPIError(error) &&
      error.body?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
    ) {
      return {
        ok: false,
        errors: { email: "Ya existe una cuenta con ese email" },
      };
    }
    if (
      isAPIError(error) &&
      error.body?.code === "VALIDATION_ERROR" &&
      error.body.message?.includes("[body.email]")
    ) {
      return {
        ok: false,
        errors: { email: "Introduce un email válido" },
      };
    }
    throw error;
  }
}
