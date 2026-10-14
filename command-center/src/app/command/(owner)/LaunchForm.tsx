"use client"

import { useEffect, useState } from "react"
import { saveLaunch } from "../actions"

// The date is entered in the owner's own time zone; the browser sends its offset.
function toLocalInput(iso: string | null) {
  if (!iso) return ""
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function LaunchForm({ name, launchAt }: { name: string; launchAt: string | null }) {
  const [local, setLocal] = useState("")
  const [offset, setOffset] = useState(0)
  useEffect(() => { setLocal(toLocalInput(launchAt)); setOffset(new Date().getTimezoneOffset()) }, [launchAt])
  return (
    <form action={saveLaunch} className="row-form">
      <label>Launch name<input name="name" defaultValue={name} maxLength={60} required /></label>
      <label>Opens<input name="launch_at" type="datetime-local" value={local} onChange={(e) => setLocal(e.target.value)} /></label>
      <input type="hidden" name="tz_offset" value={offset} />
      <button className="btn" type="submit">Save launch</button>
    </form>
  )
}
