import type { Metadata } from "next";
import { ContentPage } from "@/components/static/ContentPage";

export const metadata: Metadata = {
  title: "Terms of sale",
  description:
    "Terms and conditions for buying pre-owned watches from OUDYN WATCHS, including orders, authentication, returns and warranty.",
};

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Terms"
      title="The terms behind a second-hand watch."
      intro="These terms apply to purchases made through this website. They sit alongside the authentication report and warranty supplied with each watch."
      sections={[
        {
          title: "About the seller",
          body: [
            "OUDYN WATCHS, Via Tortona 27, 20144 Milano, Italy. Contact: studio@oudyn.com. The site is operated from Italy and governed by Italian law.",
          ],
        },
        {
          title: "Orders and acceptance",
          body: [
            "An order is an offer to buy. We accept it when we confirm dispatch; until then the watch remains available. If a watch sells in the studio before the online order is processed, we cancel and refund in full.",
            "Prices are shown in euros and include VAT for EU deliveries. We may correct a manifest pricing error before accepting an order.",
          ],
        },
        {
          title: "Condition and photographs",
          body: [
            "Every watch is pre-owned unless expressly described as new old stock. The photographs show the actual piece. Small variations in colour are possible between screens; condition grades and written descriptions take precedence.",
            "Box, papers and accessories are included only where listed. A “watch only” sale includes the watch and the OUDYN travel case, not the original manufacturer's box or papers.",
          ],
        },
        {
          title: "Authentication and verification",
          body: [
            "Our authentication report records what we inspected and what we concluded. It is not a manufacturer's certificate. If an independent authentication establishes that a watch is not authentic, return it within 30 days for a full refund.",
          ],
        },
        {
          title: "Payment",
          body: [
            "We accept the payment methods shown at checkout. Watches are not released until payment clears. For bank transfers, the watch is reserved for two working days.",
          ],
        },
        {
          title: "Returns, warranty and liability",
          body: [
            "The 14-day return right and two-year movement warranty are described in the shipping and returns page. The warranty does not cover impact damage, water ingress after a case has been opened by a third party, or normal wear.",
            "Nothing in these terms limits rights that cannot be excluded under Italian or EU consumer law. Our liability for indirect or consequential loss is excluded to the extent permitted by law.",
          ],
        },
        {
          title: "Intellectual property and disputes",
          body: [
            "The OUDYN name, photography and written content are owned by OUDYN WATCHS. Manufacturer names and model references are used to identify the watches and remain the property of their owners.",
            "Disputes are governed by Italian law and the courts of Milano, without prejudice to your right to bring proceedings in your country of residence.",
          ],
        },
      ]}
    />
  );
}
