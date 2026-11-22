# OUDYN WATCHS

Independent reseller of pre-owned luxury watches in Hong Kong and Guangzhou.

This repository is a catalogue and enquiry site. It does **not** take online payment, create orders, reserve stock or offer customer accounts. Product prices, stock, condition and set contents come from the EmDash product API; the site describes what the backend supplies and does not invent missing specifications.

- Production: `https://www.oudyn.com`
- Repository: `https://github.com/jshqaj-rgb/oudyn-watchs`
- Last updated: **23 November 2026**

## 1. Stack

| Layer | Choice |
| --- | --- |
| Storefront | Next.js 15.5 App Router, React 19, TypeScript (strict) |
| Styling | CSS Modules + global design tokens |
| Catalogue | EmDash content API, merchant `mch_oudyn` |
| Build-time data | `packages/catalog` (`@oudyn/catalog`) |
| Runtime API | Cloudflare Pages Functions in `functions/api/` |
| Deployment | Cloudflare Pages, static export to `apps/web/out` |
| Fonts | Inter and JetBrains Mono, self-hosted in `apps/web/public/fonts` |
| Dev catalogue emulator | Express + tsx in `apps/api` (local only) |

## 2. Architecture

```text
Build:
  Next static export
    → packages/catalog
      → shop-edge gateway (when SHOP_EDGE_SITE_KEY is set)
      → EmDash product API (fallback with EMDASH_READ_TOKEN)

Runtime:
  Browser
    → /api/catalog/*            (Pages Function)
    → /api/zven-products        (Pages Function)
      → shop-edge / EmDash

Writes:
  Contact enquiry
    → Pages Function
    → Cloudflare KV binding OUDYN_KV
```

No separate production backend is required. `apps/api` exists only so `next dev` can serve client-side filter/search requests through its `/api/catalog` rewrite; it is not deployed.

### Source-of-truth rules

- `packages/catalog` is the only product adapter for build-time data and Pages Functions.
- `apps/api` reuses `@oudyn/catalog`; do not add a second EmDash mapper.
- `apps/web/src/lib/api.ts` is the server-side build adapter.
- `apps/web/src/lib/client-api.ts` contains browser helpers only.
- Product records are normalised once, in the catalogue package.

## 3. Local development

Requirements: Node 22, npm 10+.

```bash
npm install
cp .env.example apps/web/.env.local   # add SHOP_EDGE_SITE_KEY or EMDASH_READ_TOKEN
npm run dev
```

- Web: `http://localhost:3000`
- Dev catalogue emulator: `http://127.0.0.1:4000`
- `npm run dev` starts both. `npm run dev:web` starts only Next.js.

Do not run `npm run build` while `next dev` is running. Both processes write `apps/web/.next`; a production build can remove the CSS/JS chunks that the running dev server expects, producing 404s and a page with only the hero image. If that happens:

```bash
lsof -ti:3000 | xargs kill
rm -rf apps/web/.next
npm run dev:web
```

## 4. Build, preview and deploy

```bash
npm run build       # STATIC_EXPORT=1 next build → apps/web/out
npm run preview     # dependency-free static preview on :3000
```

Full local test with Pages Functions:

```bash
HOME=/tmp/wranglerhome npx wrangler pages dev apps/web/out --port 8789 \
  --binding EMDASH_READ_TOKEN=... \
  --binding EMDASH_MERCHANT_ID=mch_oudyn
```

### Cloudflare Pages

| Setting | Value |
| --- | --- |
| Framework preset | None / static |
| Build command | `npm run build` |
| Build output directory | `apps/web/out` |
| Root directory | repository root |
| Node version | 22 |

Configure environment variables in **Pages → Settings → Environment variables → Production**:

| Variable | Build | Runtime | Required | Purpose |
| --- | --- | --- | --- | --- |
| `SHOP_EDGE_SITE_KEY` | yes | yes | recommended | Site key for the shop-edge gateway |
| `SHOP_EDGE_SITE_ORIGIN` | optional | optional | no | Origin header sent to the gateway; default `https://oudyn.com` |
| `EMDASH_READ_TOKEN` | fallback | fallback | only without gateway key | Server-only EmDash bearer token |
| `EMDASH_MERCHANT_ID` | yes | yes | yes | Must be `mch_oudyn` |
| `EMDASH_API_URL` | optional | optional | no | Products endpoint override |
| `EMDASH_ASSET_BASE` | optional | optional | no | Prefix for relative image paths |
| `EMDASH_USE_SOURCE_IMAGES` | optional | optional | no | `1` keeps source covers; placeholder policy is the default |
| `NEXT_PUBLIC_SITE_URL` | optional | — | no | Canonical URL; default `https://www.oudyn.com` |

