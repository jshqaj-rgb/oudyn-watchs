import Link from "next/link";
import { FooterClock } from "@/components/FooterClock";
import styles from "./Footer.module.css";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "New in", href: "/watches?sort=newest" },
      { label: "All watches", href: "/watches" },
      { label: "Collections", href: "/collections" },
      { label: "Archive", href: "/archive" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Authentication", href: "/authentication" },
      { label: "Sell or trade", href: "/sell" },
      { label: "Shipping & returns", href: "/shipping" },
      { label: "FAQ", href: "/faq" },
      { label: "Reviews", href: "/reviews" },
      { label: "How to buy", href: "/how-to" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About OUDYN", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "studio@oudyn.com", href: "mailto:studio@oudyn.com" },
      { label: "Book a viewing", href: "/contact#visit" },
      { label: "Shipping worldwide", href: "/shipping" },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          {COLUMNS.map((column) => (
            <div key={column.title} className={styles.column}>
              <h2 className={styles.columnTitle}>{column.title}</h2>
              <ul className={styles.columnList}>
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("mailto:") ? (
                      <a href={link.href} className={styles.link}>
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className={styles.link}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.utility}>
          <FooterClock className={styles.clock} />
          <p className={styles.address}>
            OUDYN WATCHS
            <br />
            Hong Kong &amp; Guangzhou · By appointment
          </p>
          <div className={styles.legalLinks}>
            <Link href="/shipping">Shipping</Link>
            <Link href="/shipping">Returns</Link>
            <Link href="/authentication">Authentication</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <div className={styles.shipping}>
            <span>Shipping arranged from Hong Kong</span>
            <span className={styles.copyright}>© 2026 OUDYN WATCHS</span>
            <span className={styles.copyright}>Independent reseller · Not affiliated with Rolex SA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
