"use client";

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
  void action;
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" />
      <label htmlFor="password">Contraseña</label>
      <input id="password" name="password" type="password" />
      <button type="submit">Crear cuenta</button>
    </form>
  );
}
