import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutCode } from "@/components/about/AboutCode";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "OUDYN WATCHS is a pre-owned luxury watch dealer in Milano. We source, authenticate, service and document every watch before it is offered.",
};

const TIMELINE = [
  {
    year: "2016",
    title: "A bench, two buyers",
    body: "OUDYN starts as a buying service for collectors who wanted a second opinion before a private sale. Two people, one bench, no shopfront.",
    moreTitle: "The first rule",
    moreBody: "If we cannot open it, photograph it and explain it, we do not sell it. That rule has not changed.",
    image: "/images/rolex/rolex-white-frame.jpg",
    alt: "Steel watch photographed on a pale background",
  },
  {
    year: "2018",
    title: "The authentication protocol",
    body: "The first written protocol replaces informal judgement: case, movement, dial, hands and paperwork are checked in the same order, every time.",
    moreTitle: "Documented, not guessed",
    moreBody: "Authentication becomes a report with photographs and uncertainties, not a verbal assurance at the counter.",
    image: "/images/rolex/rolex-box.jpg",
    alt: "Watch presented in its travel case",
  },
  {
    year: "2020",
    title: "The Milano studio opens",
    body: "A viewing room on Via Tortona, a bench behind it and enough space to photograph watches properly. Appointments replace the kitchen table.",
    moreTitle: "One viewing room",
    moreBody: "The studio is deliberately small: one table, one bench, one watch at a time. Visitors see the actual piece, not a catalogue render.",
    image: "/images/rolex/store-interior.jpg",
    alt: "The OUDYN studio interior in Milano",
  },
  {
    year: "2022",
    title: "Service brought in-house",
    body: "A watchmaker joins the studio. Movements are timed in six positions, gaskets are replaced when needed and every service is recorded against the reference.",
    moreTitle: "The timing sheet",
    moreBody: "Every mechanical watch leaves with a timing printout and a written note of what was replaced and why.",
    image: "/images/rolex/rolex-wrist.jpg",
    alt: "Pre-owned watch worn on the wrist",
  },
  {
    year: "2024",
    title: "A thousand watches photographed",
    body: "The photography standard is fixed: natural light, actual case, no retouching of scratches or patina. The image is part of the condition report.",
    moreTitle: "The photograph is evidence",
    moreBody: "If a mark is visible in the metal, it stays visible in the photograph. Buyers should know exactly what is arriving.",
    image: "/images/rolex/store-front.jpg",
    alt: "OUDYN storefront in Milano",
  },
  {
    year: "2025",
    title: "The archive goes public",
    body: "Sold references stay online with their specification, condition grade and sale year. The archive becomes a record for owners and for the next buyer.",
    moreTitle: "No disappearing act",
    moreBody: "A sold watch is not deleted from the site. It moves to the archive, where its history remains searchable.",
    image: "/images/rolex/store-street.jpg",
    alt: "Watch district storefront",
  },
  {
    year: "2026",
    title: "Six people, still slow",
    body: "Two buyers, two watchmakers, one photographer and one person answering the inbox. The studio sources fewer watches than it could, on purpose.",
    moreTitle: "The next owner matters",
    moreBody: "Every watch is prepared as if we were going to wear it ourselves, because the next owner will live with the decisions we make.",
    image: "/images/rolex/rolex-dark.jpg",
    alt: "Dark editorial photograph of a pre-owned watch",
  },
];

const SERVICE = [
  {
    id: "shipping",
    title: "Shipping & returns",
    body: "Insured, signature-required delivery within 1–4 working days in Europe. Returns accepted within 14 days, unworn and complete. Full details are in the shipping policy.",
  },
  {
    id: "care",
    title: "Care",
    body: "Rinse the case in fresh water after salt water or chlorine. Have gaskets checked every two years if the watch is worn in water, and service the movement every five to seven years.",
  },
  {
    id: "warranty",
    title: "Warranty",
    body: "Two years on the movement from delivery. The warranty covers mechanical failure and follows the reference number in our authentication report.",
  },
];

