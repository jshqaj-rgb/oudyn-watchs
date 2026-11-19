# OUDYN WATCHS

Pre-owned luxury watches, sourced, authenticated and sold one at a time from Milano.

The storefront is a Next.js App Router site backed by a small Express catalogue API. Products are read live from the EmDash content API and normalised by the API server; stories, orders and contact requests also live behind the API. There is no local product catalogue in the repository.

## Stack

- Next.js 15.5 (static export for production), React 19, TypeScript
- Express 4 API run with `tsx`
- npm workspaces: `apps/web`, `apps/api`, `packages/contracts`
- Self-hosted Inter and JetBrains Mono
- Cloudflare Pages + a Pages Function proxy (`functions/api/catalog/[[path]].ts`)

## Local development

```bash
npm install
npm run dev
```

- Web: http://localhost:3000
- API: http://127.0.0.1:4000
- API health: http://127.0.0.1:4000/api/health

The dev server rewrites `/api/catalog/*` to the local API.

## Production build and preview

```bash
npm run build          # STATIC_EXPORT=1 next build
npm run preview        # serves apps/web/out on :3000
```

`npm run build` prerenders every product, collection and story. `API_URL` must point at a running API during the build, and that API must have `EMDASH_READ_TOKEN` configured. The page count follows the live catalogue.

## Cloudflare Pages deployment

The project uses **static export**, not the Next.js Cloudflare adapter.

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `apps/web/out` |
| Root directory | repository root |
| Node version | 22 |

Required variables:

| Variable | Where | Purpose |
| --- | --- | --- |
| `API_URL` | Build environment | Public HTTPS API used to prerender pages |
| `API_ORIGIN` | Pages runtime environment | Origin the Pages Function proxies `/api/catalog/*` and `/api/zven-products` to |
| `NEXT_PUBLIC_SITE_URL` | Build environment | Optional; defaults to `https://www.oudyn.com` |
| `EMDASH_READ_TOKEN` | API server only | EmDash read token; never expose to the browser |
| `EMDASH_MERCHANT_ID` | API server only | Optional; defaults to `mch_oudyn` |

`API_ORIGIN` must be a public HTTPS origin reachable from Cloudflare's edge. A local `127.0.0.1` value will build but the deployed API calls will fail.

Deploy from the dashboard (Git integration) or with Wrangler:

```bash
npx wrangler pages deploy apps/web/out --project-name oudyn-watchs
```

`wrangler.toml` already declares `name = "oudyn-watchs"` and `pages_build_output_dir = "apps/web/out"`.

### Backend hosting

The Express API needs a host with a persistent disk because orders, newsletter addresses and contact messages are appended to JSON files. Railway, Fly.io or a small VPS are suitable. Set:

```bash
HOST=0.0.0.0
PORT=4000
EMDASH_READ_TOKEN=...
EMDASH_MERCHANT_ID=mch_oudyn
```

Optional overrides are `EMDASH_API_URL` and `EMDASH_ASSET_BASE`. The API maps the EmDash fields `id`, `name`, `price`, `stock` and `cover_image`/`images` into the storefront contract. Optional EmDash fields such as `description`, `condition`, `year`, `set_label`, `reference`, `specs` and `included` are used when present; missing specs are hidden rather than invented.

For real traffic, replace the JSON writes with a database and add authentication before exposing the admin side.

## Routes

| Route | Description |
| --- | --- |
| `/` | Photo hero, latest acquisitions, shop by family, model detail, OUDYN standard |
| `/watches` | Dealer listing with client-side search, filter, sort and Show more |
| `/watches/[slug]` | 73/27 photo gallery and sticky buy rail, condition, set contents, live specs, FAQ, related |
| `/collections`, `/collections/[handle]` | Collection index and listing |
| `/archive` | Sold and archived references |
| `/stories`, `/stories/[slug]` | Buyer stories list and one page per owner |
| `/about` | Dealer position, numbers, studio gallery, 2016–2026 timeline, service notes |
| `/sell` | Sell/trade enquiry with photo-and-paperwork process |
| `/contact` | Studio address, hours, store photography, contact form |
| `/authentication`, `/shipping`, `/faq` | Authentication standard, delivery/returns, common questions |
| `/privacy`, `/terms` | Legal pages |
| `/wishlist`, `/account`, `/checkout` | Browser-local saved references, account information, order request |

## API

Source data:

- EmDash content API — published products for merchant `mch_oudyn` (live fetch, 60s in-memory cache)
- `apps/api/data/stories.json` — 6 buyer stories
- `apps/api/data/collections.json` — 5 editorial collections
- `apps/api/data/orders.json`, `newsletter.json`, `contacts.json` — local submissions, start `[]`

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Service and catalogue counts |
| GET | `/api/products` | `collection`, `category`, `tag`, `search`, `sort`, `limit`, `cursor` |
| GET | `/api/zven-products` | Minimal EmDash-shaped array: `id`, `name`, `price`, `stock`, `image` |
| GET | `/api/products/:slug` | One reference |
| GET | `/api/collections` | Collections with counts |
| GET | `/api/collections/:handle` | Collection and its products |
| GET | `/api/archive` | Archived references |
| GET | `/api/stories` | Buyer stories |
| GET | `/api/stories/:slug` | One buyer story |
| POST | `/api/newsletter` | Store an email |
| POST | `/api/orders` | Validate address, reprice lines server-side, store request |
| POST | `/api/contact` | Validate name/email/message, store enquiry |

Browser traffic goes to `/api/catalog/*`; the Pages Function (and the Next dev rewrite) forwards it to the API. `/api/zven-products` is also proxied for simple integrations. Order totals are recalculated server-side from the live catalogue.

### Resetting local test data

```bash
printf '[]\n' > apps/api/data/orders.json
printf '[]\n' > apps/api/data/newsletter.json
printf '[]\n' > apps/api/data/contacts.json
```

## Content and imagery

All photography in `apps/web/public/images/rolex/` is placeholder stock from Pexels. The watches shown are not the watches described in the catalogue. Replace with the studio's own photographs before launch; the live product gallery uses the EmDash `cover_image`/`images` fields.

Buyer stories are written examples. Names, locations and purchase dates are illustrative; replace them with consented customer material before publishing.

## Design notes

Six colours: black, studio white `#f6f6f6`, steel grey `#d9d9d9`, white, graphite `#505050`, and lume green `#afff00` for the cart dot only. Helvetica Neue for reading, JetBrains Mono for references and data. Flat rules, 4px panels, photography-led pages, no gradients or decorative shadows.

## Boundaries

- No customer authentication, payment provider, inventory reservation or transactional email.
- JSON files are not a production database.
- Live weather uses Open-Meteo and fails quietly to `WEATHER —`.
- The checkout is an order request; payment is arranged by the studio afterwards.
