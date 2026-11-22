import type { Metadata } from "next";
import { ContentPage } from "@/components/static/ContentPage";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for enquiries and purchases from OUDYN WATCHS.",
};

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Terms"
      title="Terms for a second-hand watch."
      intro="These terms describe how this website works today. Any purchase is confirmed in writing before payment."
      sections={[
        {
          title: "About the seller",
          body: [
            "OUDYN WATCHS is an independent reseller of pre-owned watches, operating from Hong Kong and Guangzhou. Contact: studio@oudyn.com.",
            "Company registration details and the appointment address are provided before a purchase. OUDYN WATCHS is not affiliated with Rolex SA or any watch manufacturer.",
          ],
        },
        {
          title: "This website is an enquiry service",
          body: [
            "Prices, stock and specifications are indicative. Submitting the contact form or emailing us does not create an order and does not reserve a watch.",
            "No payment is taken on this website. A sale exists only after we confirm the reference, condition, final total, shipping and any import taxes in writing, and payment has cleared.",
          ],
        },
        {
          title: "Prices, currency and taxes",
          body: [
            "Prices are shown in CNY. Shipping, insurance and import taxes are confirmed before payment. We do not describe a total as including duties or VAT unless that is stated in the written confirmation for that sale.",
          ],
        },
        {
          title: "Condition and photographs",
          body: [
            "Every watch is pre-owned unless expressly described otherwise. Condition, set contents and known faults are stated in the listing or condition report.",
            "Some images are labelled placeholders. A placeholder image is not a photograph of the watch being sold. Actual photographs are supplied on request before payment.",
          ],
        },
        {
          title: "Inspection and paperwork",
          body: [
            "Our condition report records what we examined. It is not a manufacturer's certificate and is not a guarantee of authenticity by the manufacturer. Anything we could not verify is described as unverified.",
          ],
        },
        {
          title: "Payment, returns and warranty",
          body: [
            "Payment is arranged separately after written confirmation. Any return right, warranty or after-sales term applies only if it is stated in that written confirmation. Statutory rights that cannot be excluded are unaffected.",
          ],
        },
        {
          title: "Trademarks and disputes",
          body: [
            "Manufacturer names and model references identify the watches and remain the property of their owners. OUDYN WATCHS does not claim any manufacturer endorsement.",
            "Questions about these terms can be sent to studio@oudyn.com. Nothing here limits a consumer's statutory right to bring a claim in an appropriate jurisdiction.",
          ],
        },
      ]}
    />
  );
}
