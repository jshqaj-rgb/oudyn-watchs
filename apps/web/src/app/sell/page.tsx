import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sell or trade your watch",
  description:
    "Sell or trade a pre-owned watch with OUDYN WATCHS. Send the details; any offer and payment terms are confirmed in writing after inspection.",
};

const STEPS = [
  {
    number: "01",
    title: "Send the basics",
    text: "Reference, year, box and papers, service history and a few photographs. We reply when we have enough information to assess the watch; we do not promise an instant price.",
  },
  {
    number: "02",
    title: "Inspection before the sale",
    text: "Bring the watch by appointment or send it as agreed in writing. We check what we can and confirm any final offer, payment method and timing in writing.",
  },
  {
    number: "03",
    title: "Paid or traded",
    text: "If you accept, payment is made on the terms stated in the written offer. A trade against another watch is possible only if that watch is available.",
  },
];

export default function SellPage() {
  return (
    <main id="main" className={styles.page}>
      <section className={styles.hero} aria-labelledby="sell-title">
        <Image
          src="/images/rolex/rolex-wrist.jpg"
          alt="A pre-owned luxury watch on the wrist"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.shade} aria-hidden="true" />
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span aria-current="page">Sell or trade</span>
          </nav>
          <h1 id="sell-title" className={styles.title}>
            Your watch already has a past. Let us find its next owner.
          </h1>
          <p className={styles.lead}>
            We buy modern and vintage luxury watches outright, or take them in trade against
            something in the collection. Written offers, no auction surprises.
          </p>
        </div>
      </section>

      <section className={styles.steps} aria-label="How selling works">
        <div className={styles.stepsInner}>
          {STEPS.map((step) => (
            <article key={step.number} className={styles.step}>
              <span className={styles.stepNumber}>{step.number}</span>
              <h2>{step.title}</h2>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.formSection} aria-labelledby="sell-form-title">
        <div className={styles.formInner}>
          <aside className={styles.aside}>
            <p className={styles.kicker}>What we buy</p>
            <h2 id="sell-form-title">Modern and vintage, complete or watch-only.</h2>
            <ul className={styles.list}>
              <li>Steel and gold sports watches</li>
              <li>Dress watches from the 1950s onward</li>
              <li>Full-set references with service history</li>
              <li>Single-owner watches with provenance</li>
              <li>Collections of three pieces or more</li>
            </ul>
            <p className={styles.note}>
              We do not buy watches with unclear ownership, missing serial numbers or aftermarket
              dials presented as original. If we cannot verify it, we say so.
            </p>
            <Link href="/authentication" className={styles.link}>
              Read our inspection standard →
            </Link>
          </aside>
          <ContactForm
            defaultSubject="Sell or trade a watch"
            subjectOptions={["Sell a watch", "Trade a watch", "Collection valuation", "Other"]}
          />
        </div>
      </section>
    </main>
  );
}
