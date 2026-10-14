import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { SESSION_COOKIE, verifySession } from "@/lib/session"

export const dynamic = "force-dynamic"

// Spreadsheets run cells that start with = + - @ as formulas; prefix them so they stay text
const cell = (v: string) => '"' + (/^[=+\-@]/.test(v) ? "'" + v : v).replace(/"/g, '""') + '"'

export async function GET() {
  if (!(await verifySession((await cookies()).get(SESSION_COOKIE)?.value))) return new Response("Not allowed", { status: 401 })
  const { data, error } = await db().from("waitlist").select("email, source, created_at").order("created_at")
  if (error) return new Response(error.message, { status: 500 })
  const csv = ["email,source,joined", ...data.map((r) => [r.email, r.source, r.created_at].map(cell).join(","))].join("\n")
  return new Response(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="vult-waitlist.csv"', "Cache-Control": "no-store" },
  })
}
