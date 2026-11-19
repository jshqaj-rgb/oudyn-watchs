import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact & visit",
  description:
    "Visit OUDYN WATCHS in Milano, book a private viewing or write to the studio about buying, selling or servicing a pre-owned luxury watch.",
};

const STORE_IMAGES = [
  { src: "/images/rolex/store-interior.jpg", alt: "The OUDYN studio interior in Milano", caption: "The viewing room" },
  { src: "/images/rolex/store-front.jpg", alt: "OUDYN watch boutique storefront", caption: "Via Tortona 27" },
  { src: "/images/rolex/store-street.jpg", alt: "Watch boutiques in the Milan design district", caption: "The district" },
];

export default function ContactPage() {
  return (
    <main id="main" className={styles.page}>
      <section className={styles.hero} aria-labelledby="contact-title">
        <Image
          src="/images/rolex/store-interior.jpg"
          alt="Interior of the OUDYN watch studio"
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
            Visit the studio. Or write first.
          </h1>
          <p className={styles.lead}>
            We keep one viewing room and a small bench. Appointments are preferred so the watch you
            want to see is ready when you arrive.
          </p>
        </div>
      </section>

      <section className={styles.info} id="visit" aria-labelledby="visit-title">
        <div className={styles.infoInner}>
          <div>
            <p className={styles.kicker}>The studio</p>
            <h2 id="visit-title" className={styles.infoTitle}>
              Via Tortona 27
              <br />
              20144 Milano, Italy
            </h2>
          </div>
          <div>
            <p className={styles.kicker}>Opening hours</p>
            <p className={styles.infoText}>
              Tuesday–Saturday
              <br />
              10:00–19:00 CET
              <br />
              Sunday–Monday by appointment
            </p>
          </div>
          <div>
            <p className={styles.kicker}>Direct</p>
            <p className={styles.infoText}>
              <a href="mailto:studio@oudyn.com">studio@oudyn.com</a>
              <br />
              <a href="tel:+390212345678">+39 02 1234 5678</a>
              <br />
              WhatsApp on request
            </p>
          </div>
        </div>
      </section>

      <section className={styles.gallery} aria-label="Studio photographs">
        <div className={styles.galleryInner}>
          {STORE_IMAGES.map((image) => (
            <figure key={image.src} className={styles.figure}>
              <div className={styles.figureMedia}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className={styles.figureImage}
                />
              </div>
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.formSection} aria-labelledby="write-title">
        <div className={styles.formInner}>
          <div className={styles.formIntro}>
            <p className={styles.kicker}>Write to us</p>
            <h2 id="write-title">Tell us what you are looking for.</h2>
            <p>
              A reference, a budget, a wrist size or a watch you are thinking of selling. A real
              person reads every message and replies within one working day.
            </p>
            <p className={styles.small}>
              For authentication or service requests, include the reference number engraved between
              the lugs if you have it.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
