import { isAPIError } from "better-auth/api";
import { z } from "zod";
import type { Auth } from "./auth";

const EMAIL_ERROR = "Introduce un email válido";
const PASSWORD_ERROR = "La contraseña debe tener al menos 8 caracteres";

const registerSchema = z.object({
  email: z.string().trim().pipe(z.email()),
  password: z.string().min(8),
});

export type RegisterErrors = { email?: string; password?: string };

export type RegisterResult =
  | { ok: true }
  | { ok: false; errors: RegisterErrors };

export async function registerUser(
  auth: Auth,
  input: { email: string; password: string },
): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const fields = new Set(parsed.error.issues.map((issue) => issue.path[0]));
    return {
      ok: false,
      errors: {
        ...(fields.has("email") && { email: EMAIL_ERROR }),
        ...(fields.has("password") && { password: PASSWORD_ERROR }),
      },
    };
  }

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
    if (isAPIError(error) && error.body?.code === "PASSWORD_TOO_SHORT") {
      return {
        ok: false,
        errors: { password: PASSWORD_ERROR },
      };
    }
    if (
      isAPIError(error) &&
      error.body?.code === "VALIDATION_ERROR" &&
      error.body.message?.includes("[body.email]")
    ) {
      return {
        ok: false,
        errors: { email: EMAIL_ERROR },
      };
    }
    throw error;
  }
}
