import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Account",
  description: "OUDYN client accounts: order history, service requests and saved addresses.",
};

const ROWS = [
  {
    number: "01",
    title: "Order history",
    body: "Every reference is registered to the account that bought it. Invoices and the timing record for the movement stay available for the life of the watch.",
  },
  {
    number: "02",
    title: "Service requests",
    body: "Open a service request against a reference number, add photographs of the case, and follow the watch through the Milano workshop.",
  },
  {
    number: "03",
    title: "Address book",
    body: "Saved delivery addresses and the straps or add-ons bought with each watch, so a replacement can be matched without guesswork.",
  },
];

export default function AccountPage() {
  return (
    <main id="main" className="pageMain">
      <div className="container">
        <PageHeader
          title="Account"
          intro="An OUDYN account is issued with the first order. There is no public sign-up: the account is attached to the reference number, not to a mailing list."
          meta={
            <>
              <span>Issued with first order</span>
              <span>Milano client service</span>
            </>
          }
        />

        <div className={styles.layout}>
          <div className={styles.rows}>
            {ROWS.map((row) => (
              <div key={row.number} className={styles.row}>
                <span className={styles.number}>{row.number}</span>
                <div>
                  <h2 className={styles.rowTitle}>{row.title}</h2>
                  <p className={styles.rowBody}>{row.body}</p>
                </div>
              </div>
            ))}
          </div>

          <aside className={styles.panel}>
            <p className={styles.panelLabel}>Already a client</p>
            <p className={styles.panelBody}>
              Sign-in links are sent by email. If yours has expired, request a new one and include
              the reference number engraved on the caseback.
            </p>
            <a className={styles.primary} href="mailto:studio@oudyn.com?subject=Account%20access">
              Request a sign-in link
            </a>
            <div className={styles.links}>
              <a href="mailto:studio@oudyn.com?subject=Order%20tracking">Track an order</a>
              <Link href="/about#care">Service and care</Link>
              <Link href="/about#shipping">Shipping and returns</Link>
              <Link href="/about#warranty">Warranty</Link>
            </div>
            <p className={styles.panelNote}>
              Client service answers Monday–Friday, 09:00–17:00 CET. Replies usually arrive within
              one working day.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
