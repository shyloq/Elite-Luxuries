import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * GET /storefront-config
 *
 * Hands the site the publishable API key it sends with every store request, so
 * a fresh deploy needs no key copied into the site by hand. A publishable key
 * is public by design: it only says which sales channel the site sells from.
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  allowStoreOrigin(req, res)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: keys } = await query.graph({
    entity: "api_key",
    fields: ["token", "title", "revoked_at"],
    filters: { type: "publishable" },
  })
  const live = keys.filter((key) => !key.revoked_at)
  const key = live.find((k) => k.title === "VULT storefront") ?? live[0]
  if (!key) {
    res.status(404).json({ message: "No publishable key yet. Run the seed script." })
    return
  }
  res.json({ publishable_key: key.token })
}

// The route sits outside /store, so Medusa's store CORS does not cover it;
// allow the same origins as STORE_CORS (a plain GET needs no preflight).
function allowStoreOrigin(req: MedusaRequest, res: MedusaResponse) {
  const origin = req.headers.origin
  const allowed = (process.env.STORE_CORS || "").split(",").map((o) => o.trim())
  res.setHeader("Vary", "Origin")
  if (origin && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
  }
}
