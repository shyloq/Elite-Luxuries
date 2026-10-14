"use client"

import { useActionState } from "react"
import { login } from "../actions"

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null)
  return (
    <form action={action} className="stack">
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn" type="submit" disabled={pending}>{pending ? "Checking..." : "Open"}</button>
    </form>
  )
}
