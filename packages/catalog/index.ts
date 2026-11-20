import type {
  CollectionHandle,
  Product,
  ProductAddOn,
  SpecGroup,
} from "../contracts/index.ts";

const DEFAULT_API = "https://emd.aaaaaaaa.bid/_emdash/api/content/products";
const DEFAULT_GATEWAY = "https://shop-edge.jshqaj.workers.dev/v1/products";
const DEFAULT_SITE_ORIGIN = "https://oudyn.com";
const DEFAULT_ASSET_BASE = "https://emd.aaaaaaaa.bid";
const COLLECTION_HANDLES: CollectionHandle[] = [
  "classic",
  "toolwatches",
  "collaborations",
  "limited-edition",
  "accessories",
];

type EmdashEntry = {
  id?: unknown;
  data?: Record<string, unknown>;
};

export type CatalogConfig = {
  token?: string;
  /** 网关站点 key（sk_live_...）；配置后走独立网关，不再直连 EmDash */
  siteKey?: string;
  /** 服务端调用时代替 Origin 头 */
  siteOrigin?: string;
  merchantId?: string;
  apiUrl?: string;
  assetBase?: string;
  useSourceImages?: boolean;
};

const nodeEnv: Record<string, string | undefined> =
  typeof process !== "undefined" ? process.env : {};
let config: CatalogConfig = {
  token: nodeEnv.EMDASH_READ_TOKEN,
  siteKey: nodeEnv.SHOP_EDGE_SITE_KEY,
  siteOrigin: nodeEnv.SHOP_EDGE_SITE_ORIGIN,
  merchantId: nodeEnv.EMDASH_MERCHANT_ID,
  apiUrl: nodeEnv.EMDASH_API_URL,
  assetBase: nodeEnv.EMDASH_ASSET_BASE,
  useSourceImages: nodeEnv.EMDASH_USE_SOURCE_IMAGES === "1",
};
let cache: { at: number; items: Product[] } | null = null;
const CACHE_MS = 60_000;

export function configureCatalog(next: CatalogConfig) {
  config = { ...config, ...next };
  cache = null;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function number(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function bool(value: unknown): boolean {
  return value === true || value === "true" || value === 1;
}

function strings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => text(item)).filter(Boolean);
}

function stripHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function paragraphs(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap((item) => paragraphs(item));
  const raw = text(value);
  if (!raw) return [];
  return stripHtml(raw)
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function imageUrl(value: unknown): string {
  let url = text(value);
  if (!url) return "";
  if (url.startsWith("//")) url = `https:${url}`;
  else if (url.startsWith("http://")) url = url.replace(/^http:\/\//, "https://");
  if (url.startsWith("/")) {
    url = `${(config.assetBase ?? DEFAULT_ASSET_BASE).replace(/\/$/, "")}${url}`;
  }
  return url;
}

function imageList(data: Record<string, unknown>): string[] {
  const raw = data.images ?? data.gallery ?? data.photos;
  const list: string[] = [];
  if (Array.isArray(raw)) {
    raw.forEach((item) => {
      if (typeof item === "string") list.push(imageUrl(item));
      else if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        list.push(imageUrl(record.url ?? record.src ?? record.image));
      }
    });
  }
  const cover = imageUrl(data.cover_image ?? data.image ?? data.cover);
  return Array.from(new Set([cover, ...list].filter(Boolean)));
}

function specRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const valueText = text(raw) || (typeof raw === "number" ? String(raw) : "");
    if (valueText) out[key.trim().toLowerCase()] = valueText;
  }
  return out;
}

function groupsFromRecord(record: Record<string, string>): SpecGroup[] {
  const groups: SpecGroup[] = [];
  const add = (title: string, items: Array<string | undefined>) => {
    const clean = items.map((item) => text(item)).filter(Boolean);
    if (clean.length) groups.push({ title, items: clean });
  };
  const reference = [record.brand, record.model].filter(Boolean).join(" ");
  add("REFERENCE", [reference || record.brand, record.reference ? `Reference ${record.reference}` : ""]);
  add("CASE", [record.casesize ? `Case ${record.casesize}` : "", record.material]);
  add("MOVEMENT", [record.movement]);
  add("DIAL", [record.dial]);
  add("BRACELET", [record.bracelet]);
  add("CONDITION & SET", [
    record.condition,
    record.year ? `Year ${record.year}` : "",
    record.accessories ? `Set ${record.accessories}` : "",
    record.warranty,
  ]);
  const known = new Set(["brand","model","reference","casesize","material","movement","dial","bracelet","condition","year","accessories","warranty"]);
  add("DETAILS", Object.entries(record).filter(([key]) => !known.has(key)).map(([key, val]) => `${key}: ${val}`));
  return groups;
}

