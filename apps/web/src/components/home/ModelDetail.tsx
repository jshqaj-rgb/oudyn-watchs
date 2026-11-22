"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import type { Product } from "@oudyn/contracts";
import { SpecGroups } from "@/components/product/SpecGroups";
import { SpecAccordion } from "@/components/product/SpecAccordion";
import { formatPrice } from "@/lib/api";
import { isPlaceholderImage } from "@/lib/images";
import styles from "./ModelDetail.module.css";

export function ModelDetail({ products }: { products: Product[] }) {
  const [activeSlug, setActiveSlug] = useState(products[0]?.slug ?? "");
  const product = products.find((item) => item.slug === activeSlug) ?? products[0];

  if (!product) return null;

  return (
    <section className={styles.section} aria-label="Model detail">
      <div className={`container ${styles.layout}`}>
        <div className={styles.rail} role="group" aria-label="Choose a reference">
          <p className={styles.railLabel}>Available now</p>
          <div className={styles.railList}>
            {products.map((item, index) => {
              const selected = item.slug === activeSlug;
              return (
                <button
                  key={item.slug}
                  type="button"
                  className={styles.railItem}
                  data-selected={selected || undefined}
                  onClick={() => setActiveSlug(item.slug)}
                  aria-pressed={selected}
                >
                  <span className={styles.railIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.railName}>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.stage}>
          <Link href={`/watches/${product.slug}`} className={styles.stageLink} aria-label={`View ${product.name}`}>
            <div className={styles.visual}>
              <Image
                key={product.slug}
                src={product.images[0] ?? "/images/placeholder-watch.svg"}
                alt={isPlaceholderImage(product.images[0]) ? "Placeholder photograph of a pre-owned watch" : `${product.name}`}
                fill
                sizes="(max-width: 1023px) 100vw, 48vw"
                className={styles.image}
              />
            </div>
            <div className={styles.stageFoot}>
              <span>{product.ref}</span>
              <span>{isPlaceholderImage(product.images[0]) ? "Placeholder image" : "This exact watch"}</span>
            </div>
          </Link>
        </div>

        <div className={styles.detail}>
          <p className={styles.ref}>Ref. {product.ref} · Pre-owned</p>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          <p className={styles.edition}>{product.editionLabel}</p>

          <Link href={`/watches/${product.slug}`} className={styles.viewLink}>
            Open reference file <span aria-hidden="true">→</span>
          </Link>

          {product.specs.length > 0 ? (
            <>
              <SpecGroups specs={product.specs.slice(0, 5)} compact className={styles.specs} />
              <SpecAccordion specs={product.specs.slice(0, 5)} className={styles.accordion} />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
