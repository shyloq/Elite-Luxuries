"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Tells the server the owner's time zone, so "today" on the calendar and board is theirs.
export function TimeZoneCookie() {
  const router = useRouter()
  useEffect(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const current = document.cookie.split("; ").find((c) => c.startsWith("vult_tz="))?.slice(8)
    if (zone && decodeURIComponent(current ?? "") !== zone) {
      document.cookie = `vult_tz=${encodeURIComponent(zone)}; path=/; max-age=31536000; samesite=lax`
      router.refresh()
    }
  }, [router])
  return null
}
