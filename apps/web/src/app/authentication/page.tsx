import type { Metadata } from "next";
import { ContentPage } from "@/components/static/ContentPage";

export const metadata: Metadata = {
  title: "Authentication & grading",
  description:
    "How OUDYN WATCHS authenticates, grades and documents every pre-owned luxury watch before it is offered for sale.",
};

export default function AuthenticationPage() {
  return (
    <ContentPage
      eyebrow="Authentication & grading"
      title="What “authenticated” actually means here."
      intro="Authentication is not a sticker. It is a chain of checks on the case, movement, dial, paperwork and ownership, written down so the next owner can read it."
      sections={[
        {
          title: "Before a watch reaches the studio",
          body: [
            "We source from private owners, established dealers and collections we can trace. Every incoming watch is photographed on arrival before it is opened, so there is a record of its condition at the door.",
            "We ask for the ownership history, the original invoice where it exists, and any service paperwork. A watch without paperwork can still be authentic; it simply carries a different burden of proof.",
          ],
        },
        {
          title: "On the bench",
          body: [
            "The case is opened by a watchmaker. The movement, dial, hands, crystal, crown and caseback are checked against the reference. Serial and reference numbers are recorded and photographed under magnification.",
            "We check that the movement is correct for the reference, that the dial and hands are period-correct, and that the case has not been over-polished or re-cut. Parts that have been replaced are listed; parts we cannot verify are listed as unverified.",
          ],
          bullets: [
            "Case and lugs measured and photographed",
            "Movement identity and condition recorded",
            "Dial, hands and crystal checked for originality",
            "Serial and reference numbers documented",
            "Water resistance tested when the reference allows it",
          ],
        },
        {
          title: "What travels with the watch",
          body: [
            "Every watch leaves with a written authentication report, a timing sheet where relevant, photographs of the actual piece and a two-year warranty on the movement. If the original box and papers are present, they are listed by item.",
            "The report is not a certificate of originality for every component. It is a record of what we inspected and what we concluded, including the uncertainties.",
          ],
        },
        {
          title: "Grading, in plain language",
          body: [
            "We use four condition grades: Excellent, Very good, Good and Vintage. They describe wear, not age. A 1990s watch can be Excellent; a two-year-old watch can be Good.",
          ],
          bullets: [
            "Excellent — minimal signs of wear, case lines intact, no visible scratches on the crystal",
            "Very good — light wear on the case or bracelet, honest patina, no structural damage",
            "Good — visible wear consistent with regular use, case may have been lightly polished",
            "Vintage — age-related patina and wear; originality and service history matter more than cosmetics",
          ],
        },
        {
          title: "What we do not do",
          body: [
            "We do not sell watches with unclear ownership, missing or altered serial numbers, or aftermarket dials presented as original. We do not describe a watch as “full set” unless the box, papers and accessories are present and correct.",
            "If we cannot verify a component, we say so before the sale. If that changes your decision, the deposit is refundable.",
          ],
        },
      ]}
    />
  );
}
