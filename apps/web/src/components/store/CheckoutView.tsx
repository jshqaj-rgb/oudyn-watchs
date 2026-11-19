"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { OrderResponse } from "@oudyn/contracts";
import { useStore } from "@/components/store/StoreProvider";
import { clientOrder } from "@/lib/client-api";
import { formatPrice } from "@/lib/api";
import styles from "./CheckoutView.module.css";

const COUNTRIES = [
  "Italy",
  "France",
  "Germany",
  "Spain",
  "Netherlands",
  "Belgium",
  "Austria",
  "Portugal",
  "Ireland",
  "Denmark",
  "Sweden",
  "Poland",
  "Czechia",
  "United Kingdom",
  "Switzerland",
  "United States",
  "Japan",
];

const EMPTY_FORM = {
  email: "",
  name: "",
  address: "",
  city: "",
  postalCode: "",
  country: "Italy",
};

export function CheckoutView() {
  const { hydrated, cart, subtotal, cartCount, clearCart } = useStore();
  const [form, setForm] = useState(EMPTY_FORM);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderResponse | null>(null);

  const update = (field: keyof typeof EMPTY_FORM) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const response = await clientOrder({
        ...form,
        lines: cart.map((line) => ({
          slug: line.slug,
          addOnId: line.addOnId,
          quantity: line.quantity,
        })),
      });
      setOrder(response);
      clearCart();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The order could not be placed.");
    } finally {
      setPending(false);
    }
  };

  if (order) {
    return (
      <div className={styles.confirmation}>
        <p className={styles.confirmLabel}>Order received</p>
        <h2 className={styles.confirmTitle}>{order.orderId}</h2>
        <p className={styles.confirmBody}>
          A record has been sent to {order.email}. We check the reference against stock, then send a
          secure payment link. Nothing has been charged yet.
        </p>
        <dl className={styles.confirmRows}>
          <div>
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>Awaiting stock confirmation</dd>
          </div>
          <div>
            <dt>Dispatch</dt>
            <dd>2–3 working days after payment</dd>
          </div>
        </dl>
        <Link href="/watches" className={styles.continue}>
          Continue with watches
        </Link>
      </div>
    );
  }

  if (!hydrated) {
    return <p className={styles.status}>Reading the bag…</p>;
  }

  if (cart.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>The bag is empty.</p>
        <p className={styles.emptyText}>A reference has to be in the bag before checkout.</p>
        <Link href="/watches" className={styles.continue}>
          Browse watches
        </Link>
      </div>
    );
  }

  return (
    <form className={styles.layout} onSubmit={submit}>
      <div className={styles.form}>
        <section className={styles.block}>
          <p className={styles.blockTitle}>Contact</p>
          <div className={styles.fields}>
            <label className={`${styles.field} ${styles.wide}`}>
              <span>Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={update("email")}
                placeholder="name@example.com"
              />
            </label>
          </div>
        </section>

        <section className={styles.block}>
          <p className={styles.blockTitle}>Delivery address</p>
          <div className={styles.fields}>
            <label className={`${styles.field} ${styles.wide}`}>
              <span>Full name</span>
              <input
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={update("name")}
              />
            </label>
            <label className={`${styles.field} ${styles.wide}`}>
              <span>Address</span>
              <input
                type="text"
                required
                autoComplete="street-address"
                value={form.address}
                onChange={update("address")}
              />
            </label>
            <label className={styles.field}>
              <span>City</span>
              <input
                type="text"
                required
                autoComplete="address-level2"
                value={form.city}
                onChange={update("city")}
              />
            </label>
            <label className={styles.field}>
              <span>Postal code</span>
              <input
                type="text"
                required
                autoComplete="postal-code"
                value={form.postalCode}
                onChange={update("postalCode")}
              />
            </label>
            <label className={`${styles.field} ${styles.wide}`}>
              <span>Country</span>
              <select value={form.country} onChange={update("country")} autoComplete="country-name">
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className={styles.block}>
          <p className={styles.blockTitle}>Payment</p>
          <p className={styles.paymentNote}>
            No card is taken on this page. We confirm stock first, then send a secure payment link to
            the email above. Orders are held for 48 hours.
          </p>
        </section>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? "Sending order…" : `Place order · ${formatPrice(subtotal)}`}
        </button>
        <p className={styles.terms}>
          By placing the order you accept the <Link href="/about#warranty">warranty</Link> and{" "}
          <Link href="/about#shipping">shipping</Link> terms.
        </p>
      </div>

      <aside className={styles.summary}>
        <div className={styles.summaryHead}>
          <p className={styles.blockTitle}>Order summary</p>
          <span>
            {String(cartCount).padStart(2, "0")} {cartCount === 1 ? "piece" : "pieces"}
          </span>
        </div>
        <ul className={styles.lines}>
          {cart.map((line) => (
            <li key={line.key} className={styles.line}>
              <span className={styles.thumb}>
                <Image
                  src={line.image ?? "/images/placeholder-watch.svg"}
                  alt=""
                  fill
                  sizes="52px"
                  className={styles.thumbImage}
                />
              </span>
              <span className={styles.lineBody}>
                <span className={styles.lineName}>{line.name}</span>
                <span className={styles.lineMeta}>
                  {line.ref} · Qty {line.quantity}
                </span>
                {line.addOnLabel && <span className={styles.lineAddon}>+ {line.addOnLabel}</span>}
              </span>
              <span className={styles.linePrice}>{formatPrice(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className={styles.totals}>
          <div>
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div>
            <dt>Shipping</dt>
            <dd>Included</dd>
          </div>
          <div>
            <dt>VAT</dt>
            <dd>Included</dd>
          </div>
          <div className={styles.grand}>
            <dt>Total</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
        </dl>
        <p className={styles.summaryNote}>
          Prices in EUR. Duties outside the EU are confirmed before payment.
        </p>
      </aside>
    </form>
  );
}
