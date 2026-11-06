import Link from "next/link";

export function SessionStatus({ email }: { email: string | null }) {
  if (email === null) {
    return <Link href="/registro">Crear cuenta</Link>;
  }
  return <p>Sesión iniciada como {email}</p>;
}