`EMDASH_READ_TOKEN` and `SHOP_EDGE_SITE_KEY` are server secrets. They must never appear in client bundles, committed files or `NEXT_PUBLIC_*` variables.

Bind a KV namespace named `OUDYN_KV` in **Settings → Functions → KV namespace bindings** to enable contact enquiries. Without it, reads still work and `POST /api/catalog/contact` returns `503`.

## 5. Routes

| Route | Purpose |
| --- | --- |
| `/` | Photo hero, latest acquisitions, browsing families, model detail, dealer standard |
| `/watches` | Listing with filter, sort and Show more |
| `/watches/[slug]` | Gallery, purchase/enquiry rail, assurance cards, advisors, specs, FAQ, related |
| `/collections`, `/collections/[handle]` | Browsing groups |
| `/archive` | Sold or archived references |
| `/about` | Dealer position, inspection standard, independence statement |
| `/sell` | Sell/trade enquiry |
| `/contact` | Appointment-only contact and enquiry form |
| `/authentication`, `/shipping`, `/faq` | Standards, delivery/returns, common questions |
| `/reviews` | Inspection notes for current references; no paid testimonials |
| `/how-to` | Six-step buying guide |
| `/privacy`, `/terms` | Legal pages |
| `/wishlist`, `/account`, `/checkout` | Saved references; accounts unavailable; checkout disabled and replaced by an enquiry |
| `/llms.txt` | Machine-readable site and catalogue summary |
| `/robots.txt`, `/sitemap.xml` | Crawler directives and URL inventory |

## 6. API

All production endpoints are Pages Functions:

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/catalog/health` | Catalogue counts and source |
| GET | `/api/catalog/products` | `collection`, `category`, `tag`, `search`, `sort`, `limit`, `cursor` |
| GET | `/api/catalog/products/:slug` | One reference |
| GET | `/api/catalog/collections` | Collections with counts |
| GET | `/api/catalog/collections/:handle` | Collection and matching products |
| GET | `/api/catalog/archive` | Sold references |
| POST | `/api/catalog/contact` | Stores a contact enquiry in `OUDYN_KV` |
| GET | `/api/zven-products` | Minimal array: `id`, `name`, `price`, `stock`, `image` |

Online checkout, order creation and newsletter signup are intentionally absent. Do not add payment endpoints without a payment provider, server-side total calculation, stock locking and email delivery.

## 7. Product data and currency

The adapter reads `id`, `name`, `price`, `stock`, `cover_image`/`images`, then optional rich fields. EmDash currently supplies a Chinese `specs` object (brand, model, reference, year, case, material, movement, dial, bracelet, condition, accessories, warranty); it is split into `REFERENCE`, `CASE`, `MOVEMENT`, `DIAL`, `BRACELET`, `CONDITION & SET`. Missing fields are hidden, never guessed.

### Currency

- **All UI and structured-data currency is USD.**
- `formatPrice()` renders `USD 52,000`.
- JSON-LD uses `"priceCurrency": "USD"`.
- The numeric amount is taken from EmDash unchanged. **No FX conversion is performed.** The current backend values are treated as USD; if EmDash continues to store CNY, normalise or convert upstream before launch.

### Images

The default product images are local placeholder photographs in `apps/web/public/images/rolex/`. They are labelled in the UI as placeholders because they are not photographs of the actual watches. `EMDASH_USE_SOURCE_IMAGES=1` keeps original covers only when those covers are real watch photography.

## 8. Design specification

### Colour tokens

| Token | Value | Use |
| --- | --- | --- |
| `--color-black` | `#000000` | Text, buttons, image wells |
| `--color-studio-white` | `#f6f6f6` | Page background |
| `--color-steel-gray` | `#d9d9d9` | Cards, rules |
| `--color-white` | `#ffffff` | Panels, pills |
| `--color-graphite` | `#505050` | Secondary copy |
| `--color-lume-green` | `#afff00` | Cart dot only |

No other colours. The lume green dot is the only accent; do not use it for buttons, links or large areas.

### Type

- Reading: Helvetica Neue, fallback Inter. 24px maximum for display copy, 16/14/12/10px for body and data.
- Data: JetBrains Mono for references, prices, navigation, labels, timestamps and specifications.
- Uppercase labels use letter-spacing; no oversized editorial display type.

### Layout

