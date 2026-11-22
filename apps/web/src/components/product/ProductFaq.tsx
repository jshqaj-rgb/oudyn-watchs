"use client";

import Image from "next/image";
import { useId, useState } from "react";
import styles from "./ProductFaq.module.css";

const QUESTIONS = [
  {
    question: "How is a watch inspected?",
    answer:
      "Every reference is examined before it is listed: case, dial, movement, bracelet or strap, and the paperwork that came with it. The findings are written into the condition report. Anything we cannot verify is described as unverified, not assumed.",
  },
  {
    question: "Can I see the condition report?",
    answer:
      "Write to us with the reference number and we will send the report, including photographs of the case flanks, lugs, crystal and caseback. If you are viewing in person, you are welcome to inspect the watch under a loupe.",
  },
  {
    question: "Has the watch been serviced?",
    answer:
      "Where the service history is documented, it is included in the listing. Where it is not, the movement is checked on the timing machine and the watch is priced accordingly. We do not describe a watch as serviced unless there is a record or the work was carried out by our watchmaker.",
  },
  {
    question: "What is included with the watch?",
    answer:
      "The listing states whether it is a full set, box and papers, or watch only. A condition report is supplied. Any warranty is only valid if it is stated in writing for that specific watch. Additional straps, tools or pouches are listed explicitly.",
  },
  {
    question: "Can I return the watch?",
    answer:
      "You may return the watch within 14 days of delivery for a full refund of the purchase price, without giving a reason. Contact studio@oudyn.com before sending it back so we can confirm the return address and insurance. Statutory rights are unaffected.",
  },
  {
    question: "How is the watch shipped?",
    answer:
      "We ship from Hong Kong. Cost, insurance, lead time and any import taxes are confirmed in writing before payment. We do not describe a delivery date until the carrier booking is confirmed.",
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
            alt="Placeholder photograph of a watch worn on the wrist"
            fill
            sizes="(max-width: 1023px) 100vw, 22vw"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
