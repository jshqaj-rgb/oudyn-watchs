import type { Metadata } from "next";
import { CollectionIndex } from "@/components/collection/CollectionIndex";
import { PageHeader } from "@/components/layout/PageHeader";
import { getCollections, getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Collections",
  description: "Four families, one drawing standard. The OUDYN collection index.",
};

export default async function CollectionsPage() {
  const [collections, catalog] = await Promise.all([
    getCollections(),
    getProducts({ limit: 48 }),
  ]);

  const total = collections.reduce((sum, collection) => sum + collection.count, 0);

  return (
    <main id="main" className="pageMain">
      <div className="container">
        <PageHeader
          title="Collections"
          intro="The catalogue is grouped by type to make browsing easier. These are browsing groups, not manufacturer collections."
          meta={
            <>
              <span>{collections.length} families</span>
              <span>{total} references</span>
              <span>Hong Kong &amp; Guangzhou</span>
            </>
          }
        />
        <CollectionIndex collections={collections} products={catalog.items} />
      </div>
    </main>
  );
}
