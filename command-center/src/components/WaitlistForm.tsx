"use client"

import { useActionState } from "react"
import { joinWaitlist } from "@/app/actions"

export function WaitlistForm() {
  const [state, action, pending] = useActionState(joinWaitlist, null)
  if (state?.ok) return <p className="form-done" role="status">You're on the list. We'll email you before the vault opens.</p>
  return (
    <form action={action} className="waitlist" noValidate>
      <label htmlFor="email">Email</label>
      <div className="waitlist__row">
        <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        <button className="btn" type="submit" disabled={pending}>{pending ? "Joining..." : "Join the waitlist"}</button>
      </div>
      {/* Left empty by people; bots fill it in */}
      <input className="hp" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state && !state.ok && <p className="form-error" role="alert">{state.message}</p>}
    </form>
  )
}
