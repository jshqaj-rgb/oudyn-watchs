# OUDYN WATCHS

Independent reseller of pre-owned watches, operating from Hong Kong and Guangzhou. This is a catalogue and enquiry site: no online payment, no accounts and no guaranteed stock.

The storefront is a Next.js static export deployed on Cloudflare Pages. Products come from the EmDash content API for merchant `mch_oudyn`; there is no local product catalogue. All runtime APIs are Cloudflare Pages Functions in `functions/api/` and call EmDash directly. No separate backend server is required.

## Stack

- Next.js 15.5 App Router, React 19, TypeScript
- Static export (`apps/web/out`) + Cloudflare Pages Functions
- `packages/catalog` — shared EmDash fetch, mapping, filtering and facets
- `packages/contracts` — shared TypeScript contracts
- Inter + JetBrains Mono, self-hosted

## Architecture

```text
Build:    Next static export → packages/catalog → shop-edge 网关 → EmDash
Runtime:  browser → /api/catalog/* → Pages Function → shop-edge 网关 → EmDash
Writes:   contact enquiries → Pages Function → OUDYN_KV
```

The build needs `SHOP_EDGE_SITE_KEY`（推荐）或 `EMDASH_READ_TOKEN`，因为 every product, collection, story and sitemap entry is prerendered. 配了 `SHOP_EDGE_SITE_KEY` 时走 `shop-edge` 网关，浏览器永远看不到 key；未配时回退直连 EmDash。

## Local development

```bash
npm install
cp .env.example apps/web/.env.local   # add EMDASH_READ_TOKEN
npm run dev
```

- Web: http://localhost:3000
- Optional local catalogue API: http://127.0.0.1:4000

`npm run dev` starts a small Express emulator used only for the dev-only client filter/search rewrite. Production reads the same catalogue through Pages Functions; the emulator is not deployed.

## Build and preview

```bash
npm run build      # STATIC_EXPORT=1 next build → apps/web/out
npm run preview    # plain static preview on :3000 (no Functions)
```

For a full local test including the Functions:

```bash
HOME=/tmp/wranglerhome npx wrangler pages dev apps/web/out --port 8789 \
  --binding EMDASH_READ_TOKEN=... \
  --binding EMDASH_MERCHANT_ID=mch_oudyn
```

## Cloudflare Pages

| Setting | Value |
| --- | --- |
| Framework preset | None / Next.js (static) |
| Build command | `npm run build` |
| Build output directory | `apps/web/out` |
| Root directory | repository root |
| Node version | 22 |

Set these in **Pages → Settings → Environment variables → Production** (and Preview if needed):

| Variable | Build | Runtime | Purpose |
| --- | --- | --- | --- |
| `SHOP_EDGE_SITE_KEY` | yes | yes | 网关站点 key（`sk_live_...`），推荐 |
| `SHOP_EDGE_SITE_ORIGIN` | optional | optional | 服务端调用时透传的 Origin，默认 `https://oudyn.com` |
| `EMDASH_READ_TOKEN` | fallback | fallback | 未配网关 key 时直连 EmDash |
| `EMDASH_MERCHANT_ID` | yes | yes | Defaults to `mch_oudyn` |
| `EMDASH_API_URL` | optional | optional | Products endpoint override |
| `EMDASH_ASSET_BASE` | optional | optional | Prefix for relative image URLs |
| `EMDASH_USE_SOURCE_IMAGES` | optional | optional | `1` keeps EmDash/Pexels covers |
| `NEXT_PUBLIC_SITE_URL` | optional | — | Canonical URL, default `https://www.oudyn.com` |

Bind a KV namespace named **`OUDYN_KV`** in **Settings → Functions → KV namespace bindings** to enable the contact form. Product reads work without KV; enquiries return `503` until it is bound. Online checkout is disabled by design and returns `410`.

Deploy through the GitHub integration, or manually:

```bash
npm run deploy
```

`wrangler.toml` declares `name = "oudyn-watchs"` and `pages_build_output_dir = "apps/web/out"`.

## Routes

| Route | Description |
| --- | --- |
| `/` | Photo hero, latest acquisitions, shop by family, model detail, OUDYN standard |
| `/watches` | Dealer listing with filter, sort and Show more |
| `/watches/[slug]` | 73/27 photo gallery + buy rail, condition, set, live specs, FAQ, related |
| `/collections`, `/collections/[handle]` | Collection index and listing |
| `/archive` | Sold and archived references |
| `/about` | Dealer position, disclosure standard, independence statement |
| `/sell` | Sell/trade enquiry |
| `/contact` | Appointment-only contact details and enquiry form |
| `/authentication`, `/shipping`, `/faq` | Authentication standard, delivery/returns, common questions |
| `/privacy`, `/terms` | Legal pages |
| `/wishlist`, `/account`, `/checkout` | Saved references; accounts unavailable; checkout disabled and replaced by an enquiry |

## API

All production endpoints are Pages Functions:

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/catalog/health` | Catalogue counts and source |
| GET | `/api/catalog/products` | `collection`, `category`, `tag`, `search`, `sort`, `limit`, `cursor` |
| GET | `/api/catalog/products/:slug` | One reference |
| GET | `/api/catalog/collections` | Collections with counts |
| GET | `/api/catalog/collections/:handle` | Collection and products |
| GET | `/api/catalog/archive` | Sold references |
| POST | `/api/catalog/orders` | Disabled: returns `410`, no order is created |
| POST | `/api/catalog/contact` | Stores an enquiry |
| GET | `/api/zven-products` | Minimal EmDash-shaped array: `id`, `name`, `price`, `stock`, `image` |

## Data mapping

The adapter reads `id`, `name`, `price`, `stock`, `cover_image`/`images`, then optional rich fields. Real EmDash records currently provide a Chinese `specs` object (brand, model, reference, year, case, material, movement, dial, bracelet, condition, accessories, warranty); it is split into REFERENCE / CASE / MOVEMENT / DIAL / BRACELET / CONDITION & SET groups. Missing fields are hidden, never invented. Prices are CNY and formatted `CNY 52,000`.

Because the current EmDash covers are unrelated stock, product images are labelled placeholders. Set `EMDASH_USE_SOURCE_IMAGES=1` only once the backend serves real watch photography. `/api/zven-products` always returns the original `cover_image`.

## Content and imagery

All photography in `apps/web/public/images/rolex/` is placeholder stock. The watches shown are not the watches described, and product surfaces label these images as placeholders. Replace them with the seller's own photographs before launch.

Buyer stories have been removed. No customer reviews are published until consented, verifiable material is available.

## Design

Six colours: black, studio white `#f6f6f6`, steel grey `#d9d9d9`, white, graphite `#505050`, lume green `#afff00` for the cart dot only. Helvetica Neue for reading, JetBrains Mono for references and data. Flat rules, 4px panels, photography-led pages.

## Boundaries

- No customer accounts, online payment, inventory reservation or order creation.
- Contact writes require the `OUDYN_KV` binding.
- Live weather uses Open-Meteo and fails quietly to `WEATHER —`.
- Checkout is disabled; the site directs buyers to a written availability enquiry.
