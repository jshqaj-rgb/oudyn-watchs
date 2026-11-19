import type {
  ArchiveItem,
  CollectionWithCount,
  Product,
  ProductListResponse,
  Story,
} from "@oudyn/contracts";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:4000";
const BUILD_TIME = process.env.STATIC_EXPORT === "1";
const BUILD_TAG = BUILD_TIME ? `build-${Date.now()}` : "";

async function getJson<T>(path: string): Promise<T> {
  const url = `${API_URL}${path}${BUILD_TAG ? `${path.includes("?") ? "&" : "?"}__build=${BUILD_TAG}` : ""}`;
  const response = await fetch(url, {
    cache: BUILD_TIME ? "force-cache" : "no-store",
  });
  if (!response.ok) {
    throw new Error(`Catalog request failed: ${response.status} ${path}`);
  }
  return (await response.json()) as T;
}

export type ProductQuery = {
  collection?: string;
  category?: string;
  tag?: string;
  search?: string;
  sort?: string;
  limit?: number;
  cursor?: number;
};

export function productQueryString(query: ProductQuery): string {
  const params = new URLSearchParams();
  if (query.collection) params.set("collection", query.collection);
  if (query.category && query.category !== "all") params.set("category", query.category);
  if (query.tag) params.set("tag", query.tag);
  if (query.search) params.set("search", query.search);
  if (query.sort) params.set("sort", query.sort);
  if (query.limit) params.set("limit", String(query.limit));
  if (query.cursor) params.set("cursor", String(query.cursor));
  const value = params.toString();
  return value ? `?${value}` : "";
}

export function getProducts(query: ProductQuery = {}): Promise<ProductListResponse> {
  return getJson<ProductListResponse>(`/api/products${productQueryString(query)}`);
}

export function getProduct(slug: string): Promise<Product> {
  return getJson<Product>(`/api/products/${encodeURIComponent(slug)}`);
}

export function getCollections(): Promise<CollectionWithCount[]> {
  return getJson<CollectionWithCount[]>("/api/collections");
}

export function getCollection(handle: string): Promise<
  CollectionWithCount & { items: Product[] }
> {
  return getJson<CollectionWithCount & { items: Product[] }>(
    `/api/collections/${encodeURIComponent(handle)}`,
  );
}

export function getArchive(): Promise<ArchiveItem[]> {
  return getJson<ArchiveItem[]>("/api/archive");
}

export function getStories(): Promise<Story[]> {
  return getJson<Story[]>("/api/stories");
}

export function getStory(slug: string): Promise<Story> {
  return getJson<Story>(`/api/stories/${encodeURIComponent(slug)}`);
}

export function formatPrice(price: number): string {
  return `¥ ${price.toLocaleString("zh-CN")}`;
}
