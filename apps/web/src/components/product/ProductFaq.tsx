"use client";

import Image from "next/image";
import { useId, useState } from "react";
import styles from "./ProductFaq.module.css";

const QUESTIONS = [
  {
    question: "Is every watch authenticated?",
    answer:
      "Yes. Every reference is examined in the Milano studio before it is listed: case, dial, movement, bracelet or strap, and the paperwork that came with it. The findings are written into the condition report, and anything we cannot verify is described as such rather than assumed.",
  },
  {
    question: "Can I see the condition report?",
    answer:
      "Write to the studio with the reference number and we will send the report, including photographs of the case flanks, lugs, crystal and caseback. If you are viewing in person, the watch is on the bench and you are welcome to inspect it under a loupe.",
  },
  {
    question: "Has the watch been serviced?",
    answer:
      "Where the service history is documented, it is included in the listing. Where it is not, the movement is checked on the timing machine and the watch is priced accordingly. We do not describe a watch as serviced unless there is a record or the work was carried out by our watchmaker.",
  },
  {
    question: "What is included with the watch?",
    answer:
      "The listing states whether it is a full set, box and papers, or watch only. Every sale includes the OUDYN authentication report and a two-year warranty on the movement. Any additional strap, tool or pouch shown in the photographs is listed explicitly.",
  },
  {
    question: "Can I return the watch?",
    answer:
      "Yes, within 14 days of delivery, provided the watch is returned in the condition in which it was sent, with all accompanying documents and the security tag intact. Return shipping is insured and arranged with the studio.",
  },
  {
    question: "How is the watch shipped?",
    answer:
      "Fully insured, signature required, within 2/4 business days of cleared payment. We ship from Milano to the countries listed at checkout. Duties and taxes are shown before you confirm the order, not added afterwards.",
  },
];

export function ProductFaq() {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section className={styles.section} aria-labelledby="faq-title">
      <div className={styles.inner}>
        <h2 id="faq-title" className={styles.title}>
          FAQ
        </h2>
        <div className={styles.items}>
          {QUESTIONS.map((entry, index) => {
            const expanded = open === index;
            const panelId = `${baseId}-${index}`;
            return (
              <div key={entry.question} className={styles.item}>
                <h3>
                  <button
                    type="button"
                    className={styles.question}
                    onClick={() => setOpen(expanded ? null : index)}
                    aria-expanded={expanded}
                    aria-controls={panelId}
                  >
                    <span>{entry.question}</span>
                    <span className={styles.mark} aria-hidden="true">
                      {expanded ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                {expanded && (
                  <div className={styles.answer} id={panelId}>
                    <p>{entry.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className={styles.media}>
          <Image
            src="/images/rolex/rolex-wrist.jpg"
            alt="OUDYN watch worn on the wrist"
            fill
            sizes="(max-width: 1023px) 100vw, 22vw"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
