import Image from "next/image";
import Link from "next/link";
import type { ArchiveItem, CollectionHandle, Product } from "@oudyn/contracts";
import { formatPrice } from "@/lib/api";
import styles from "./ProductCard.module.css";

type CardProduct = Product | ArchiveItem;

const COLLECTION_LABEL: Record<CollectionHandle, string> = {
  classic: "Classic",
  toolwatches: "Toolwatches",
  collaborations: "Collaborations",
  "limited-edition": "Limited Edition",
  accessories: "Accessories",
};

function isArchive(product: CardProduct): product is ArchiveItem {
  return "archiveLabel" in product;
}

export function ProductCard({
  product,
  priority = false,
  className = "",
}: {
  product: CardProduct;
  priority?: boolean;
  className?: string;
}) {
  const archived = isArchive(product);
  const image = product.images[0] ?? "/images/placeholder-watch.svg";
  const collectionLabel = product.collectionLabel ?? COLLECTION_LABEL[product.collection];

  const inner = (
    <>
      <div className={styles.media}>
        <Image
          src={image}
          alt={`${product.name} — ${product.subtitle}`}
          fill
          priority={priority}
          sizes="(max-width: 767px) 50vw, (max-width: 1023px) 50vw, 25vw"
          className={styles.image}
        />
        {product.specLabel ? <span className={styles.spec}>{product.specLabel}</span> : null}
        {collectionLabel ? <span className={styles.collection}>{collectionLabel}</span> : null}
        {archived && <span className={styles.archive}>{product.archiveLabel}</span>}
      </div>
      <div className={styles.info}>
        <div className={styles.infoTop}>
          <h3 className={styles.name}>{product.name}</h3>
          {!archived && <p className={styles.price}>{formatPrice(product.price)}</p>}
        </div>
        {product.subtitle ? <p className={styles.subtitle}>{product.subtitle}</p> : null}
        <div className={styles.infoFoot}>
          <span className={styles.meta}>
            {archived
            ? `${product.ref} · ${product.archiveYear}`
            : product.editionLabel || (product.stock > 0 ? `${product.stock} in stock` : "Sold out")}
          </span>
        </div>
      </div>
    </>
  );

  if (archived) {
    return <article className={`${styles.card} ${styles.archivedCard} ${className}`}>{inner}</article>;
  }

  return (
    <article className={`${styles.card} ${className}`}>
      <Link
        href={`/watches/${product.slug}`}
        className={styles.link}
        aria-label={`${product.name}, ${formatPrice(product.price)}`}
      >
        {inner}
      </Link>
    </article>
  );
}
