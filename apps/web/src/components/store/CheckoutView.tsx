"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/components/store/StoreProvider";
import { formatPrice } from "@/lib/api";
import styles from "./CheckoutView.module.css";

export function CheckoutView() {
  const { hydrated, cart, subtotal, cartCount } = useStore();

  if (!hydrated) {
    return <p className={styles.status}>Reading the bag…</p>;
  }

  const references = cart.map((line) => line.ref).join(", ");
  const subject = encodeURIComponent(
    references ? `Availability enquiry: ${references}` : "Availability enquiry",
  );

  return (
    <div className={styles.layout}>
      <div className={styles.form}>
        <section className={styles.block}>
          <p className={styles.blockTitle}>Checkout is not open yet</p>
          <p className={styles.paymentNote}>
            This site is a catalogue and enquiry service. No payment is taken online, no order is
            created, and no stock is reserved. Send us the reference you are interested in and we
            will confirm availability, condition, the final CNY total, shipping and any import
            taxes in writing before any payment is arranged.
          </p>
          <div className={styles.fields}>
            <a className={styles.submit} href={`mailto:studio@oudyn.com?subject=${subject}`}>
              Email an availability enquiry
            </a>
          </div>
          <p className={styles.terms}>
            Prefer to send the details directly? Write to{" "}
            <a href="mailto:studio@oudyn.com">studio@oudyn.com</a> or use the{" "}
            <Link href="/contact">contact form</Link>.
          </p>
        </section>
      </div>

      <aside className={styles.summary}>
        <div className={styles.summaryHead}>
          <p className={styles.blockTitle}>Your selection</p>
          <span>
            {String(cartCount).padStart(2, "0")} {cartCount === 1 ? "piece" : "pieces"}
          </span>
        </div>

        {cart.length === 0 ? (
          <p className={styles.emptyText}>No references selected yet.</p>
        ) : (
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
                  <span className={styles.lineMeta}>{line.ref}</span>
                </span>
                <span className={styles.linePrice}>{formatPrice(line.price)}</span>
              </li>
            ))}
          </ul>
        )}

        <dl className={styles.totals}>
          <div>
            <dt>Indicative subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div>
            <dt>Payment</dt>
            <dd>Not taken online</dd>
          </div>
        </dl>
        <p className={styles.summaryNote}>
          Prices are shown in CNY. Shipping, insurance and import taxes are confirmed before
          payment.
        </p>
        <Link href="/watches" className={styles.continue}>
          Continue with watches
        </Link>
      </aside>
    </div>
  );
}
