import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./ContentPage.module.css";

export type ContentSection = {
  title: string;
  body: string[];
  bullets?: string[];
};

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: ContentSection[];
  children?: ReactNode;
};

const POLICY_LINKS = [
  { href: "/authentication", label: "Authentication" },
  { href: "/shipping", label: "Shipping & returns" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function ContentPage({ eyebrow, title, intro, sections, children }: Props) {
  return (
    <main id="main" className={styles.page}>
      <div className={styles.head}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.intro}>{intro}</p>
      </div>

      <div className={styles.body}>
        <aside className={styles.aside}>
          <p className={styles.asideLabel}>Studio policies</p>
          <nav className={styles.asideNav} aria-label="Studio policies">
            {POLICY_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className={styles.asideFoot}>
            <p>Questions about a specific watch?</p>
            <Link href="/contact">Write to the studio →</Link>
          </div>
        </aside>

        <div className={styles.content}>
          {sections.map((section) => (
            <section className={styles.section} key={section.title}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          {children}
        </div>
      </div>
    </main>
  );
}
