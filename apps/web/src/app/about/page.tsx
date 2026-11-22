import type { Metadata } from "next";
import Link from "next/link";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutCode } from "@/components/about/AboutCode";
import { SITE } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "OUDYN WATCHS is an independent reseller of pre-owned watches, operating from Hong Kong and Guangzhou.",
};

const DISCLOSURES = [
  {
    id: "shipping",
    title: "Inspection & condition",
    body: "We examine the case, dial, movement, bracelet or strap and the accompanying paperwork before a watch is listed. The condition report records what we observed. We do not claim factory authentication or a service history we cannot document.",
  },
  {
    id: "care",
    title: "Set contents",
    body: "Every listing states whether the watch is a full set, box and papers, or watch only. Any replacement part, polished case or missing item we know about is disclosed before sale.",
  },
  {
    id: "warranty",
    title: "Warranty",
    body: "There is no blanket warranty on this website. Any warranty is valid only if it is written into the documents for that specific watch. Statutory rights are unaffected.",
  },
  {
    id: "contact",
    title: "Where we operate",
    body: "OUDYN WATCHS buys and sells from Hong Kong and Guangzhou. Viewings are by appointment; the appointment address and company details are provided before you visit or pay.",
  },
];

export default function AboutPage() {
  return (
    <main id="main">
      <AboutHero />

      <section className={styles.intro} aria-labelledby="about-intro">
        <div className={styles.introInner}>
          <p className={styles.sectionLabel}>Our position</p>
          <div className={styles.introGrid}>
            <h2 id="about-intro">A dealer, not a brand.</h2>
            <div>
              <p>
                OUDYN WATCHS buys and resells pre-owned watches. We are not a manufacturer, an
                authorised dealer, or affiliated with Rolex SA. A second-hand watch is described as
                second-hand, with its condition and set contents stated plainly.
              </p>
              <p>
                The catalogue is deliberately short. We list the reference, year, condition and what
                comes with the watch. If a photograph is a placeholder, it is labelled as one. If a
                fact cannot be verified, we say so instead of filling the gap with a story.
              </p>
              <Link className={styles.introLink} href="/watches">
                See what is available <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.service} aria-label="How we describe a watch">
        <div className={styles.serviceRows}>
          {DISCLOSURES.map((item) => (
            <div key={item.id} id={item.id} className={styles.serviceRow}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.intro} aria-label="Independent reseller statement">
        <div className={styles.introInner}>
          <p className={styles.sectionLabel}>Independence</p>
          <div className={styles.introGrid}>
            <h2>Not affiliated with Rolex SA.</h2>
            <div>
              <p>{SITE.independence}</p>
              <p>{SITE.identityNote}</p>
              <p>
                Questions about a specific reference?{" "}
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AboutCode />
    </main>
  );
}
