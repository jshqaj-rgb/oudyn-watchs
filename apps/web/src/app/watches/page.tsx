import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/product/CatalogBrowser";
import { getCollections, getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Pre-owned watches",
  description:
    "Pre-owned watches listed by OUDYN WATCHS, an independent reseller based in Hong Kong and Guangzhou.",
};

export default async function WatchesPage() {
  const [initial, collections] = await Promise.all([
    getProducts({ category: "watches", sort: "featured", limit: 12 }),
    getCollections(),
  ]);

  const lineup = collections.filter((collection) => collection.count > 0).slice(0, 5).map((collection) => ({
    label: collection.handle === "accessories" ? "Straps" : collection.title,
    count: collection.count,
    href: `/collections/${collection.handle}`,
  }));

  return (
    <main id="main">
      <CatalogBrowser
        initial={initial}
        category="watches"
        title="New in"
        hero
        lineup={lineup}
        services
      />
    </main>
  );
}