function specGroups(value: unknown): SpecGroup[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const record = item as Record<string, unknown>;
        const title = text(record.title ?? record.name ?? record.label);
        const items = strings(record.items ?? record.values ?? record.value);
        return title && items.length ? { title, items } : null;
      })
      .filter((item): item is SpecGroup => Boolean(item));
  }
  if (typeof value === "object") {
    return groupsFromRecord(specRecord(value));
  }
  return [];
}

function addOns(value: unknown): ProductAddOn[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const id = text(record.id ?? record.sku);
      const label = text(record.label ?? record.name);
      const delta = number(record.price_delta ?? record.price ?? record.delta) ?? 0;
      return id && label ? { id, label, priceDelta: delta } : null;
    })
    .filter((item): item is ProductAddOn => Boolean(item));
}

function localWatchImages(id: string, data: Record<string, unknown>, record: Record<string, string>): string[] {
  const model = `${record.model ?? ""} ${record.reference ?? ""} ${text(data.name)}`.toLowerCase();
  const pool = /daytona/.test(model)
    ? ["rolex-dark", "rolex-wrist", "rolex-box", "rolex-white"]
    : /(submariner|sea-dweller|deepsea)/.test(model)
      ? ["rolex-white", "rolex-wrist", "rolex-dark", "rolex-box"]
      : /(gmt|explorer|air-king|milgauss|yacht-master)/.test(model)
        ? ["rolex-wrist", "rolex-dark", "rolex-white", "rolex-box"]
        : ["rolex-box", "rolex-white", "rolex-wrist", "rolex-dark"];
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  const shift = hash % pool.length;
  return [...pool.slice(shift), ...pool.slice(0, shift)].map((name) => `/images/rolex/${name}.jpg`);
}

function isPlaceholderHost(url: string): boolean {
  return /^https:\/\/images\.pexels\.com\//i.test(url);
}

function collectionOf(
  data: Record<string, unknown>,
  category: "watches" | "accessories",
): { collection: CollectionHandle; collectionLabel?: string } {
  const raw = text(data.collection ?? data.collection_handle ?? data.family);
  const handle = raw.toLowerCase().replace(/\s+/g, "-") as CollectionHandle;
  if (COLLECTION_HANDLES.includes(handle)) return { collection: handle, collectionLabel: undefined };
  const record = specRecord(data.specs ?? data.specifications);
  const model = `${record.model ?? ""} ${record.reference ?? ""} ${text(data.name)}`.toLowerCase();
  if (/(daytona|chronograph)/.test(model)) return { collection: "limited-edition", collectionLabel: "Pre-owned" };
  if (/(submariner|sea-dweller|deepsea|gmt|explorer|air-king|milgauss|yacht-master|diver)/.test(model)) {
    return { collection: "toolwatches", collectionLabel: "Pre-owned" };
  }
  const label = raw ? raw.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : undefined;
  return {
    collection: category === "accessories" ? "accessories" : "classic",
    collectionLabel: label ?? "Pre-owned",
  };
}

