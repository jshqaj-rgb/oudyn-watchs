import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CheckoutView } from "@/components/store/CheckoutView";

export const metadata: Metadata = {
  title: "Availability enquiry",
  description: "Ask about a reference. No payment is taken online.",
};

export default function CheckoutPage() {
  return (
    <main id="main" className="pageMain">
      <div className="container">
        <PageHeader
          title="Availability enquiry"
          intro="No payment is taken on this site and no order is created. Send the reference you want; we confirm availability, condition and the final total in writing first."
          meta={
            <>
              <span>No online payment</span>
              <span>Enquiry only</span>
            </>
          }
        />
        <CheckoutView />
      </div>
    </main>
  );
}
