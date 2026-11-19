import Link from "next/link";
import {
  CertificateVisual,
  PressureVisual,
  RegulationVisual,
} from "@/components/visual/CraftVisual";
import styles from "./QualityPromise.module.css";

const CARDS = [
  {
    title: "Authenticated, not assumed",
    text: "Every reference is checked against its case, movement, dial and paperwork. We document what is original, what has been replaced and what we cannot verify.",
    Visual: PressureVisual,
  },
  {
    title: "Serviced before it is sold",
    text: "Movements are timed in six positions and serviced only when the readings require it. The timing sheet travels with the watch.",
    Visual: RegulationVisual,
  },
  {
    title: "A provenance you can keep",
    text: "Each watch leaves with an authentication report, service record and photographs of the actual piece. Two-year warranty on the movement.",
    Visual: CertificateVisual,
  },
];

export function QualityPromise() {
  return (
    <section className={styles.section} aria-labelledby="quality-title">
      <div className="container">
        <div className={styles.head}>
          <h2 id="quality-title" className={styles.title}>
            The OUDYN standard
          </h2>
          <Link href="/authentication" className="textLink">
            How we authenticate
          </Link>
        </div>

        <div className={styles.grid}>
          {CARDS.map(({ title, text, Visual }) => (
            <article key={title} className={styles.card}>
              <div className={styles.media}>
                <Visual />
              </div>
              <div className={styles.body}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.text}>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
