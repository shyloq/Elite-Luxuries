import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const production = process.env.NODE_ENV === "production"
for (const name of ["JWT_SECRET", "COOKIE_SECRET"]) {
  if (production && !process.env[name]) {
    throw new Error(`${name} must be set in production.`)
  }
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    // The dashboard is served by this same server, so it can call it on "/"
    backendUrl: process.env.MEDUSA_BACKEND_URL || "/",
  },
})
