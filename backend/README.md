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
- A publishable API key for the site, written to `../store-config.js`.

## Run it locally

You need Node.js 20 or newer and PostgreSQL.

```bash
cd backend
npm install
cp .env.template .env           # then edit DATABASE_URL and the secrets
createdb vult_store             # or create the database another way
npx medusa db:migrate
npm run seed                    # loads the products and writes ../store-config.js
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

## Before taking real orders

- **Card payments.** Orders currently use Medusa's manual payment provider,
  so nothing is charged. Add the Stripe payment provider and use it in
  `store.js` in place of `pp_system_default`.
- **Order emails.** Medusa sends no emails until a notification provider (for
  example SendGrid or Resend) is configured.
- **Hosting.** Deploy this backend with a hosted PostgreSQL database, set
  `STORE_CORS` to the site's real address, set strong `JWT_SECRET` and
  `COOKIE_SECRET` values, and put the backend's public URL in the site's
  `store-config.js` (or set `STOREFRONT_BACKEND_URL` before running the seed).
