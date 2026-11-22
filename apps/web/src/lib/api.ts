import {
  collectionsWithCount,
  configureCatalog,
  facetsFor,
  findProduct,
  getInventory,
  getPublishedProducts,
  listProducts,
  collectionCatalog,
} from "@oudyn/catalog";
import type {
  ArchiveItem,
  CollectionWithCount,
  Product,
  ProductListResponse,
} from "@oudyn/contracts";

configureCatalog({
  token: process.env.EMDASH_READ_TOKEN,
  merchantId: process.env.EMDASH_MERCHANT_ID,
  apiUrl: process.env.EMDASH_API_URL,
  assetBase: process.env.EMDASH_ASSET_BASE,
  useSourceImages: process.env.EMDASH_USE_SOURCE_IMAGES === "1",
});

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

export async function getProducts(query: ProductQuery = {}): Promise<ProductListResponse> {
  const products = await getPublishedProducts();
  const url = new URL(`https://oudyn.local/api/products${productQueryString(query)}`);
  const page = listProducts(products, url);
  return { ...page, facets: facetsFor(products) };
}

export async function getProduct(slug: string): Promise<Product> {
  const product = await findProduct(slug);
  if (!product) throw new Error(`Product not found: ${slug}`);
  return product;
}

export async function getCollections(): Promise<CollectionWithCount[]> {
  return collectionsWithCount(await getInventory()) as CollectionWithCount[];
}

export async function getCollection(
  handle: string,
): Promise<CollectionWithCount & { items: Product[] }> {
  const products = await getInventory();
  const collection = collectionsWithCount(products).find((item) => item.handle === handle);
  if (!collection) throw new Error(`Collection not found: ${handle}`);
  return {
    ...collection,
    items: products.filter((product) => product.collection === handle && !product.soldOut),
  } as CollectionWithCount & { items: Product[] };
}

export async function getArchive(): Promise<ArchiveItem[]> {
  return (await getInventory())
    .filter((product) => product.soldOut)
    .map((product) => ({
      ...product,
      archiveLabel: "SOLD OUT" as const,
      archiveYear: product.year ? String(product.year) : "ARCHIVE",
    }));
}


export { collectionCatalog, getInventory };
export function formatPrice(price: number): string {
  return `CNY ${price.toLocaleString("en-US")}`;
}
