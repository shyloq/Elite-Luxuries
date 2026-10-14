// The owner's login: a cookie holding an expiry time and an HMAC of it. Written with
// Web Crypto so the same code runs in middleware and on the server.
export const SESSION_COOKIE = "vult_owner"
export const SESSION_DAYS = 14

const encoder = new TextEncoder()

async function sign(value: string): Promise<string> {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 16) throw new Error("SESSION_SECRET must be set (16 characters or more).")
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(value))
  // base64url without Buffer, which middleware does not have
  return btoa(String.fromCharCode(...new Uint8Array(mac))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

export async function createSession(): Promise<string> {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  return expires + "." + (await sign("owner." + expires))
}

export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false
  const [expires, mac] = token.split(".")
  if (!expires || !mac || !/^\d+$/.test(expires) || Number(expires) < Date.now()) return false
  const expected = await sign("owner." + expires)
  return timingSafeEqual(mac, expected)
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}
