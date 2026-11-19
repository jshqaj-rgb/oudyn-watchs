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
          intro="OUDYN is organised by use, not by season. Each family shares a case architecture and a dial logic; the differences are the ones that change how a watch reads on the wrist."
          meta={
            <>
              <span>{collections.length} families</span>
              <span>{total} references</span>
              <span>Milano</span>
            </>
          }
        />
        <CollectionIndex collections={collections} products={catalog.items} />
      </div>
    </main>
  );
}
