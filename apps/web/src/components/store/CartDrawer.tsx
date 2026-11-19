"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useStore } from "@/components/store/StoreProvider";
import { formatPrice } from "@/lib/api";
import { CloseIcon, MinusIcon, PlusIcon } from "@/components/visual/Icons";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const { cart, cartOpen, closeCart, cartCount, subtotal, setQuantity, removeLine } = useStore();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!cartOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.dataset.locked = "true";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      delete document.body.dataset.locked;
      previous?.focus?.();
    };
  }, [cartOpen, closeCart]);

  if (!cartOpen) return null;

  return (
    <div className={styles.root}>
      <div className={styles.scrim} onClick={closeCart} aria-hidden="true" />
      <aside className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header className={styles.head}>
          <h2 id="cart-title" className={styles.title}>
            Cart <span className={styles.count}>({String(cartCount).padStart(2, "0")})</span>
          </h2>
          <button ref={closeRef} type="button" className={styles.close} onClick={closeCart} aria-label="Close cart">
            <CloseIcon size={18} />
          </button>
        </header>

        {cart.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Your cart is empty.</p>
            <p className={styles.emptyText}>Pieces are made in limited numbers. When they are gone, they join the archive.</p>
            <Link href="/watches" className={styles.emptyLink} onClick={closeCart}>
              Browse the collection
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.lines}>
              {cart.map((line) => (
                <article key={line.key} className={styles.line}>
                  <div className={styles.thumb}>
                    <Image
                      src={line.image ?? "/images/placeholder-watch.svg"}
                      alt=""
                      fill
                      sizes="76px"
                      className={styles.thumbImage}
                    />
                  </div>
                  <div className={styles.lineInfo}>
                    <div className={styles.lineTop}>
                      <div>
                        <Link href={`/watches/${line.slug}`} className={styles.lineName} onClick={closeCart}>
                          {line.name}
                        </Link>
                        <p className={styles.lineMeta}>{line.specLabel}</p>
                        {line.addOnLabel && (
                          <p className={styles.lineAddon}>+ {line.addOnLabel}</p>
                        )}
                      </div>
                      <p className={styles.linePrice}>{formatPrice(line.price * line.quantity)}</p>
                    </div>
                    <div className={styles.lineBottom}>
                      <div className={styles.qty} aria-label={`Quantity for ${line.name}`}>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.key, line.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon size={12} />
                        </button>
                        <span aria-live="polite">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.key, line.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <PlusIcon size={12} />
                        </button>
                      </div>
                      <button type="button" className={styles.remove} onClick={() => removeLine(line.key)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.foot}>
              <div className={styles.row}>
                <span className="mono">Subtotal</span>
                <span className={styles.total}>{formatPrice(subtotal)}</span>
              </div>
              <p className={styles.note}>Shipping and duties calculated at checkout. Free shipping within the EU.</p>
              <Link href="/checkout" className={styles.checkout} onClick={closeCart}>
                Checkout
              </Link>
              <button type="button" className={styles.continue} onClick={closeCart}>
                Continue browsing
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
