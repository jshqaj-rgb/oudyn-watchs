import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogBrowser } from "@/components/product/CatalogBrowser";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatPrice, getCollection, getCollections, getProducts } from "@/lib/api";

type Params = Promise<{ handle: string }>;
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { handle } = await params;
  try {
    const collection = await getCollection(handle);
    return {
      title: collection.title,
      description: collection.description,
    };
  } catch {
    return { title: "Collection" };
  }
}

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((collection) => ({ handle: collection.handle }));
}

export const dynamicParams = false;

export default async function CollectionPage({ params }: { params: Params }) {
  const { handle } = await params;

  let collection: Awaited<ReturnType<typeof getCollection>>;
  try {
    collection = await getCollection(handle);
  } catch {
    notFound();
  }

  const category = collection.handle === "accessories" ? "accessories" : "watches";
  const initial = await getProducts({
    collection: collection.handle,
    category,
    sort: "featured",
    limit: 12,
  });

  const cheapest = collection.items.reduce(
    (min, product) => (product.price < min ? product.price : min),
    Number.POSITIVE_INFINITY,
  );

  return (
    <main id="main" className="pageMain">
      <div className="container">
        <PageHeader
          title={collection.title}
          intro={collection.description}
          meta={
            <>
              <span>{String(collection.count).padStart(2, "0")} references</span>
              {Number.isFinite(cheapest) && <span>From {formatPrice(cheapest)}</span>}
              <span>Pre-owned · Hong Kong & Guangzhou</span>
            </>
          }
        />
      </div>
      <CatalogBrowser
        initial={initial}
        collection={collection.handle}
        category={category}
        title={collection.title}
        description={collection.statement}
        showHead={false}
      />
    </main>
  );
}
