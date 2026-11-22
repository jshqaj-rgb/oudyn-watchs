import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Account",
  description: "Client accounts are not available yet.",
};

export default function AccountPage() {
  return (
    <main id="main" className="pageMain">
      <div className="container">
        <PageHeader
          title="Account"
          intro="Client accounts are not available yet. There is no sign-up, no order history and no saved address book on this site."
          meta={
            <>
              <span>Not available</span>
              <span>No public sign-up</span>
            </>
          }
        />

        <div className={styles.layout}>
          <div className={styles.rows}>
            <div className={styles.row}>
              <span className={styles.number}>01</span>
              <div>
                <h2 className={styles.rowTitle}>Need an invoice or update?</h2>
                <p className={styles.rowBody}>
                  Write to us with the reference number. We answer from the same inbox that handles
                  viewings and after-sales questions.
                </p>
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.number}>02</span>
              <div>
                <h2 className={styles.rowTitle}>Your data</h2>
                <p className={styles.rowBody}>
                  We do not create accounts or store a password. Enquiry emails and their replies are
                  handled under the Privacy Policy.
                </p>
              </div>
            </div>
          </div>

          <aside className={styles.panel}>
            <p className={styles.panelLabel}>Contact</p>
            <p className={styles.panelBody}>
              For a viewing, an availability question or an after-sales request, use the contact
              page or email us directly.
            </p>
            <Link className={styles.primary} href="/contact">
              Contact the studio
            </Link>
            <div className={styles.links}>
              <a href="mailto:studio@oudyn.com">studio@oudyn.com</a>
              <Link href="/shipping">Shipping and returns</Link>
              <Link href="/authentication">Inspection standard</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
