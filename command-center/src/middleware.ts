import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE, verifySession } from "@/lib/session"

// Everything under /command is the owner's, except the login page itself.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === "/command/login") return NextResponse.next()
  if (await verifySession(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next()
  const login = new URL("/command/login", request.url)
  return NextResponse.redirect(login)
}

export const config = { matcher: ["/command", "/command/:path*"] }
