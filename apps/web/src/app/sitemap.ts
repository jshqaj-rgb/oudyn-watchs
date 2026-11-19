import type { MetadataRoute } from "next";
import { getCollections, getProducts, getStories } from "@/lib/api";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.oudyn.com").replace(/\/$/, "");
  const [products, collections, stories] = await Promise.all([
    getProducts({ limit: 48 }),
    getCollections(),
    getStories(),
  ]);

  const staticRoutes = [
    "",
    "/watches",
    "/collections",
    "/stories",
    "/about",
    "/sell",
    "/contact",
    "/authentication",
    "/shipping",
    "/faq",
    "/privacy",
    "/terms",
    "/archive",
  ].map((path) => ({
    url: `${base}${path}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  return [
    ...staticRoutes,
    ...products.items.map((product) => ({
      url: `${base}/watches/${product.slug}/`,
      lastModified: new Date(product.releasedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...collections.map((collection) => ({
      url: `${base}/collections/${collection.handle}/`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...stories.map((story) => ({
      url: `${base}/stories/${story.slug}/`,
      lastModified: new Date(story.purchasedAt),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
