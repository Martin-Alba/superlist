"use client";

import { useActionState } from "react";
import type { RegisterErrors } from "@/auth/register";

export type RegisterFormState = { errors?: RegisterErrors };

export function RegisterForm({
  action,
}: {
  action: (
    prev: RegisterFormState,
    formData: FormData,
  ) => Promise<RegisterFormState>;
}) {
  const [state, formAction] = useActionState(action, {});
  const errors = state.errors ?? {};

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        aria-invalid={errors.email ? true : undefined}
        aria-describedby={errors.email ? "email-error" : undefined}
      />
      {errors.email && <p id="email-error">{errors.email}</p>}
      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        name="password"
        type="password"
        aria-invalid={errors.password ? true : undefined}
        aria-describedby={errors.password ? "password-error" : undefined}
      />
      {errors.password && <p id="password-error">{errors.password}</p>}
      <button type="submit">Crear cuenta</button>
    </form>
  );
}
