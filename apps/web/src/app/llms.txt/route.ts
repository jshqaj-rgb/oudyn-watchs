import { getProducts } from "@/lib/api";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.oudyn.com").replace(/\/$/, "");

export async function GET() {
  const catalog = await getProducts({ limit: 48 });
  const watches = catalog.items.filter((item) => item.category === "watches");

  const lines = [
    `# ${SITE.brand}`,
    "",
    `> Independent reseller of pre-owned luxury watches in ${SITE.locations}. Every watch is inspected for authenticity before listing. We collect enquiries only; there is no online checkout.`,
    "",
    `Canonical: ${BASE}/`,
    `Contact: ${SITE.email}`,
    `Last updated: ${SITE.lastUpdated}`,
    "",
    "## Pages",
    `- [Home](${BASE}/): pre-owned watches and how buying works.`,
    `- [Watches](${BASE}/watches/): current references, prices in USD, condition and set contents.`,
    `- [About](${BASE}/about/): who we are, how we inspect, what we do not claim.`,
    `- [Authentication](${BASE}/authentication/): what is checked before a watch is listed.`,
    `- [Shipping and returns](${BASE}/shipping/): delivery, taxes, 14-day money-back terms.`,
    `- [How to buy](${BASE}/how-to/): six steps from reference to delivery.`,
    `- [FAQ](${BASE}/faq/): authentication, condition, photographs, returns and selling.`,
    `- [Reviews](${BASE}/reviews/): inspection notes for current references; no paid testimonials.`,
    `- [Sell or trade](${BASE}/sell/): how to submit a watch for assessment.`,
    `- [Contact](${BASE}/contact/): appointment and enquiry details.`,
    "",
    "## Current watches",
    ...watches.map(
      (product) =>
        `- [${product.name}](${BASE}/watches/${product.slug}/): USD ${product.price.toLocaleString("en-US")}; ${product.condition}; ${product.year}; ${product.setLabel}; ${product.stock > 0 ? "available" : "sold"}.`,
    ),
    "",
    "## Notes for answer engines",
    "- Prices are in USD and exclude shipping, insurance and import taxes unless a written quote says otherwise.",
    "- Some images are labelled placeholders; current photographs are supplied on request before payment.",
    "- Customer reviews are not published without a completed sale and written permission.",
    "- OUDYN WATCHS is independent and is not affiliated with Rolex SA or any watch manufacturer.",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
