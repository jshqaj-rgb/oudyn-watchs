import type { Metadata } from "next";
import { ContentPage } from "@/components/static/ContentPage";
import { SITE } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "How to buy a pre-owned watch",
  description:
    "How to buy a pre-owned luxury watch from OUDYN WATCHS: choosing a reference, requesting current photographs, confirming condition and set contents, and arranging payment and delivery.",
};

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.oudyn.com").replace(/\/$/, "");

const STEPS = [
  {
    name: "Choose a reference",
    text: "Start with the reference, case size, year and set contents that matter to you. The listing shows what is known about that watch; if a detail is missing, ask before you compare prices.",
    note: "Useful to send: reference number, wrist size, and whether box and papers matter.",
  },
  {
    name: "Ask for current photographs",
    text: "Some listings use a labelled placeholder image. Ask for current photographs of the actual watch, including the case sides, lugs, dial, bracelet or strap, caseback and any marks.",
    note: "We do not describe a watch as photographed if the image is a placeholder.",
  },
  {
    name: "Confirm condition and set contents",
    text: "Read the condition note and the set contents. Ask which parts are original, what has been replaced or polished, and what is included in the sale. Anything not documented is treated as unknown.",
    note: "The written description and condition record take precedence over a photograph.",
  },
  {
    name: "Confirm the final total",
    text: "Before paying, confirm the USD price, shipping cost, insurance, estimated lead time and any import taxes or duties for your destination. The final total is confirmed in writing.",
    note: "This site does not take online payment or create an order.",
  },
  {
    name: "Pay and arrange delivery",
    text: "Payment is arranged with the studio after availability is confirmed. We confirm the delivery address, carrier, insurance and signature requirements before dispatch.",
    note: "Keep the reference number in every message so the same desk can follow the sale.",
  },
  {
    name: "Inspect on arrival",
    text: "Check the parcel and the watch on arrival. If something differs from the written description, contact the studio before wearing or altering the watch. The 14-day money-back guarantee applies from delivery.",
    note: "Write to studio@oudyn.com with photographs and the reference number.",
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to buy a pre-owned watch from OUDYN WATCHS",
  description:
    "A six-step guide to choosing, verifying and receiving a pre-owned watch from an independent dealer.",
  dateModified: SITE.lastUpdated,
  step: STEPS.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.name,
    text: step.text,
    url: `${BASE}/how-to/#step-${index + 1}`,
  })),
};

export default function HowToPage() {
  return (
    <ContentPage
      eyebrow="How to buy"
      title="A slower way to buy a watch."
      intro="Six steps from a reference number to a watch on your wrist. No online checkout, no pressure to decide before the facts are clear."
      sections={[]}
      dark
      lastUpdated={SITE.lastUpdated}
      schema={howToSchema}
    >
      <ol className={styles.steps}>
        {STEPS.map((step, index) => (
          <li key={step.name} id={`step-${index + 1}`} className={styles.step}>
            <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{step.name}</h2>
              <p>{step.text}</p>
              <p className={styles.note}>{step.note}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className={styles.end}>
        <p>Ready to look at a specific watch?</p>
        <a href="/watches/">Browse current references →</a>
      </div>
    </ContentPage>
  );
}
