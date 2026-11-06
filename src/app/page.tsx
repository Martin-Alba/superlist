import { Suspense } from "react";
import { CurrentSession } from "./current-session";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Superlist</h1>
      <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
        Crea un grupo, invita a otros y gestionen juntos la lista del
        supermercado.
      </p>
      <Suspense>
        <CurrentSession />
      </Suspense>
    </main>
  );
}
