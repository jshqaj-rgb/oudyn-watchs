import { getCollections, getProducts } from "@/lib/api";
import { Hero } from "@/components/home/Hero";
import { NewArrivals } from "@/components/home/NewArrivals";
import { CollectionGrid } from "@/components/home/CollectionGrid";
import { ModelDetail } from "@/components/home/ModelDetail";
import { QualityPromise } from "@/components/home/QualityPromise";

export default async function HomePage() {
  const [{ items }, collections] = await Promise.all([
    getProducts({ limit: 24, sort: "newest" }),
    getCollections(),
  ]);

  const watches = items.filter((product) => product.category === "watches");
  const newArrivals = watches.slice(0, 4);
  const references = items
    .filter((product) => product.category === "watches")
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 5);
  const tileImages: Record<string, string> = {
    classic: "/images/rolex/rolex-white.jpg",
    toolwatches: "/images/rolex/rolex-wrist.jpg",
    collaborations: "/images/rolex/rolex-dark.jpg",
    "limited-edition": "/images/rolex/rolex-dark.jpg",
  };
  const tiles = collections
    .filter((collection) => collection.handle !== "accessories" && collection.count > 0)
    .slice(0, 4)
    .map((collection) => {
      const product = items.find((item) => item.slug === collection.previewSlug) ?? items[0];
      return {
        collection,
        image: tileImages[collection.handle] ?? product?.images[0] ?? "/images/rolex/rolex-white.jpg",
      };
    });

  return (
    <>
      <Hero />
      {newArrivals.length > 0 ? <NewArrivals products={newArrivals} /> : null}
      <CollectionGrid tiles={tiles} />
      <ModelDetail products={references} />
      <QualityPromise />
    </>
  );
}
