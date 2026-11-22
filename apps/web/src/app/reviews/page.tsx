import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/static/ContentPage";
import { getProducts, formatPrice } from "@/lib/api";
import { SITE } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Reviews & inspection notes",
  description:
    "OUDYN WATCHS inspection notes for current pre-owned references. These are dealer notes, not paid customer testimonials; customer reviews are published only with permission.",
};

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.oudyn.com").replace(/\/$/, "");

export default async function ReviewsPage() {
  const catalog = await getProducts({ limit: 48 });
  const watches = catalog.items.filter((item) => item.category === "watches");

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "OUDYN WATCHS review and inspection notes",
    dateModified: SITE.lastUpdated,
    itemListElement: watches.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Review",
        name: `OUDYN inspection note — ${product.name}`,
        reviewBody: product.shortDescription || product.description[0] || "Inspected and listed as a pre-owned watch.",
        datePublished: product.releasedAt,
        author: { "@type": "Organization", name: "OUDYN WATCHS" },
        itemReviewed: {
          "@type": "Product",
          name: product.name,
          sku: product.id,
          url: `${BASE}/watches/${product.slug}/`,
          image: product.images[0] ? `${BASE}${product.images[0]}` : undefined,
        },
      },
    })),
  };

  return (
    <ContentPage
      eyebrow="Reviews"
      title="A review should start with what can be seen."
      intro="These are our inspection notes for current references, not paid customer testimonials. A customer review is published only after a completed sale and written permission."
      sections={[]}
      dark
      lastUpdated={SITE.lastUpdated}
      schema={schema}
    >
      <div className={styles.list}>
        {watches.map((product, index) => (
          <article className={styles.card} key={product.id}>
            <div className={styles.cardHead}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{product.condition}</span>
            </div>
            <h2>
              <Link href={`/watches/${product.slug}`}>{product.name}</Link>
            </h2>
            <p className={styles.meta}>
              {product.year} · {product.setLabel} · {formatPrice(product.price)}
            </p>
            <p className={styles.body}>
              {product.shortDescription ||
                product.description[0] ||
                "Inspected and described as a pre-owned watch before listing."}
            </p>
            <Link className={styles.link} href={`/watches/${product.slug}`}>
              Read the listing →
            </Link>
          </article>
        ))}
      </div>

      <div className={styles.note}>
        <h2>Customer reviews</h2>
        <p>
          We do not publish testimonials without a completed transaction and the customer&apos;s
          permission. If you have bought from OUDYN and want to publish a review, write to{" "}
          <a href="mailto:studio@oudyn.com?subject=Review%20submission">studio@oudyn.com</a> with
          the reference number. We will ask before editing or publishing anything.
        </p>
      </div>
    </ContentPage>
  );
}