const STORE = [
  { src: "/images/rolex/store-interior.jpg", alt: "The OUDYN viewing room in Milano", caption: "The viewing room · Via Tortona 27" },
  { src: "/images/rolex/store-front.jpg", alt: "OUDYN storefront", caption: "Entrance · by appointment" },
  { src: "/images/rolex/store-street.jpg", alt: "The Milan design district", caption: "The district · Zona Tortona" },
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
                OUDYN WATCHS buys, authenticates and resells pre-owned luxury watches. We are not a
                manufacturer and we do not pretend a second-hand watch is new. Our job is to know
                what is original, what has been replaced, what has been polished and what the watch
                is worth because of it.
              </p>
              <p>
                The collection is deliberately short. Most watches we are offered never reach the
                site: the paperwork is unclear, the case has been re-cut, or the story does not
                survive inspection. The ones that do are photographed, serviced where needed and
                sold one at a time.
              </p>
              <Link href="/watches" className={styles.introLink}>
                See what is available →
              </Link>
            </div>
          </div>
          <div className={styles.stats}>
            <div><strong>10</strong><span>years buying privately</span></div>
            <div><strong>1,200+</strong><span>watches inspected</span></div>
            <div><strong>32</strong><span>countries shipped to</span></div>
            <div><strong>02</strong><span>year movement warranty</span></div>
          </div>
        </div>
      </section>

      <section className={styles.store} aria-labelledby="store-title">
        <div className={styles.inner}>
          <p className={styles.sectionLabel} id="store-title">Inside the studio</p>
          <div className={styles.storeGrid}>
            {STORE.map((image) => (
              <figure key={image.src} className={styles.storeFigure}>
                <div className={styles.storeMedia}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, 33vw"
                    className={styles.storeImage}
                  />
                </div>
                <figcaption>{image.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.timeline} aria-labelledby="timeline-title">
        <div className={styles.inner}>
          <h2 className={styles.sectionLabel} id="timeline-title">
            Our timeline
          </h2>
          <div className={styles.entries}>
            {TIMELINE.map((entry) => (
              <article className={styles.entry} key={`${entry.year}-${entry.title}`}>
                <div className={styles.media}>
                  <Image
                    src={entry.image}
                    alt={entry.alt}
                    fill
                    sizes="(max-width: 1023px) 100vw, 62vw"
                    className={styles.image}
                  />
                </div>
                <div className={styles.entryBody}>
                  <span className={styles.year}>{entry.year}</span>
                  <h3 className={styles.entryTitle}>{entry.title}</h3>
                  <p>{entry.body}</p>
                  <div className={styles.more}>
                    <h3 className={styles.entryTitle}>{entry.moreTitle}</h3>
                    <p>{entry.moreBody}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.quote} aria-label="Studio statement">
        <div className={styles.quoteMedia}>
          <Image
            src="/images/rolex/rolex-box.jpg"
            alt="A pre-owned watch in its presentation box"
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className={styles.quoteImage}
          />
        </div>
        <div className={styles.quoteBody}>
          <blockquote>
            “We would rather lose a sale than describe a watch we cannot verify.”
          </blockquote>
          <span>— OUDYN studio, Milano</span>
        </div>
      </section>

      <section className={styles.service} aria-labelledby="service-title">
        <div className={styles.inner}>
          <h2 className={styles.sectionLabel} id="service-title">
            Service
          </h2>
          <div className={styles.serviceRows}>
            {SERVICE.map((item) => (
              <div className={styles.serviceRow} id={item.id} key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
            <div className={styles.serviceRow} id="contact">
              <h3>Contact</h3>
              <p>
                Write to <a href="mailto:studio@oudyn.com">studio@oudyn.com</a> with the reference
                number from the authentication report. OUDYN WATCHS, Via Tortona 27, 20144 Milano,
                Italy. Tuesday–Saturday, 10:00–19:00 CET.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AboutCode />
    </main>
  );
}
