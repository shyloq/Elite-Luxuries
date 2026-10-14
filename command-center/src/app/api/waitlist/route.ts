import { NextResponse } from "next/server"
import { corsHeaders } from "@/lib/cors"
import { addToWaitlist } from "@/lib/waitlist"

/**
 * POST /api/waitlist { email, source }: join the waitlist. Public, used by the store.
 * The answer is the same whether or not the address was already on the list.
 */
export async function POST(request: Request) {
  const headers = corsHeaders(request.headers.get("origin"))
  const body = await request.json().catch(() => null)
  const result = await addToWaitlist(body?.email, body?.source, body?.company)
  return NextResponse.json(result.ok ? { ok: true } : { message: result.message }, { status: result.ok ? 200 : 400, headers })
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) })
}

