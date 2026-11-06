import { headers } from "next/headers";
import { auth } from "@/auth";
import { SessionStatus } from "./session-status";

export async function CurrentSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return <SessionStatus email={session?.user.email ?? null} />;
}
