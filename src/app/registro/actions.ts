"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { registerUser } from "@/auth/register";
import type { RegisterFormState } from "./register-form";

export async function registerAction(
  _prev: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const result = await registerUser(auth, {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!result.ok) return { errors: result.errors };
  redirect("/");
}
