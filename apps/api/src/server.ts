import cors from "cors";
import express, { type Request, type Response } from "express";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  ArchiveItem,
  Collection,
  ContactRequest,
  OrderLineInput,
  OrderRequest,
  Product,
  Story,
} from "../../../packages/contracts/index.ts";
import { findProduct, getInventory, getPublishedProducts } from "./emdash";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, "..", "data");
const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "127.0.0.1";

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(join(dataDir, file), "utf8")) as T;
}

const [collections, stories] = await Promise.all([
  readJson<Collection[]>("collections.json"),
  readJson<Story[]>("stories.json"),
]);

const app = express();
app.disable("x-powered-by");
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
  }),
);
app.use(express.json({ limit: "16kb" }));

function unavailable(res: Response, error: unknown) {
  console.error("[catalog]", error instanceof Error ? error.message : error);
  res.status(502).json({ error: "The catalog service is unavailable." });
}

function listProducts(
  products: Product[],
  url: URL,
): { items: Product[]; total: number; nextCursor: string | null } {
  const collection = url.searchParams.get("collection");
  const category = url.searchParams.get("category");
  const tag = url.searchParams.get("tag");
  const search = url.searchParams.get("search")?.trim().toLowerCase();
  const sort = url.searchParams.get("sort") ?? "featured";
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 24) || 24, 1), 48);
  const cursor = Math.max(Number(url.searchParams.get("cursor") ?? 0) || 0, 0);

  let items = products.filter((product) => !product.soldOut);
  if (collection) items = items.filter((product) => product.collection === collection);
  if (category && category !== "all") {
    items = items.filter((product) => product.category === category);
  }
  if (tag) {
    const wanted = tag.split(",").map((value) => value.trim().toUpperCase());
    items = items.filter((product) => wanted.every((value) => product.tags.includes(value)));
  }
  if (search) {
    items = items.filter((product) =>
      [
        product.name,
        product.ref,
        product.shortDescription,
        product.specLabel,
        product.collectionLabel,
        product.condition,
        ...product.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }

  items = [...items].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "newest") return b.releasedAt.localeCompare(a.releasedAt);
    return Number(b.featured ?? false) - Number(a.featured ?? false) || a.price - b.price;
  });

  const total = items.length;
  const page = items.slice(cursor, cursor + limit);
  return { items: page, total, nextCursor: cursor + limit < total ? String(cursor + limit) : null };
}

function facets(products: Product[]) {
  const tags = new Map<string, number>();
  products
    .filter((product) => !product.soldOut)
    .forEach((product) => {
      product.tags.forEach((tag) => tags.set(tag, (tags.get(tag) ?? 0) + 1));
    });

  return {
    collections: collections.map((collection) => ({
      handle: collection.handle,
      title: collection.title,
      count: products.filter(
        (product) => product.collection === collection.handle && !product.soldOut,
      ).length,
    })),
    tags: Array.from(tags.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value)),
  };
}

app.get("/api/health", async (_req: Request, res: Response) => {
  try {
    const [inventory, published] = await Promise.all([getInventory(), getPublishedProducts()]);
    res.json({
      status: "ok",
      products: published.length,
      archive: inventory.filter((product) => product.soldOut).length,
      stories: stories.length,
      source: "emdash",
    });
  } catch (error) {
    unavailable(res, error);
  }
});

app.get("/api/zven-products", async (_req: Request, res: Response) => {
  try {
    const items = (await getInventory()).map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.sourceImage ?? product.images[0] ?? "",
    }));
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.json(items);
  } catch (error) {
    unavailable(res, error);
  }
});

app.get("/api/stories", (_req: Request, res: Response) => {
  res.set("Cache-Control", "no-store");
  res.json(stories);
});

app.get("/api/stories/:slug", (req: Request, res: Response) => {
  const story = stories.find((item) => item.slug === req.params.slug);
  if (!story) {
    res.status(404).json({ error: "Story not found" });
    return;
  }
  res.set("Cache-Control", "no-store");
  res.json(story);
});

app.post("/api/contact", async (req: Request, res: Response) => {
  const body = req.body as Partial<ContactRequest>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "General enquiry";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const reference = typeof body.reference === "string" ? body.reference.trim() : "";

  if (!name || name.length > 120) {
    res.status(400).json({ error: "Enter your name." });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Enter a valid email address." });
    return;
  }
  if (message.length < 10 || message.length > 4000) {
    res.status(400).json({ error: "Write a message between 10 and 4000 characters." });
    return;
  }

  const file = join(dataDir, "contacts.json");
  let messages: unknown[] = [];
  try {
    messages = JSON.parse(await readFile(file, "utf8"));
  } catch {
    messages = [];
  }
  const id = `MSG-${Date.now().toString(36).toUpperCase()}`;
  messages.push({ id, createdAt: new Date().toISOString(), name, email, subject, reference, message });
  await writeFile(file, `${JSON.stringify(messages, null, 2)}\n`);
  res.status(201).json({ ok: true, messageId: id });
});