- Radius: `4px`; spacing scale: 8px.
- Section padding: 64px desktop / 40px mobile.
- Breakpoints: Mobile ≤767, Tablet 768–1023, Desktop ≥1024.
- Header: fixed, transparent over photography, white pill navigation and actions; dark-hero pages force a white wordmark until scroll.
- Listing: full-bleed hero, case lineup, 4-column grid (2 mobile).
- PDP: 73/27 photo column and sticky purchase rail; rail order: reference, name, price, condition, set, gallery thumbs, included items, ref, add-ons, wishlist, cart, assurance, advisors, section tabs.
- Dark pages: `ContentPage` supports `dark`, a `Last updated` timestamp and a JSON-LD script slot.
- Motion: no scroll-triggered animation, parallax, carousels or decorative motion. Hover scale is limited to product imagery; transitions are 400ms ease.

### Content and imagery

- Page chrome and UI copy are English. Backend product names, descriptions and specification values may remain Chinese; they are displayed as supplied and are the only exception.
- Show condition, year and set contents wherever a price is shown.
- Label placeholder images.
- Do not invent reviews, ratings, addresses, phone numbers, company numbers, warranty periods or statistics.

## 9. SEO and AI-readable structure

- `Organization` + `WebSite` JSON-LD sitewide.
- `Product` + `Offer` on PDPs.
- `FAQPage` on `/faq`.
- `ItemList` + `Review` on `/reviews` (inspection notes, not fabricated customer ratings).
- `HowTo` + `HowToStep` on `/how-to`.
- `Last updated` visible on FAQ, Reviews and How To.
- `sitemap.xml` includes every static page, product, collection and archive entry.
- `robots.txt` allows normal crawlers plus GPTBot, ClaudeBot, PerplexityBot and Google-Extended.
- `llms.txt` summarises the business, pages and current catalogue for answer engines.

## 10. Coding standards

1. TypeScript strict; no `any` without a written reason.
2. Keep server and client boundaries explicit: `"use client"` only where state, effects or browser APIs are required.
3. One data adapter: `@oudyn/catalog`. Do not add a second mapper in a page, function or component.
4. CSS Modules for component styles; global CSS only for tokens, reset and shared primitives.
5. Use `next/image` for content imagery; include meaningful alt text or `alt=""` when the image is decorative.
6. Prices go through `formatPrice`; never hardcode a currency symbol in a component.
7. New user-facing copy is English, factual and consistent with `shipping`, `terms`, `faq` and PDP assurance.
8. No fabricated legal entity, address, phone, warranty, review or rating.
9. Delete dead routes, components, images and build output rather than leaving them for later.
10. Run `npx tsc --noEmit -p apps/web/tsconfig.json` and `npx tsc --noEmit -p apps/api/tsconfig.json` before handoff.
11. Build only with the dev server stopped.
12. Do not commit `.env.local`, tokens, `apps/web/out`, `.next`, `.wrangler` or `.qa`.

## 11. Limits and non-goals

- Static export: product listing filtering and sorting happen in the browser; no server-side search.
- No accounts, login, saved server-side wishlists, payment, order creation or stock reservation.
- Contact storage requires `OUDYN_KV`; without it the form returns `503`.
- Product records are supplied by EmDash. Missing specifications are hidden rather than invented.
- Images are placeholders until real photographs are supplied.
- No published legal entity, company number, street address or telephone number; appointment addresses and company details are shared before a transaction.
- The 14-day money-back guarantee, authenticity guarantee and 40-person quality/security team are business commitments stated on the site; legal review for the target market is still required.
- Import taxes, duties and delivery costs are confirmed in writing before payment; no DDP claim is made without a written quote.
- No EU/UK representative, payment provider, email delivery service or analytics provider is configured.
- Architecture is a Cloudflare Pages site, not a full commerce platform.

## 12. Repository map

```text
apps/web/                 Next.js storefront (static export)
apps/api/                 Local-only Express catalogue emulator
functions/api/            Cloudflare Pages Functions (production API)
packages/catalog/         Shared EmDash adapter, filters, facets, data
packages/contracts/       Shared TypeScript types
scripts/serve-static.mjs  Dependency-free preview server
```

## 13. Checks

```bash
npx tsc --noEmit -p apps/web/tsconfig.json
npx tsc --noEmit -p apps/api/tsconfig.json
npm run build
```

The static build should produce the product, collection and content routes plus `sitemap.xml`, `robots.txt` and `llms.txt`. Do not deploy `apps/web/out` from a fixture or test token.
