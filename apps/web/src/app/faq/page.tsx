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
    a: "The watch is examined and described. The report records what was seen on the case, movement, dial, hands, crystal and numbers, and lists what we could not verify. It is not a manufacturer's authentication certificate.",
  },
  {
    q: "What does the condition grade mean?",
    a: "Excellent means minimal wear and intact case lines. Very good means light wear consistent with careful use. Good means visible wear, possibly light polishing. Vintage means age-related patina where originality matters more than cosmetics.",
  },
  {
    q: "Is the watch in the photograph the watch I receive?",
    a: "Not always. Some listing images are labelled placeholders because we do not yet have photographs of that exact piece. Ask for current photographs before paying; the written description and condition report take precedence.",
  },
  {
    q: "Do watches come with box and papers?",
    a: "Only where listed. The reference page states whether the original box, warranty card and accessories are present. A watch-only sale includes only what the listing says it includes.",
  },
  {
    q: "Can I return a watch?",
    a: "Any return right is confirmed in writing before payment. Statutory rights are unaffected. Write to studio@oudyn.com if you want the return terms for a specific reference.",
  },
  {
    q: "What does the warranty cover?",
    a: "There is no blanket warranty on this website. Any warranty applies only if it is written into the documents for that specific watch.",
  },
  {
    q: "Do you ship outside the EU?",
    a: "We ship internationally from Hong Kong. Cost, insurance, lead time and import taxes are confirmed before payment. We do not describe a delivery date until the carrier booking is confirmed.",
  },
  {
    q: "Can I sell or trade my watch?",
    a: "Send the reference, year, box and papers status, service history and photographs through the sell page. We reply with a range only after we have enough information to assess the watch.",
  },
  {
    q: "Can I see a watch before buying?",
    a: "Viewings are by appointment in Hong Kong or Guangzhou. If you are elsewhere, ask for current photographs and a video inspection before paying.",
  },
];

export default function FaqPage() {
  return (
    <ContentPage
      eyebrow="FAQ"
      title="Questions we are asked before a first purchase."
      intro="If your question is not here, write to the studio."
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
