"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Product, ProductAddOn } from "@oudyn/contracts";
import { formatPrice } from "@/lib/api";
import { useStore } from "@/components/store/StoreProvider";
import { CartIcon, ChevronDownIcon, HeartIcon } from "@/components/visual/Icons";
import { ProductAdvisors } from "./ProductAdvisors";
import styles from "./ProductPurchase.module.css";

const COLLECTION_LABEL: Record<string, string> = {
  classic: "Classic",
  toolwatches: "Toolwatches",
  collaborations: "Collaborations",
  "limited-edition": "Limited edition",
  accessories: "Accessories",
};

export function ProductPurchase({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted, hydrated } = useStore();
  const [addOnId, setAddOnId] = useState("");
  const [addOnOpen, setAddOnOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [sticky, setSticky] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const selected: ProductAddOn | null =
    product.addOns.find((addon) => addon.id === addOnId) ?? null;
  const total = product.price + (selected?.priceDelta ?? 0);
  const optionCount = product.addOns.length + 1;
  const collection = product.collectionLabel ?? COLLECTION_LABEL[product.collection] ?? "Pre-owned";
  const available = product.stock > 0 && !product.soldOut;
  const descriptor = [product.condition, product.year > 0 ? String(product.year) : "", product.setLabel]
    .filter(Boolean)
    .join(" · ");
  const wished = isWishlisted(product.slug);

  useEffect(() => {
    const node = ctaRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const add = () => {
    if (!available) return;
    addToCart(product, selected);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2400);
  };

  return (
    <>
      <aside className={styles.purchase} aria-labelledby="product-title">
        <div className={styles.meta}>
          <span>{product.specLabel || product.condition || "Pre-owned"}</span>
          <span>{collection}</span>
        </div>

        <h1 className={styles.name} id="product-title">
          {product.name}
          {product.subtitle ? <span>{product.subtitle}</span> : null}
        </h1>

        <p className={styles.price}>
          {formatPrice(product.price)}
          <span>Price in USD · taxes and shipping confirmed before payment</span>
        </p>
        <p className={styles.edition}>
          {descriptor || (available ? `${product.stock} in stock` : "Sold out")}
        </p>

        {product.images.length > 0 ? <div className={styles.thumbs}>
          {product.images.slice(0, 3).map((src, index) => (
            <a
              key={`${src}-${index}`}
              href={`#view-${index + 1}`}
              className={styles.thumb}
              aria-label={`View image ${index + 1}`}
            >
              <Image src={src} alt="" fill sizes="72px" className={styles.thumbImage} />
            </a>
          ))}
        </div> : null}

        {product.included.length > 0 ? <ul className={styles.benefits}>
          {product.included.slice(0, 3).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul> : null}

        <div className={styles.refRow}>
          <span>Ref. {product.ref}</span>
          <span>{available ? "Available now" : "Sold out"}</span>
        </div>

        {product.addOns.length > 0 ? <div className={styles.addon}>
          <button
            type="button"
            className={styles.addonHeader}
            aria-expanded={addOnOpen}
            aria-controls={`addons-${product.slug}`}
            onClick={() => setAddOnOpen((open) => !open)}
          >
            <span className={styles.addonTitle}>Add the Accessory</span>
            <span className={styles.addonState}>
              {selected ? selected.label : "No one selected"}
              <span>{selected ? formatPrice(selected.priceDelta) : "USD 0"}</span>
            </span>
            <span className={styles.addonCount}>+{optionCount}</span>
            <ChevronDownIcon size={14} className={styles.chevron} />
          </button>

          {addOnOpen && (
            <div className={styles.addonList} id={`addons-${product.slug}`}>
              <label className={styles.option}>
                <input
                  type="radio"
                  name="addon"
                  value=""
                  checked={addOnId === ""}
                  onChange={() => setAddOnId("")}
                />
                <span>
                  No accessory
                  <em>Included</em>
                </span>
                <span>USD 0</span>
              </label>
              {product.addOns.map((addon) => (
                <label className={styles.option} key={addon.id}>
                  <input
                    type="radio"
                    name="addon"
                    value={addon.id}
                    checked={addOnId === addon.id}
                    onChange={() => setAddOnId(addon.id)}
                  />
                  <span>
                    {addon.label}
                    <em>{addon.note}</em>
                  </span>
                  <span>+ {formatPrice(addon.priceDelta)}</span>
                </label>
              ))}
            </div>
          )}
        </div> : null}

        <button
          type="button"
          className={styles.wish}
          onClick={() => toggleWishlist(product.slug)}
          aria-pressed={hydrated ? wished : undefined}
        >
          <HeartIcon size={12} />
          {wished ? "Saved to wishlist" : "Add to wishlist"}
        </button>

        <button ref={ctaRef} type="button" className={styles.buy} onClick={add} disabled={!available}>
          <span className={styles.buyDot}>
            <CartIcon size={11} />
          </span>
          <span>{available ? "Add to cart" : "Sold out"}</span>
          <span className={styles.buyPrice}>{formatPrice(total)}</span>
        </button>
        {added && <p className={styles.status}>Added. Send the cart as an availability enquiry.</p>}

        <div className={styles.assurance}>
          <p>Every watch is inspected for authenticity before it is listed.</p>
          <p>Payment is arranged with the studio after availability is confirmed.</p>
          <p>14-day money-back guarantee from delivery; see Shipping &amp; Returns.</p>
          <p>Warranty terms, if any, are confirmed in writing before payment.</p>
        </div>

        <ProductAdvisors product={product} />

        <nav className={styles.tabs} aria-label="Product sections">
          <a href="#specs">Specs</a>
          <a href="#gallery">Gallery</a>
        </nav>
      </aside>

      {sticky && (
        <div className={styles.sticky}>
          <div>
            <span>{product.name}</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <button type="button" onClick={add} disabled={!available}>
            {available ? "Add to cart" : "Sold out"}
          </button>
        </div>
      )}
    </>
  );
}
