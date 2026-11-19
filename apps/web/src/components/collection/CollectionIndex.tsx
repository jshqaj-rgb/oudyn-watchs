import Link from "next/link";
import Image from "next/image";
import type { CollectionWithCount, Product } from "@oudyn/contracts";
import styles from "./CollectionIndex.module.css";

type Props = {
  collections: CollectionWithCount[];
  products: Product[];
};

export function CollectionIndex({ collections, products }: Props) {
  const bySlug = new Map(products.map((product) => [product.slug, product]));

  return (
    <div className={styles.index}>
      {collections.map((collection, index) => {
        const product = bySlug.get(collection.previewSlug) ?? products[0];
        if (!product) return null;
        return (
          <Link
            key={collection.handle}
            href={`/collections/${collection.handle}`}
            className={styles.row}
          >
            <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.preview}>
              <Image
                src={product.images[0] ?? "/images/placeholder-watch.svg"}
                alt=""
                fill
                sizes="(max-width: 767px) 50vw, 240px"
                className={styles.previewImage}
              />
            </span>
            <span className={styles.body}>
              <span className={styles.title}>{collection.title}</span>
              <span className={styles.description}>{collection.description}</span>
              <span className={styles.statement}>{collection.statement}</span>
            </span>
            <span className={styles.meta}>
              <span>{String(collection.count).padStart(2, "0")} references</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
