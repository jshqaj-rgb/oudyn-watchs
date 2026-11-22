import type {
  CollectionHandle,
  Product,
  ProductAddOn,
  SpecGroup,
} from "../../../packages/contracts/index.ts";

const DEFAULT_API = "https://emd.aaaaaaaa.bid/_emdash/api/content/products";
const DEFAULT_ASSET_BASE = "https://emd.aaaaaaaa.bid";
const COLLECTIONS: CollectionHandle[] = [
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

let cache: { at: number; items: Product[] } | null = null;
const CACHE_MS = 60_000;

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
    url = `${(process.env.EMDASH_ASSET_BASE ?? DEFAULT_ASSET_BASE).replace(/\/$/, "")}${url}`;
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
  return [`/images/rolex/${pool[shift]}.jpg`];
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
  if (COLLECTIONS.includes(handle)) return { collection: handle, collectionLabel: undefined };
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
  const useSourceImages = process.env.EMDASH_USE_SOURCE_IMAGES === "1";
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
    isNew: bool(data.is_new),
    featured: bool(data.featured),
    soldOut: stock <= 0,
    releasedAt: year ? `${year}-01-01T00:00:00.000Z` : updated || new Date(0).toISOString(),
  };
}

async function fetchPage(page: number): Promise<EmdashEntry[]> {
  const token = process.env.EMDASH_READ_TOKEN;
  if (!token) {
    throw new Error("EMDASH_READ_TOKEN is not configured on the API server.");
  }

  const endpoint = process.env.EMDASH_API_URL ?? DEFAULT_API;
  const url = new URL(endpoint);
  url.searchParams.set("limit", "100");
  url.searchParams.set("page", String(page));

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EmDash-Request": "1",
      Accept: "application/json",
    },
    cache: "no-store",
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

  const merchant = process.env.EMDASH_MERCHANT_ID ?? "mch_oudyn";
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
