import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CheckoutView } from "@/components/store/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Confirm an OUDYN order. Stock is checked before payment.",
};

export default function CheckoutPage() {
  return (
    <main id="main" className="pageMain">
      <div className="container">
        <PageHeader
          title="Checkout"
          intro="Orders are confirmed by hand. Give us a delivery address; we check the reference against stock and send a secure payment link. Nothing is charged on this page."
          meta={
            <>
              <span>Dispatch in 2–3 working days</span>
              <span>Payment by secure link</span>
            </>
          }
        />
        <CheckoutView />
      </div>
    </main>
  );
}
