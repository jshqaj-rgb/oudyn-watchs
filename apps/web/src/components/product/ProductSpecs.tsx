"use client";

import { useState } from "react";
import type { Product } from "@oudyn/contracts";
import { useStore } from "@/components/store/StoreProvider";
import { HeartIcon } from "@/components/visual/Icons";
import { CaseDrawing } from "./CaseDrawing";
import styles from "./ProductSpecs.module.css";

const COLLECTION_LABEL: Record<string, string> = {
  classic: "Classic",
  toolwatches: "Toolwatches",
  collaborations: "Collaborations",
  "limited-edition": "Limited edition",
  accessories: "Accessories",
};

function findValue(product: Product, group: string, pattern: RegExp) {
  const block = product.specs.find((spec) => spec.title.toUpperCase() === group);
  const item = block?.items.find((value) => pattern.test(value));
  return item ?? "";
}

export function ProductSpecs({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted, hydrated } = useStore();
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const wished = isWishlisted(product.slug);
  const collection = product.collectionLabel ?? COLLECTION_LABEL[product.collection] ?? "Pre-owned";

  const diameter =
    product.specLabel.match(/(\d+(?:\.\d+)?)\s*mm/i)?.[1] ??
    findValue(product, "CASE", /diameter/i).match(/(\d+(?:\.\d+)?)\s*mm/i)?.[1] ??
    "";
  const lugWidth =
    findValue(product, "CASE", /lug width/i).match(/(\d+(?:\.\d+)?)\s*mm/i)?.[1] ?? "";
  const movement = findValue(product, "MOVEMENT", /./).split(" ")[0] || "";
  const water = findValue(product, "DURABILITY & PROTECTION", /water resistance/i).match(
    /[\d.,]+\s*m/i,
  )?.[0] ?? "";
  const power = findValue(product, "MOVEMENT", /power reserve/i).match(/(\d+)\s*h/i)?.[1] ?? "";

  const stats = [
    { value: collection, label: "collection" },
    { value: product.stock > 0 ? String(product.stock) : "0", label: "available" },
    { value: product.condition, label: "condition" },
    { value: product.year > 0 ? String(product.year) : "", label: "year" },
    { value: product.setLabel, label: "set" },
    { value: diameter ? `${diameter}mm` : "", label: "case diameter" },
    { value: movement, label: "movement" },
    { value: water, label: "water resistant" },
    { value: power ? `${power} Hours` : "", label: "power reserve" },
  ].filter((stat) => stat.value);

  return (
    <section className={styles.specs} id="specs" aria-labelledby="spec-title">
      <div className={styles.inner} data-drawing={diameter ? undefined : "hidden"}>
        {diameter ? (
          <div className={styles.drawingPane}>
            <CaseDrawing diameter={`${diameter} mm`} lugWidth={lugWidth ? `${lugWidth} mm` : "—"} />
          </div>
        ) : null}

        <div className={styles.tablePane}>
          <h2 className={styles.srOnly} id="spec-title">
            Specifications
          </h2>

          {(product.shortDescription || product.description.length > 0) && (
            <div className={`${styles.row} ${styles.descriptionRow}`}>
              <span className={styles.label}>Description</span>
              <div className={styles.values}>
                {product.shortDescription ? <p>{product.shortDescription}</p> : null}
                {descriptionOpen &&
                  product.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {product.description.length > 1 ? (
                  <button
                    type="button"
                    className={styles.more}
                    aria-expanded={descriptionOpen}
                    onClick={() => setDescriptionOpen((open) => !open)}
                  >
                    {descriptionOpen ? "Close" : "Discover more"}
                  </button>
                ) : null}
              </div>
            </div>
          )}

          {product.specs.map((group) => (
            <div className={styles.row} key={group.title}>
              <span className={styles.label}>{group.title}</span>
              <div className={styles.values}>
                {group.items.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          ))}

          {!product.shortDescription && product.description.length === 0 && product.specs.length === 0 ? (
            <div className={styles.row}>
              <span className={styles.label}>Listing</span>
              <div className={styles.values}>
                <p>
                  Reference {product.ref}, {product.condition || "pre-owned"}.
                  {product.year > 0 ? ` ${product.year}.` : ""} Full condition report is available
                  on request.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <aside className={styles.stats} aria-label="Key specifications">
          {stats.map((stat) => (
            <div className={styles.stat} key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
          <button
            type="button"
            className={styles.wish}
            onClick={() => toggleWishlist(product.slug)}
            aria-pressed={hydrated ? wished : undefined}
          >
            <HeartIcon size={11} />
            {wished ? "Saved" : "Add to wishlist"}
          </button>
        </aside>
      </div>
    </section>
  );
}
