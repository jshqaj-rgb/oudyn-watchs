import Image from "next/image";
import Link from "next/link";
import { RomeReadout } from "@/components/home/RomeReadout";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Image
        src="/images/rolex/rolex-dark.jpg"
        alt="Placeholder atmosphere photograph of a dive watch on dark coffee beans"
        fill
        priority
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.shade} aria-hidden="true" />

      <div className={styles.frame}>
        <div className={styles.copy}>
          <p className={styles.kicker}>OUDYN · Hong Kong & Guangzhou · Independent dealer</p>
          <h1 id="hero-title" className={styles.title}>
            Pre-owned Rolex, inspected and documented piece by piece.
          </h1>
          <p className={styles.sub}>
            Each listing describes the watch as we found it, with condition and set contents. Ask for
            current photographs before paying. Ships worldwide from Hong Kong.
          </p>

          <div className={styles.actions}>
            <Link href="/watches" className={styles.primary}>
              Shop the collection <span aria-hidden="true">→</span>
            </Link>
            <Link href="/sell" className={styles.secondary}>
              Sell your watch
            </Link>
          </div>

          <RomeReadout />
        </div>

        <aside className={styles.studio} aria-label="Visit the studio">
          <p className={styles.studioLabel}>Visit by appointment</p>
          <p className={styles.studioTitle}>Hong Kong &amp; Guangzhou</p>
          <p className={styles.studioText}>
            The appointment address is shared before your visit.
            <br />
            Monday–Saturday, HKT / CST.
            <br />
            Private viewings only.
          </p>
          <Link href="/contact#visit" className={styles.studioLink}>
            Book a viewing <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </div>

      <p className={styles.footnote} aria-hidden="true">
        Independent reseller · Not affiliated with Rolex SA
      </p>
    </section>
  );
}
