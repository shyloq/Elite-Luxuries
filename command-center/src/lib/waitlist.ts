import "server-only"
import { db } from "./db"
import { EMAIL } from "./content"

export type WaitlistResult = { ok: true } | { ok: false; message: string }

/** `company` is a hidden field people never fill in; bots do, and get a quiet success. */
export async function addToWaitlist(email: unknown, source: unknown, company?: unknown): Promise<WaitlistResult> {
  if (typeof company === "string" && company.trim()) return { ok: true }
  const address = typeof email === "string" ? email.trim().toLowerCase() : ""
  if (!EMAIL.test(address) || address.length > 254) return { ok: false, message: "Enter a valid email address." }
  const from = typeof source === "string" && /^[a-z0-9-]{1,40}$/.test(source) ? source : "landing"
  const { error } = await db().from("waitlist").upsert({ email: address, source: from }, { onConflict: "email", ignoreDuplicates: true })
  if (error) return { ok: false, message: "The waitlist is unavailable. Try again soon." }
  return { ok: true }
}
