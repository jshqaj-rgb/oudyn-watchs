"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@oudyn/contracts";
import { ProductCard } from "@/components/product/ProductCard";
import { useStore } from "@/components/store/StoreProvider";
import { clientProducts } from "@/lib/client-api";
import styles from "./WishlistView.module.css";

export function WishlistView() {
  const { hydrated, wishlist, toggleWishlist } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    clientProducts(new URLSearchParams({ limit: "48" }))
      .then((data) => {
        if (active) setProducts(data.items);
      })
      .catch(() => {
        if (active) setError("Saved references could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const saved = products.filter((product) => wishlist.includes(product.slug));

  if (!hydrated) {
    return <p className={styles.status}>Reading saved references…</p>;
  }

  if (wishlist.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Nothing saved yet.</p>
        <p className={styles.emptyText}>
          The heart on a reference keeps it here. The list is stored in this browser, not on a
          server.
        </p>
        <Link href="/watches" className={styles.action}>
          Browse watches
        </Link>
      </div>
    );
  }

  if (error) return <p className={styles.status}>{error}</p>;

  if (!loading && saved.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>These references have left the catalog.</p>
        <p className={styles.emptyText}>
          Saved watches stay in this browser after they are retired. Clear the list to start again
          with current references.
        </p>
        <button
          type="button"
          className={styles.action}
          onClick={() => wishlist.forEach((slug) => toggleWishlist(slug))}
        >
          Clear saved list
        </button>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <p className={styles.status}>Loading saved references…</p>
      ) : (
        <div className={styles.grid}>
          {saved.map((product) => (
            <div key={product.id} className={styles.item}>
              <ProductCard product={product} />
              <button
                type="button"
                className={styles.remove}
                onClick={() => toggleWishlist(product.slug)}
              >
                Remove from wishlist
              </button>
            </div>
          ))}
        </div>
      )}
      <p className={styles.footnote}>
        {String(saved.length).padStart(2, "0")} saved · prices in EUR · stock is confirmed at
        checkout
      </p>
    </>
  );
}
