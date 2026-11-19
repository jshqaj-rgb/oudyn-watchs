import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { ProductFaq } from "@/components/product/ProductFaq";
import { getProduct, getProducts } from "@/lib/api";
import styles from "./page.module.css";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const data = await getProducts({ limit: 48 });
  return data.items.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProduct(slug);
    return {
      title: [product.name, product.subtitle].filter(Boolean).join(" — "),
      description: product.shortDescription || `Pre-owned ${product.name}, authenticated in Milano.`,
    };
  } catch {
    return { title: "Watch" };
  }
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;

  let product: Awaited<ReturnType<typeof getProduct>>;
  try {
    product = await getProduct(slug);
  } catch {
    notFound();
  }

  const pool = await getProducts({ limit: 24, sort: "featured" });
  const related = [
    ...pool.items.filter(
      (item) => item.slug !== product.slug && item.collection === product.collection,
    ),
    ...pool.items.filter(
      (item) => item.slug !== product.slug && item.collection !== product.collection,
    ),
  ]
    .filter(
      (item, index, list) => list.findIndex((entry) => entry.slug === item.slug) === index,
    )
    .slice(0, 4);

  return (
    <main id="main" className={styles.page}>
      <div className={styles.shell}>
        <ProductGallery product={product} />
        <ProductPurchase product={product} />
        <div className={styles.mobileGallery} aria-hidden="true">
          {product.images.slice(1).map((src, index) => (
            <div className={styles.mobileShot} key={`${src}-${index}`}>
              <Image src={src} alt="" fill sizes="100vw" className={styles.bandImage} />
            </div>
          ))}
        </div>
      </div>

      <ProductSpecs product={product} />

      <div className={styles.bands} aria-hidden="true">
        <div className={styles.band}>
          <Image
            src="/images/rolex/rolex-dark.jpg"
            alt=""
            fill
            sizes="100vw"
            className={styles.bandImage}
          />
        </div>
        <div className={styles.band}>
          <Image
            src="/images/rolex/rolex-wrist.jpg"
            alt=""
            fill
            sizes="100vw"
            className={styles.bandImage}
          />
        </div>
      </div>

      {product.category === "watches" && <ProductFaq />}

      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="related-title">
          <div className={styles.relatedInner}>
            <div className={styles.relatedHead}>
              <h2 id="related-title" className={styles.relatedTitle}>
                You may also like
              </h2>
              <span className={styles.relatedCount}>{related.length}/4</span>
              <Link href="/watches" className={styles.relatedLink}>
                View all
              </Link>
              <Link href="/watches" className={styles.relatedNext} aria-label="All watches">
                Next
              </Link>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
