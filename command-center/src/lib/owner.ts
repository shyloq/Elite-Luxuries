import "server-only"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SESSION_COOKIE, verifySession } from "./session"

/** Every server action that reads or changes owner data calls this first. */
export async function requireOwner(): Promise<void> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!(await verifySession(token))) redirect("/command/login")
}
