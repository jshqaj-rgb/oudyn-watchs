# DESIGN

## Direction

**An evidence-led dealer catalogue: photography for the object, typography for the proof.**

OUDYN WATCHS is positioned as a pre-owned dealer, not a watchmaker. The reference is the UNIMATIC storefront: full-bleed watch photography, white pill controls floating over the image, mono metadata, and almost no chrome. Product pages are a 73/27 split: a long photographic column and a narrow buy rail that behaves like a printed condition report.

The homepage no longer turns the interface into a watch. The signature is now editorial confidence: one dark Rolex atmosphere photograph, a plain dealer statement at scale, and a white studio card that gives an address, hours and a reason to visit. Photography carries atmosphere; the typography carries evidence.

## Visual system

| Token | Value | Use |
| --- | --- | --- |
| `--color-black` | `#000000` | Text, buttons, dark heroes, quote band |
| `--color-studio-white` | `#f6f6f6` | Page field |
| `--color-steel-gray` | `#d9d9d9` | Product media grounds, borders |
| `--color-white` | `#ffffff` | Pills, rails, panels |
| `--color-graphite` | `#505050` | Secondary copy, metadata |
| `--color-lume-green` | `#afff00` | Cart occupancy dot only |

No other colours are introduced. The green never becomes a link, button or large surface.

## Type

- Helvetica Neue for titles, names and body; Inter is the self-hosted fallback.
- JetBrains Mono for data: navigation, references, spec labels, editions, time, weather, prices in the bag.
- Titles cap at 24px. Mono labels sit at 7.5–12px; the small scale is deliberate.
- Body measure is held to roughly 720px.

## Layout

- 8px spacing base; 64px section padding on desktop, 40px on mobile.
- Breakpoints: mobile ≤767, tablet 768–1023, desktop ≥1024.
- Header is a transparent fixed overlay: plain wordmark left, white pill navigation, white pill actions right. On dark heroes the wordmark is white until the hero ends; on mobile it becomes MENU and CART pills.
- Footer is four metadata columns over a single utility bar (clock, address, service links, shipping/payment marks). No decorative band.
- Homepage: live dial hero → new arrivals photo rail → 2×2 collection grid → model detail → quality promise.

## Page logic

**Home.** Black field, cropped live dial, copy bottom-left, newsletter panel bottom-right. New arrivals is a snap rail of photographic cards with the specification overlaid. Collection tiles are full-bleed photos with black caption bars. Model detail switches a photo, not a drawing.

**Listing.** A 430px dark photographic hero with breadcrumb, brand statement, live time/weather and product count. Filter and sort sit as white pills top-right on desktop and as a full-width row under the hero on mobile. A horizontal case-outline lineup follows, then a four-column grid of photo cards with spec label and collection label over the image. `Show more` loads the next page; a three-column service band closes the listing.

**Product.** 73/27 split. The left column stacks full-bleed photographs; the first fills the viewport and carries gallery dots. The right rail is white, sticky, and carries spec label, collection, name, price with tax note, three thumbnails, included bullets, reference/numbering row, expandable accessory selector, wishlist, black add-to-cart with total, assurance lines, and Specs / Gallery / Focus tabs. Below: a two-column specification section with a case drawing, a table of modules and a stat rail; two editorial photo bands; a tabbed feature block; FAQ; press; four related cards. On mobile the buy panel moves directly under the first photo and the remaining photos follow it.

**About.** Dark photographic hero with the same brand statement and live readout. `Our Timeline` stacks large photographs against year/milestone cards, 2016–2026. A black quote band follows, then compact service definitions and `The OUDYN Code`: newsletter on the left, eight numbered rules on the right.

## Image system

Product and editorial surfaces use five local Pexels Rolex placeholders in `apps/web/public/images/rolex/`, served through `next/image`. They are deliberately treated as placeholders, not as OUDYN product photography: `rolex-white`, `rolex-wrist`, `rolex-box`, `rolex-dark`, `rolex-store`, plus a framed crop for the timeline. `WatchVisual` remains in the repository as an unused technical renderer; no product surface should call it again.

## Motion

- Card image scale to 1.03 over 400ms.
- Collection tiles scale to 1.02 over 400ms.
- Buttons change background only: black → `#333`, white → `#f0f0f0`.
- Images fade in on load; nothing else animates on scroll.
- The dial's second hand ticks once per second with no easing.
- No parallax, no bounce, no carousels, no reveal choreography.
