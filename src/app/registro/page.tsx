import { registerAction } from "./actions";
import { RegisterForm } from "./register-form";

export default function RegistroPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Crea tu cuenta</h1>
      <RegisterForm action={registerAction} />
    </main>
  );
}