function toProduct(entry: EmdashEntry): Product | null {
  const data = entry.data ?? {};
  const id = text(entry.id ?? data.id);
  if (!id) return null;

  const category = text(data.category).toLowerCase() === "accessories" ? "accessories" : "watches";
  const name = text(data.name) || text(data.title) || "Untitled reference";
  const price = number(data.price) ?? 0;
  const stock = Math.max(number(data.stock) ?? 0, 0);
  const description = paragraphs(data.description ?? data.long_description ?? data.body);
  const sourceImages = imageList(data);
  const record = specRecord(data.specs ?? data.specifications ?? data.attributes);
  const useSourceImages = Boolean(config.useSourceImages);
  const images = useSourceImages || !sourceImages.every(isPlaceholderHost)
    ? sourceImages
    : localWatchImages(id, data, record);
  const specs = specGroups(data.specs ?? data.specifications ?? data.attributes);
  const includedRaw = data.included ?? data.whats_included ?? data.set_contents;
  const included = strings(includedRaw).length
    ? strings(includedRaw)
    : [record.accessories ? `Set: ${record.accessories}` : ""].filter(Boolean);
  const rawTags = strings(data.tags).map((tag) => tag.toUpperCase());
  const tags = Array.from(new Set(["PRE-OWNED", ...rawTags]));
  const { collection, collectionLabel } = collectionOf(data, category);
  const edition = number(data.edition);
  const year = number(data.year) ?? number(record.year) ?? 0;
  const condition = text(data.condition) || record.condition || "";
  const setLabel = text(data.set_label ?? data.set) || record.accessories || "";
  const ref = text(data.reference ?? data.ref) || record.reference || text(data.sku) || id.toUpperCase();
  const caseSize = text(data.case_size) || record.casesize || "";
  const movement = text(data.movement) || record.movement || "";
  const movementLabel = /automatic|自动/i.test(movement) ? "AUTOMATIC" : /quartz|石英/i.test(movement) ? "QUARTZ" : "";
  const specLabel = text(data.spec_label ?? data.spec) || [caseSize.toUpperCase(), movementLabel].filter(Boolean).join(" ");
  const updated = text(data.updated_at ?? data.published_at ?? data.created_at);

  return {
    id,
    slug: text(data.slug) || id,
    ref,
    name,
    subtitle: text(data.subtitle ?? data.sub_name) || record.model || "",
    price,
    stock,
    currency: text(data.currency).toUpperCase() || "CNY",
    edition: edition ?? null,
    editionLabel:
      text(data.edition_label) ||
      (stock > 0 ? `${stock} in stock` : "Sold out"),
    collection,
    collectionLabel,
    category,
    tags,
    specLabel,
    condition,
    year,
    setLabel,
    shortDescription: text(data.short_description) || description[0] || "",
    description,
    specs,
    views: [],
    images,
    sourceImage: sourceImages[0],
    addOns: addOns(data.add_ons ?? data.addons),
    included,
    isNew: bool(data.is_new) || true,
    featured: bool(data.featured),
    soldOut: stock <= 0,
    releasedAt: year ? `${year}-01-01T00:00:00.000Z` : updated || new Date(0).toISOString(),
  };
}

type GatewayProduct = {
  id?: unknown;
  slug?: unknown;
  sku?: unknown;
  name?: unknown;
  category?: unknown;
  price?: unknown;
  stock?: unknown;
  description?: unknown;
  specs?: unknown;
  images?: unknown;
  coverImage?: unknown;
  merchantId?: unknown;
};

/** 网关精简商品 → catalog 原有的 EmdashEntry 形状，复用既有映射逻辑 */
function fromGateway(item: GatewayProduct): EmdashEntry {
  const specs =
    item.specs && typeof item.specs === "object" && !Array.isArray(item.specs)
      ? (item.specs as Record<string, unknown>)
      : {};
  return {
    id: text(item.id),
    data: {
      ...specs,
      name: item.name,
      slug: item.slug,
      sku: item.sku,
      category: item.category,
      price: item.price,
      stock: item.stock,
      description: item.description,
      specs,
      images: Array.isArray(item.images) ? item.images : [],
      cover_image: item.coverImage,
      merchant_id: item.merchantId,
    },
  };
}

async function fetchFromGateway(page: number): Promise<EmdashEntry[]> {
  const url = new URL(config.apiUrl ?? DEFAULT_GATEWAY);
  url.searchParams.set("limit", "100");
  url.searchParams.set("page", String(page));
  const staticBuild = typeof process !== "undefined" && process.env.STATIC_EXPORT === "1";
  if (staticBuild) url.searchParams.set("__build", process.env.BUILD_ID ?? "static");

  const response = await fetch(url, {
    headers: {
      "X-Site-Key": config.siteKey as string,
      "X-Site-Origin": config.siteOrigin ?? DEFAULT_SITE_ORIGIN,
      Accept: "application/json",
    },
    cache: staticBuild ? "force-cache" : "no-store",
  });

  if (!response.ok) {
    throw new Error(`Shop edge returned ${response.status} for products page ${page}.`);
  }

  const payload = (await response.json()) as {
    data?: { items?: GatewayProduct[] };
  };
  const items = Array.isArray(payload.data?.items) ? payload.data?.items : [];
  return items.map(fromGateway);
}

