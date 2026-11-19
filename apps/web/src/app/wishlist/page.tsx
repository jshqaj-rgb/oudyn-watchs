import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { WishlistView } from "@/components/store/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Saved OUDYN references, kept in this browser.",
};

export default function WishlistPage() {
  return (
    <main id="main" className="pageMain">
      <div className="container">
        <PageHeader
          title="Wishlist"
          intro="Saved references live in this browser. Nothing is reserved until an order is confirmed, so a saved watch can sell out."
          meta={
            <>
              <span>Stored locally</span>
              <span>No account needed</span>
            </>
          }
        />
        <WishlistView />
      </div>
    </main>
  );
}
