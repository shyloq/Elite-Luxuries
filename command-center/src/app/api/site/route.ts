import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { corsHeaders } from "@/lib/cors"
import { normalizeContent } from "@/lib/content"

export const dynamic = "force-dynamic"

/** GET /api/site: the store's text and layout, and the launch the countdown points at. Public. */
export async function GET(request: Request) {
  const headers = corsHeaders(request.headers.get("origin"))
  const [content, launch] = await Promise.all([
    db().from("site_content").select("content").eq("id", 1).maybeSingle(),
    db().from("launch").select("name, launch_at").eq("id", 1).maybeSingle(),
  ])
  if (content.error || launch.error) {
    return NextResponse.json({ message: "Store content is unavailable." }, { status: 503, headers })
  }
  return NextResponse.json(
    { content: normalizeContent(content.data?.content), launch: launch.data ?? { name: "", launch_at: null } },
    { headers: { ...headers, "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300" } }
  )
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) })
}