async function fetchPage(page: number): Promise<EmdashEntry[]> {
  if (config.siteKey) return fetchFromGateway(page);

  const token = config.token;
  if (!token) {
    throw new Error("EMDASH_READ_TOKEN is not configured on the API server.");
  }

  const endpoint = config.apiUrl ?? DEFAULT_API;
  const url = new URL(endpoint);
  url.searchParams.set("limit", "100");
  url.searchParams.set("page", String(page));
  const staticBuild = typeof process !== "undefined" && process.env.STATIC_EXPORT === "1";
  if (staticBuild) url.searchParams.set("__build", process.env.BUILD_ID ?? "static");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EmDash-Request": "1",
      Accept: "application/json",
    },
    cache: staticBuild ? "force-cache" : "no-store",
  });

  if (!response.ok) {
    throw new Error(`EmDash returned ${response.status} for products page ${page}.`);
  }

  const payload = (await response.json()) as {
    data?: { items?: EmdashEntry[] } | EmdashEntry[];
  };
  const data = payload.data;
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.items) ? data.items : [];
}

export async function getInventory(): Promise<Product[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.items;

  const merchant = config.merchantId ?? "mch_oudyn";
  const entries: EmdashEntry[] = [];
  for (let page = 1; page <= 10; page += 1) {
    const batch = await fetchPage(page);
    entries.push(...batch);
    if (batch.length < 100) break;
  }

  const items = entries
    .filter((entry) => text(entry.data?.merchant_id) === merchant)
    .map(toProduct)
    .filter((product): product is Product => Boolean(product))
    .sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));

  cache = { at: Date.now(), items };
  return items;
}

export async function getPublishedProducts(): Promise<Product[]> {
  return (await getInventory()).filter((product) => !product.soldOut);
}

export async function findProduct(slug: string): Promise<Product | null> {
  return (await getInventory()).find((product) => product.slug === slug) ?? null;
}

export function clearCatalogCache() {
  cache = null;
}


import collectionData from "./data/collections.json";
import storyData from "./data/stories.json";

export const collectionCatalog = collectionData;
export const storyCatalog = storyData;


export function listProducts(products: Product[], url: URL) {
  const collection = url.searchParams.get("collection");
  const category = url.searchParams.get("category");
  const tag = url.searchParams.get("tag");
  const search = url.searchParams.get("search")?.trim().toLowerCase();
  const sort = url.searchParams.get("sort") ?? "featured";
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 24) || 24, 1), 48);
  const cursor = Math.max(Number(url.searchParams.get("cursor") ?? 0) || 0, 0);

  let items = products.filter((product) => !product.soldOut);
  if (collection) items = items.filter((product) => product.collection === collection);
  if (category && category !== "all") items = items.filter((product) => product.category === category);
  if (tag) {
    const wanted = tag.split(",").map((value) => value.trim().toUpperCase());
    items = items.filter((product) => wanted.every((value) => product.tags.includes(value)));
  }
  if (search) {
    items = items.filter((product) =>
      [product.name, product.ref, product.shortDescription, product.specLabel, product.collectionLabel, product.condition, ...product.tags]
        .filter(Boolean).join(" ").toLowerCase().includes(search),
    );
  }
  items = [...items].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "newest") return b.releasedAt.localeCompare(a.releasedAt);
    return Number(b.featured ?? false) - Number(a.featured ?? false) || a.price - b.price;
  });
  const total = items.length;
  return {
    items: items.slice(cursor, cursor + limit),
    total,
    nextCursor: cursor + limit < total ? String(cursor + limit) : null,
  };
}

export function facetsFor(products: Product[]) {
  const tags = new Map<string, number>();
  products.filter((product) => !product.soldOut).forEach((product) => {
    product.tags.forEach((tag) => tags.set(tag, (tags.get(tag) ?? 0) + 1));
  });
  return {
    collections: collectionData.map((collection) => ({
      handle: collection.handle as CollectionHandle,
      title: collection.title,
      count: products.filter((product) => product.collection === collection.handle && !product.soldOut).length,
    })),
    tags: Array.from(tags.entries()).map(([value, count]) => ({ value, count })).sort((a, b) => a.value.localeCompare(b.value)),
  };
}

export function collectionsWithCount(products: Product[]) {
  return collectionData.map((collection) => ({
    ...collection,
    count: products.filter((product) => product.collection === collection.handle && !product.soldOut).length,
  }));
}
