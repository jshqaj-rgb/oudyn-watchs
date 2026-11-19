import type { Metadata } from "next";
import { ContentPage } from "@/components/static/ContentPage";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How OUDYN WATCHS collects, uses and protects personal data for orders, enquiries and newsletter subscriptions.",
};

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Privacy"
      title="Your data, kept to what the watch requires."
      intro="This policy explains what we collect when you buy, sell, subscribe or write to us, and how to ask us to delete it."
      sections={[
        {
          title: "Who is responsible",
          body: [
            "OUDYN WATCHS, Via Tortona 27, 20144 Milano, Italy, is the data controller for this website. Write to studio@oudyn.com for any privacy request.",
          ],
        },
        {
          title: "What we collect",
          body: [
            "When you place an order we collect your name, email, delivery address, order lines and payment status. We do not store card numbers on our servers; payments are processed by the payment provider.",
            "When you write to us we keep your name, email, subject, message and any reference number you include. Newsletter subscriptions store your email and the date you subscribed.",
            "Our hosting and analytics providers may process technical data such as IP address, browser type and pages visited. We use this to keep the site working and to understand which references are viewed.",
          ],
        },
        {
          title: "Why we use it",
          body: [
            "To fulfil orders, authenticate watches, arrange shipping and handle warranty or returns. To answer enquiries and provide valuations. To send the newsletter when you have asked for it. To meet legal, accounting and tax obligations.",
          ],
          bullets: [
            "Contract: processing an order or a repair",
            "Legitimate interest: fraud prevention, site security, service improvement",
            "Consent: newsletter and optional analytics cookies",
            "Legal obligation: invoices, tax and consumer records",
          ],
        },
        {
          title: "Who we share it with",
          body: [
            "We share only what is necessary with couriers, payment providers, our hosting provider and professional advisers. We do not sell personal data. Where a processor is outside the EEA, transfers rely on standard contractual clauses or an adequacy decision.",
          ],
        },
        {
          title: "How long we keep it",
          body: [
            "Order and warranty records are kept for ten years to support authentication and service. Enquiries are kept for two years. Newsletter data is kept until you unsubscribe. Analytics data is kept for no longer than 14 months.",
          ],
        },
        {
          title: "Your rights",
          body: [
            "You can ask for a copy of your data, correct it, delete it, restrict processing or object to direct marketing. Write to studio@oudyn.com and we reply within one month. You can also complain to the Italian data protection authority (Garante per la protezione dei dati personali).",
          ],
        },
        {
          title: "Cookies",
          body: [
            "We use strictly necessary cookies for the cart, wishlist and checkout. Optional analytics cookies are only set after consent. You can clear or block cookies in your browser; the cart and wishlist may stop working if you do.",
          ],
        },
      ]}
    />
  );
}
