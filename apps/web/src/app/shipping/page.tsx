import type { Metadata } from "next";
import { ContentPage } from "@/components/static/ContentPage";

export const metadata: Metadata = {
  title: "Shipping & returns",
  description: "How OUDYN WATCHS confirms shipping, insurance, taxes and returns.",
};

export default function ShippingPage() {
  return (
    <ContentPage
      eyebrow="Shipping & returns"
      title="Shipping is quoted, not promised."
      intro="We ship from Hong Kong. Cost, insurance, lead time and import taxes are confirmed in writing before payment, because they depend on the destination and the value of the watch."
      sections={[
        {
          title: "Before payment",
          body: [
            "We confirm the destination, carrier, insured value and total shipping cost in writing. We do not describe a delivery date until the carrier booking is confirmed.",
          ],
        },
        {
          title: "Import taxes and duties",
          body: [
            "Import taxes and duties depend on the destination and are not included in the CNY price shown on the listing. We tell you what we know before payment; any charge collected by customs is the buyer's responsibility unless we state otherwise in writing.",
          ],
        },
        {
          title: "Packing and insurance",
          body: [
            "Watches are packed for transit and insured for the confirmed value. A signature is required on delivery. If a parcel arrives damaged, keep the packaging and contact us before opening the watch.",
          ],
        },
        {
          title: "Returns",
          body: [
            "Any return right is confirmed in writing before payment and is subject to the condition stated in that confirmation. Statutory rights are unaffected.",
            "Do not send a watch back without written instructions. We will confirm the return address, carrier and insurance requirements first.",
          ],
        },
        {
          title: "Warranty",
          body: [
            "There is no blanket warranty on this website. Any warranty applies only if it is written into the documents for that specific watch. This page is not a warranty.",
          ],
        },
        {
          title: "Questions",
          body: ["Write to studio@oudyn.com with the reference number and destination country."],
        },
      ]}
    />
  );
}
