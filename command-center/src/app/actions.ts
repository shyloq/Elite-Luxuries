"use server"

import { addToWaitlist, type WaitlistResult } from "@/lib/waitlist"

export async function joinWaitlist(_: WaitlistResult | null, form: FormData): Promise<WaitlistResult> {
  return addToWaitlist(form.get("email"), "landing", form.get("company"))
}
