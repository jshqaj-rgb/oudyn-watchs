import type { Metadata } from "next";
import { ContentPage } from "@/components/static/ContentPage";
import styles from "./faq.module.css";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about buying pre-owned luxury watches from OUDYN WATCHS: authentication, condition, shipping, returns, warranty and selling.",
};

const FAQS = [
  {
    q: "Are the watches new or pre-owned?",
    a: "Almost everything on the site is pre-owned. Each reference page lists the year, condition grade and what is included. If a watch is new old stock, it is described as such.",
  },
  {
    q: "How do you authenticate a watch?",
    a: "A watchmaker checks the case, movement, dial, hands, crystal, crown and numbering against the reference. Serial and reference numbers are photographed, and the report lists what is original, what has been replaced and what we could not verify.",
  },
  {
    q: "What does the condition grade mean?",
    a: "Excellent means minimal wear and intact case lines. Very good means light wear consistent with careful use. Good means visible wear, possibly light polishing. Vintage means age-related patina where originality matters more than cosmetics.",
  },
  {
    q: "Is the watch in the photograph the watch I receive?",
    a: "Yes. Each pre-owned watch is a single piece and is photographed in the studio. Small variations in colour can occur between screens.",
  },
  {
    q: "Do watches come with box and papers?",
    a: "Only where listed. The reference page and authentication report say whether the original box, warranty card and accessories are present. A watch-only sale still includes the OUDYN travel case and authentication report.",
  },
  {
    q: "Can I return a watch?",
    a: "Yes, within 14 days of delivery, unworn and complete. Worn straps, sized bracelets and engraved casebacks are excluded. Write to studio@oudyn.com to arrange insured collection.",
  },
  {
    q: "What does the warranty cover?",
    a: "Two years on the movement from delivery, covering mechanical failure. It does not cover impact damage, water ingress after a case has been opened by a third party, or normal wear.",
  },
  {
    q: "Do you ship outside the EU?",
    a: "Yes. Shipping is insured and signature-required. Import duties and local taxes outside the EU are the buyer's responsibility. We declare the full value on every parcel.",
  },
  {
    q: "Can I sell or trade my watch?",
    a: "Yes. Send the reference, year, box and papers status, service history and photographs through the sell page. We reply with an indicative range within one working day and confirm after inspection.",
  },
  {
    q: "Can I see a watch before buying?",
    a: "Yes. Book an appointment at the Milano studio. We can also arrange a video inspection with macro photographs and a live timing run if you are outside Italy.",
  },
];

export default function FaqPage() {
  return (
    <ContentPage
      eyebrow="FAQ"
      title="Questions we are asked before a first purchase."
      intro="If your question is not here, write to the studio. A real person replies within one working day."
      sections={[]}
    >
      <div className={styles.list}>
        {FAQS.map((item, index) => (
          <details key={item.q} className={styles.item}>
            <summary>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <span>{item.q}</span>
              <span className={styles.mark} aria-hidden="true">+</span>
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </ContentPage>
  );
}
