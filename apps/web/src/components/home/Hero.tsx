import Image from "next/image";
import Link from "next/link";
import { RomeReadout } from "@/components/home/RomeReadout";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Image
        src="/images/rolex/rolex-dark.jpg"
        alt="A pre-owned Rolex dive watch photographed on dark coffee beans"
        fill
        priority
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.shade} aria-hidden="true" />

      <div className={styles.frame}>
        <div className={styles.copy}>
          <p className={styles.kicker}>Oudyn Watchs · Milano · Est. 2016</p>
          <h1 id="hero-title" className={styles.title}>
            Pre-owned luxury watches, authenticated in Milano.
          </h1>
          <p className={styles.sub}>
            A small, hand-picked collection of modern and vintage references. Every watch is
            inspected, serviced where needed, and photographed in our studio before it is offered.
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
          <p className={styles.studioLabel}>Visit the studio</p>
          <p className={styles.studioTitle}>Via Tortona 27</p>
          <p className={styles.studioText}>
            20144 Milano, Italy
            <br />
            Tuesday–Saturday, 10:00–19:00
            <br />
            Private viewings by appointment.
          </p>
          <Link href="/contact#visit" className={styles.studioLink}>
            Book a viewing <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </div>

      <p className={styles.footnote} aria-hidden="true">
        Authentication · Servicing · Provenance
      </p>
    </section>
  );
}
