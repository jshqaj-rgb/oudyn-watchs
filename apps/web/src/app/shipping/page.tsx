import type { Metadata } from "next";
import { ContentPage } from "@/components/static/ContentPage";

export const metadata: Metadata = {
  title: "Shipping & returns",
  description:
    "Insured shipping, delivery times, duties, returns and warranty for watches bought from OUDYN WATCHS.",
};

export default function ShippingPage() {
  return (
    <ContentPage
      eyebrow="Shipping & returns"
      title="Insured, signed for, and packed like it matters."
      intro="Every watch ships fully insured in its travel case. Delivery is signature-required; we do not leave watches at a door."
      sections={[
        {
          title: "Dispatch and delivery",
          body: [
            "Orders placed before 14:00 CET on a working day are usually dispatched the same day. Watches that need a final regulation may take two to three working days.",
            "Italy: 1–2 working days. European Union: 2–4 working days. United Kingdom, Switzerland and Norway: 3–5 working days. Rest of world: 4–8 working days, depending on customs.",
          ],
        },
        {
          title: "Shipping cost and duties",
          body: [
            "Shipping is complimentary on all watch orders. Prices include VAT for EU deliveries; VAT is removed at checkout for orders shipped outside the EU where the destination allows it.",
            "Import duties and local taxes outside the EU are the responsibility of the buyer. We declare the full value on every shipment and cannot mark a watch as a gift or lower the value.",
          ],
        },
        {
          title: "Packaging and insurance",
          body: [
            "Watches travel in the OUDYN travel case, inside a plain outer box, with the authentication report and warranty card. The parcel is insured for the full purchase value until signature.",
            "If a parcel arrives damaged, photograph the box before opening it and contact us the same day. If the watch is not as described, stop and write to us before wearing it.",
          ],
        },
        {
          title: "Returns",
          body: [
            "You may return a watch within 14 days of delivery for a full refund, provided it is unworn, complete and in the condition it was sent. Straps that have been worn, sized bracelets and engraved casebacks are not returnable.",
            "Start a return by writing to studio@oudyn.com with the order number. We arrange insured collection and refund within five working days of inspection. Original shipping costs are refunded for EU orders; return shipping is deducted outside the EU.",
          ],
        },
        {
          title: "Warranty",
          body: [
            "Every watch carries a two-year warranty on the movement from the delivery date. The warranty covers mechanical failure, not damage from impact, water ingress after an opened case, or normal wear.",
            "Service under warranty is arranged by the studio. Do not take a warranty watch to a third-party watchmaker without speaking to us first.",
          ],
        },
      ]}
    />
  );
}
