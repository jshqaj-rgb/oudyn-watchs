import type { Metadata } from "next";
import { ContentPage } from "@/components/static/ContentPage";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How OUDYN WATCHS handles enquiry and order data.",
};

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Privacy"
      title="Only the data needed to answer."
      intro="This policy describes what this website currently collects. It does not claim an account system, analytics or payment processing that is not in place."
      sections={[
        {
          title: "Who is responsible",
          body: [
            "OUDYN WATCHS is an independent reseller operating from Hong Kong and Guangzhou. Privacy requests can be sent to studio@oudyn.com.",
            "Company details and any representative required for a target market are provided before sales open in that market.",
          ],
        },
        {
          title: "What this site collects",
          body: [
            "The contact form collects your name, email, subject, message and an optional reference number. If you send an availability enquiry, we also receive the references you selected and the email you write from.",
            "The cart and wishlist are stored in your browser's local storage. They are not sent to us until you submit an enquiry.",
            "We do not take card details, do not process online payments and do not create customer accounts.",
          ],
        },
        {
          title: "Why we use it",
          body: [
            "To reply to your enquiry, confirm a watch's availability and condition, and keep a record of what was agreed before a sale.",
          ],
          bullets: [
            "Contract or pre-contract steps: answering an availability enquiry",
            "Legitimate interest: keeping a record of written confirmations",
            "Legal obligation: records we are required to keep",
          ],
        },
        {
          title: "Storage and sharing",
          body: [
            "Enquiries submitted through the site are stored in Cloudflare KV and are accessible to the people who answer the inbox. We do not sell personal data.",
            "We share data only with service providers needed to host the site or complete a sale, and only to the extent required.",
          ],
        },
        {
          title: "Retention",
          body: [
            "Enquiries are kept for as long as needed to answer them and to support any follow-up sale or after-sales question. You can ask us to delete an enquiry that did not lead to a sale.",
          ],
        },
        {
          title: "Your rights",
          body: [
            "You can ask for a copy of your data, correction, deletion, restriction, or object to processing. Write to studio@oudyn.com. You may also complain to the data protection authority in your country.",
          ],
        },
        {
          title: "Cookies and local storage",
          body: [
            "This site does not run analytics or advertising cookies. The cart and wishlist use browser local storage so a selection survives a page refresh. Clearing site data removes it.",
          ],
        },
      ]}
    />
  );
}
