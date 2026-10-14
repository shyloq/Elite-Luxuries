"use client"

import { useEffect, useState } from "react"

const pad = (n: number) => String(n).padStart(2, "0")

/** Days, hours, minutes and seconds to the launch, ticking on the second. */
export function Countdown({ launchAt }: { launchAt: string | null }) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!launchAt) return <p className="countdown countdown--tba">Date to be announced</p>
  const target = new Date(launchAt).getTime()
  if (now === null) return <p className="countdown" aria-hidden="true">--:--:--:--</p>
  const left = Math.max(0, Math.floor((target - now) / 1000))
  if (left === 0) return <p className="countdown">Open now</p>
  const d = Math.floor(left / 86400), h = Math.floor((left % 86400) / 3600), m = Math.floor((left % 3600) / 60), s = left % 60
  return (
    <p className="countdown" role="timer" aria-label={`${d} days, ${h} hours, ${m} minutes to go`}>
      <span><b>{pad(d)}</b>d</span><span><b>{pad(h)}</b>h</span><span><b>{pad(m)}</b>m</span><span><b>{pad(s)}</b>s</span>
    </p>
  )
}
