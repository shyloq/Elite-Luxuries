# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who buy streetwear the way drops are sold: they follow a label, show up when a drop opens, and buy before sizes run out. (Inferred from the brand's chosen references, Corteiz, Supreme and Yeezy; not yet confirmed with real customers.)

## Product Purpose

VULT LABEL is a new clothing brand. The site is its store: visitors enter through a vault, see what the label is about, and buy the current drop and core pieces. Success is a visitor who gets in, understands the label, and checks out.

## Positioning

The vault is the brand: every visit starts by turning a combination dial to get inside, and pieces are released in limited, numbered drops alongside a small core line.

## Operating Context

- Sales run as limited drops plus a core line. Drop pieces are made in numbered runs and are not restocked; core pieces stay in stock. Which pieces belong to the core line is not decided yet.
- Every visit starts at the vault entry: the visitor turns the dial to 12, 47, 83. The combination is shown on the page on purpose; anyone can get in.
- Products, prices, sizes, stock, the bag and checkout come from the Medusa backend in `backend/`. Without it, the site shows a built-in product list and the bag reports the store is offline.
- Shipping is United States only: $8 standard, free from $150. Checkout currently records orders with a manual (test) payment provider; no card is charged.

## Capabilities and Constraints

- Static HTML, CSS and JavaScript (`index.html`, `style.css`, `script.js`, `store.js`) with self-hosted fonts in `fonts/`; the store backend is Medusa 2.21.2.
- The vault gate, shop grid, product pop-up with sizes and stock, bag drawer and checkout must keep working.
- No product photography exists. Products show drawn garment placeholders whose shape and color come from each product's Medusa metadata.
- Undecided: which pieces are core line; real contact details; social handles; the brand story.

## Brand Commitments

- Name: VULT LABEL.
- The vault entry with its on-screen combination (12, 47, 83).
- Visual references named by the owner: Corteiz, Supreme and Yeezy.
- The first thing after the vault is a brand statement, then the shop.

## Evidence on Hand

- The Drop 03 catalog in `backend/src/scripts/seed.ts`: eight pieces with prices, sizes and per-size stock. These are working placeholders the owner chose to keep, not a confirmed line.
- No logo file, product photos, lookbook, testimonials, press, contact details or social accounts exist. `logo.png` and `favicon.png` belong to the original template's author and are not VULT assets.
- VULT is a new brand: there is no founding year, customer count or history to cite. Do not invent any.

## Product Principles

1. Getting in should feel earned and stay easy: the vault is a ritual, not a barrier.
2. The label speaks in few words; product facts (run size, fabric weight, units left) carry the weight.
3. Scarcity is shown truthfully from real stock, never faked.
4. Never claim history, scale or reputation the label does not have.
