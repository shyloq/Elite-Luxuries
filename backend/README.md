# VULT LABEL store backend

A [Medusa](https://medusajs.com) 2.21.2 server that runs the shop behind the
site: products, sizes, stock, the bag, shipping and orders. It also gives you
an admin dashboard for managing products and orders.

The site works without it. When no backend is connected, the shop shows its
built-in product list and the bag says the store is offline.

## What the seed script sets up

- The store "VULT LABEL" with US dollars, and a "VULT Web Store" sales channel.
- A United States region with the built-in manual payment provider (no card is
  charged).
- A "VULT Warehouse" stock location in Los Angeles.
- Standard Shipping at $8, free when the bag reaches $150.
- The eight Drop 03 products, with sizes, prices and stock per size. The
  Combination Hoodie starts sold out.
- A publishable API key for the site. The site fetches it from
  `/storefront-config`, so there is nothing to copy by hand.

## Run it locally

You need Node.js 20 or newer and PostgreSQL.

```bash
cd backend
npm install
cp .env.template .env           # then edit DATABASE_URL and the secrets
createdb vult_store             # or create the database another way
npx medusa db:migrate
npm run seed                    # loads the products
npm run dev                     # API and admin on http://localhost:9000
```

Create an admin login for the dashboard at http://localhost:9000/app:

```bash
npx medusa user -e you@example.com -p choose-a-password
```

Serve the site from the repo root on a port listed in `STORE_CORS`:

```bash
cd ..
python3 -m http.server 8000     # then open http://localhost:8000
```

Opening `index.html` straight from disk does not work with the backend,
because the browser blocks those requests.

## Changing products

Edit products, prices and stock in the admin dashboard. The site reads them
live, so there is nothing to change in the site's code. The drawn placeholder
for each product comes from its metadata: `shape` (`tee`, `hoodie`, `cargo`,
`jacket`, `cap` or `tote`), `color` (a hex color) and `position` (sort order
in the shop).

To reload the seed data from scratch, drop and recreate the database, then run
`npx medusa db:migrate` and `npm run seed` again. The seed script does nothing
if the products already exist.

## Host it on Railway

The repo is set up for [Railway](https://railway.com): `railway.json` holds
the build and start commands, and every start runs the database migrations,
loads Drop 03 if the database is empty (it never touches existing products),
and creates the admin login from `ADMIN_EMAIL` / `ADMIN_PASSWORD` if it does
not exist yet.

1. In Railway, create a project with **Deploy from GitHub repo** and pick this
   repository.
2. Open the new service's **Settings**:
   - **Root Directory**: `/backend`
   - **Config-as-code / Railway config file**: `/backend/railway.json`
3. Add a database to the project: **New > Database > PostgreSQL**.
4. In the service's **Variables**, open the **Raw Editor** and paste this,
   filling in your own values:

   ```
   NODE_ENV=production
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=<a long random string>
   COOKIE_SECRET=<a different long random string>
   STORE_CORS=https://shyloq.github.io
   ADMIN_CORS=https://${{RAILWAY_PUBLIC_DOMAIN}}
   AUTH_CORS=https://${{RAILWAY_PUBLIC_DOMAIN}}
   ADMIN_EMAIL=<your email>
   ADMIN_PASSWORD=<a strong password>
   ```

5. Under **Settings > Networking**, choose **Generate Domain**. Your store's
   address looks like `https://something.up.railway.app`, and the admin
   dashboard is at that address plus `/app`.
6. Put that address in `HOSTED_BACKEND` in the site's `store-config.js` and
   push. `STORE_CORS` must list the address the site is served from (no
   trailing slash; separate several with commas).

## Host the site on GitHub Pages

In the repository's **Settings > Pages**, choose **Deploy from a branch**,
branch `main`, folder `/ (root)`. The site appears at
`https://shyloq.github.io/Elite-Luxuries/`. If you use your own domain later,
add it to `STORE_CORS` on Railway.

## Before taking real orders

- **Card payments.** Orders currently use Medusa's manual payment provider,
  so nothing is charged. Add the Stripe payment provider and use it in
  `store.js` in place of `pp_system_default`.
- **Order emails.** Medusa sends no emails until a notification provider (for
  example SendGrid or Resend) is configured.
