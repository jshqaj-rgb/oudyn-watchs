import type { Metadata } from "next";
import { ContentPage } from "@/components/static/ContentPage";

export const metadata: Metadata = {
  title: "Inspection standard",
  description: "What OUDYN WATCHS records before offering a pre-owned watch.",
};

export default function AuthenticationPage() {
  return (
    <ContentPage
      eyebrow="Inspection"
      title="A written description, not a promise."
      intro="We are an independent reseller. Our inspection records what we observed and what we could not verify. It is not a manufacturer's authentication certificate."
      sections={[
        {
          title: "What we examine",
          body: [
            "Case, dial, hands, crystal, crown, bracelet or strap, movement where accessible, and the paperwork supplied with the watch.",
          ],
        },
        {
          title: "What we write down",
          body: [
            "Reference, year if known, condition, set contents, visible faults and any replacement parts we can identify. Anything outside our competence or not verifiable is described as unverified.",
          ],
        },
        {
          title: "What we do not claim",
          body: [
            "We do not claim to be an authorised dealer, to issue a manufacturer's certificate, or to guarantee a service history we cannot document. We do not describe a watch as factory-original unless the evidence supports it.",
          ],
        },
        {
          title: "Photographs",
          body: [
            "Some listing images are placeholders and are labelled as such. Current photographs of the exact watch are supplied on request before payment.",
          ],
        },
        {
          title: "Independent checks",
          body: [
            "If you want an independent inspection, tell us before payment. We can make the watch available to a mutually agreed watchmaker where practical, at the buyer's cost.",
          ],
        },
      ]}
    />
  );
}