app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const products = await getPublishedProducts();
    const url = new URL(req.originalUrl, "http://localhost");
    res.set("Cache-Control", "no-store");
    res.json({ ...listProducts(products, url), facets: facets(products) });
  } catch (error) {
    unavailable(res, error);
  }
});

app.get("/api/products/:slug", async (req: Request, res: Response) => {
  try {
    const product = await findProduct(String(req.params.slug));
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.set("Cache-Control", "no-store");
    res.json(product);
  } catch (error) {
    unavailable(res, error);
  }
});

app.get("/api/collections", async (_req: Request, res: Response) => {
  try {
    const products = await getPublishedProducts();
    res.set("Cache-Control", "no-store");
    res.json(
      collections.map((collection) => ({
        ...collection,
        count: products.filter((product) => product.collection === collection.handle).length,
      })),
    );
  } catch (error) {
    unavailable(res, error);
  }
});

app.get("/api/collections/:handle", async (req: Request, res: Response) => {
  const collection = collections.find((item) => item.handle === req.params.handle);
  if (!collection) {
    res.status(404).json({ error: "Collection not found" });
    return;
  }
  try {
    const products = await getPublishedProducts();
    const items = products.filter((product) => product.collection === collection.handle);
    res.set("Cache-Control", "no-store");
    res.json({ ...collection, count: items.length, items });
  } catch (error) {
    unavailable(res, error);
  }
});

app.get("/api/archive", async (_req: Request, res: Response) => {
  try {
    const items = (await getInventory())
      .filter((product) => product.soldOut)
      .map(
        (product): ArchiveItem => ({
          ...product,
          archiveLabel: "SOLD OUT",
          archiveYear: product.year > 0 ? String(product.year) : product.releasedAt.slice(0, 4),
        }),
      );
    res.set("Cache-Control", "no-store");
    res.json(items);
  } catch (error) {
    unavailable(res, error);
  }
});

app.post("/api/orders", async (req: Request, res: Response) => {
  const body = req.body as Partial<OrderRequest>;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const postalCode = typeof body.postalCode === "string" ? body.postalCode.trim() : "";
  const country = typeof body.country === "string" ? body.country.trim() : "";
  const requested = Array.isArray(body.lines) ? body.lines : [];

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Enter a valid email address." });
    return;
  }
  if (!name || !address || !city || !postalCode || !country) {
    res.status(400).json({ error: "Complete the delivery address." });
    return;
  }
  if (requested.length === 0) {
    res.status(400).json({ error: "The bag is empty." });
    return;
  }

  try {
    const inventory = await getInventory();
    const lines: {
      slug: string;
      name: string;
      ref: string;
      addOnId: string | null;
      quantity: number;
      unitPrice: number;
    }[] = [];

    for (const line of requested as OrderLineInput[]) {
      const product = inventory.find((item) => item.slug === line.slug);
      if (!product) {
        res.status(400).json({ error: `Unknown reference: ${line.slug}` });
        return;
      }
      if (product.soldOut) {
        res.status(400).json({ error: `${product.name} is no longer available.` });
        return;
      }
      const addOn = product.addOns.find((item) => item.id === line.addOnId);
      if (line.addOnId && !addOn) {
        res.status(400).json({ error: `Unknown add-on for ${product.name}.` });
        return;
      }
      const quantity = Math.min(Math.max(Number(line.quantity) || 1, 1), 9);
      lines.push({
        slug: product.slug,
        name: product.name,
        ref: product.ref,
        addOnId: addOn?.id ?? null,
        quantity,
        unitPrice: product.price + (addOn?.priceDelta ?? 0),
      });
    }

    const total = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    const orderId = `ODN-${Date.now().toString(36).toUpperCase()}`;
    const file = join(dataDir, "orders.json");
    let orders: unknown[] = [];
    try {
      orders = JSON.parse(await readFile(file, "utf8"));
    } catch {
      orders = [];
    }
    orders.push({
      id: orderId,
      createdAt: new Date().toISOString(),
      status: "pending-confirmation",
      customer: { email, name, address, city, postalCode, country },
      lines,
      total,
      currency: "CNY",
    });
    await writeFile(file, `${JSON.stringify(orders, null, 2)}\n`);
    res.status(201).json({ ok: true, orderId, total, email });
  } catch (error) {
    unavailable(res, error);
  }
});

app.post("/api/newsletter", async (req: Request, res: Response) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Enter a valid email address." });
    return;
  }

  const file = join(dataDir, "newsletter.json");
  let subscribers: { email: string; createdAt: string }[] = [];
  try {
    subscribers = JSON.parse(await readFile(file, "utf8"));
  } catch {
    subscribers = [];
  }

  if (!subscribers.some((entry) => entry.email === email)) {
    subscribers.push({ email, createdAt: new Date().toISOString() });
    await writeFile(file, `${JSON.stringify(subscribers, null, 2)}\n`);
  }

  res.status(201).json({ ok: true });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.use((error: Error, _req: Request, res: Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong." });
});

app.listen(port, host, () => {
  console.log(`OUDYN catalog API listening on http://${host}:${port}`);
});
