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
      { label: "Buyer stories", href: "/stories" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Authentication", href: "/authentication" },
      { label: "Sell or trade", href: "/sell" },
      { label: "Shipping & returns", href: "/shipping" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "About OUDYN", href: "/about" },
      { label: "Visit the studio", href: "/contact#visit" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Account", href: "/account" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Instagram", href: "https://www.instagram.com", external: true },
      { label: "YouTube", href: "https://www.youtube.com", external: true },
      { label: "Pinterest", href: "https://www.pinterest.com", external: true },
      { label: "Hodinkee", href: "https://www.hodinkee.com", external: true },
    ],
  },
];

function PaymentMarks() {
  return (
    <div className={styles.payments} aria-label="Accepted payment methods">
      <svg viewBox="0 0 34 20" className={styles.pay} role="img" aria-label="Visa">
        <text x="17" y="15" textAnchor="middle" fontFamily='"Helvetica Neue", Arial, sans-serif' fontSize="12" fontWeight="700" fontStyle="italic" fill="#505050">
          VISA
        </text>
      </svg>
      <svg viewBox="0 0 34 20" className={styles.pay} role="img" aria-label="Mastercard">
        <circle cx="14" cy="10" r="6.4" fill="none" stroke="#505050" strokeWidth="1.2" />
        <circle cx="21" cy="10" r="6.4" fill="none" stroke="#505050" strokeWidth="1.2" />
        <path d="M17.5 4.8a6.4 6.4 0 0 0 0 10.4" fill="none" stroke="#505050" strokeWidth="1.2" />
      </svg>
      <svg viewBox="0 0 34 20" className={styles.pay} role="img" aria-label="American Express">
        <rect x="1" y="3" width="32" height="14" fill="none" stroke="#505050" />
        <text x="17" y="13" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' fontSize="6.5" letterSpacing="0.4" fill="#505050">
          AMEX
        </text>
      </svg>
      <svg viewBox="0 0 42 20" className={styles.pay} role="img" aria-label="PayPal">
        <text x="21" y="14" textAnchor="middle" fontFamily='"Helvetica Neue", Arial, sans-serif' fontSize="10" fontWeight="700" fontStyle="italic" fill="#505050">
          PayPal
        </text>
      </svg>
      <svg viewBox="0 0 46 20" className={styles.pay} role="img" aria-label="Apple Pay">
        <text x="23" y="14" textAnchor="middle" fontFamily='"Helvetica Neue", Arial, sans-serif' fontSize="9" fontWeight="600" fill="#505050">
          Apple Pay
        </text>
      </svg>
    </div>
  );
}

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
                    {"external" in link && link.external ? (
                      <a href={link.href} target="_blank" rel="noreferrer" className={styles.link}>
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
            Via Tortona 27, 20144 Milano
          </p>
          <div className={styles.legalLinks}>
            <Link href="/shipping">Shipping</Link>
            <Link href="/shipping">Returns</Link>
            <Link href="/authentication">Authentication</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <div className={styles.shipping}>
            <span>Shipping to Italy</span>
            <PaymentMarks />
            <span className={styles.copyright}>© 2026 OUDYN WATCHS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
