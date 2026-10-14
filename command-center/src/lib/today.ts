import "server-only"
import { cookies } from "next/headers"

export const TZ_COOKIE = "vult_tz"

/** Today's date (YYYY-MM-DD) where the owner is, from the time zone their browser reported. */
export async function ownerToday(): Promise<string> {
  const zone = (await cookies()).get(TZ_COOKIE)?.value
  const format = (timeZone: string) =>
    new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date())
  try {
    return format(zone || "UTC")
  } catch {
    return format("UTC")
  }
}
