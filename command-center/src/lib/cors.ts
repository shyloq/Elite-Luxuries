// The store (a separate site) reads its content and adds to the waitlist from the browser.
export function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = (process.env.STORE_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean)
  const headers: Record<string, string> = { Vary: "Origin" }
  if (origin && allowed.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin
    headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    headers["Access-Control-Allow-Headers"] = "Content-Type"
    headers["Access-Control-Max-Age"] = "600"
  }
  return headers
}
