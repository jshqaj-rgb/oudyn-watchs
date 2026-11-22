import Link from "next/link";
import {
  CertificateVisual,
  PressureVisual,
  RegulationVisual,
} from "@/components/visual/CraftVisual";
import styles from "./QualityPromise.module.css";

const CARDS = [
  {
    title: "Condition, written down",
    text: "Case wear, visible faults, set contents and anything we cannot verify are recorded before a watch is offered.",
    Visual: PressureVisual,
  },
  {
    title: "Inspected before it is listed",
    text: "We examine what we can and describe the watch as it is. We do not claim a service history we cannot document.",
    Visual: RegulationVisual,
  },
  {
    title: "Terms before payment",
    text: "The final USD total, shipping, import taxes, return terms and any warranty are confirmed in writing before you pay.",
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
            Read our inspection standard
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
