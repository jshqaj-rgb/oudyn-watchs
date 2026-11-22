import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { SITE } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact OUDYN WATCHS about a pre-owned watch, a viewing or a trade enquiry.",
};

export default function ContactPage() {
  return (
    <main id="main" className={styles.page}>
      <section className={styles.hero} aria-labelledby="contact-title">
        <Image
          src="/images/rolex/rolex-dark.jpg"
          alt=""
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
            <span aria-current="page">Contact</span>
          </nav>
          <h1 id="contact-title" className={styles.title}>
            Ask about a watch.
          </h1>
          <p className={styles.lead}>
            Write to us about availability, condition, a viewing or a watch you are considering
            selling. We answer from the same inbox.
          </p>
        </div>
      </section>

      <section className={styles.info} id="visit" aria-labelledby="visit-title">
        <div className={styles.infoInner}>
          <div>
            <p className={styles.kicker}>Appointments</p>
            <h2 id="visit-title" className={styles.infoTitle}>
              Hong Kong &amp; Guangzhou
              <br />
              By appointment only
            </h2>
          </div>
          <div>
            <p className={styles.kicker}>Hours</p>
            <p className={styles.infoText}>
              Monday–Saturday
              <br />
              HKT / CST
              <br />
              The appointment address is shared before your visit.
            </p>
          </div>
          <div>
            <p className={styles.kicker}>Direct</p>
            <p className={styles.infoText}>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <br />
              No telephone support is published yet.
              <br />
              Company details are provided before purchase.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.formSection} aria-labelledby="write-title">
        <div className={styles.formInner}>
          <div className={styles.formIntro}>
            <p className={styles.kicker}>Write to us</p>
            <h2 id="write-title">Tell us what you are looking for.</h2>
            <p>
              A reference, a budget or a watch you are thinking of selling. Include the reference
              number if you have it.
            </p>
            <p className={styles.small}>
              {SITE.independence} We do not offer online payment or instant checkout.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
