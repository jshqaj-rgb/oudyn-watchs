"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@oudyn/contracts";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/visual/Icons";
import styles from "./NewArrivals.module.css";

export function NewArrivals({ products }: { products: Product[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () => {
      setAtStart(rail.scrollLeft <= 4);
      setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4);
    };
    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.82, behavior: "smooth" });
  };

  return (
    <section className={styles.section} aria-labelledby="new-arrivals-title">
      <div className="container">
        <div className={styles.head}>
          <div>
            <h2 id="new-arrivals-title" className={styles.title}>
              Latest acquisitions
            </h2>
            <p className={styles.note}>Newly sourced pre-owned references. Placeholder images are labelled; ask for current photographs before paying.</p>
          </div>
          <div className={styles.actions}>
            <span className={styles.count}>{String(products.length).padStart(2, "0")} references</span>
            <div className={styles.buttons}>
              <button
                type="button"
                onClick={() => scroll(-1)}
                disabled={atStart}
                aria-label="Previous products"
              >
                <ArrowLeftIcon size={16} />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                disabled={atEnd}
                aria-label="Next products"
              >
                <ArrowRightIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        <div ref={railRef} className={styles.rail}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} className={styles.card} />
          ))}
          <Link href="/watches?sort=newest" className={styles.endCard}>
            <span className={styles.endLabel}>All acquisitions</span>
            <span className={styles.endArrow} aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
