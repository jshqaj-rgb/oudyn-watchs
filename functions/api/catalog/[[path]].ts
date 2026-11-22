import {
  collectionsWithCount,
  configureCatalog,
  facetsFor,
  findProduct,
  getInventory,
  listProducts,
  storyCatalog,
} from "../../../packages/catalog/index.ts";
import type { Product } from "../../../packages/contracts/index.ts";

type KV = {
  get(key: string, options?: { type?: "json" }): Promise<unknown>;
  put(key: string, value: string): Promise<void>;
};

type Env = {
  EMDASH_READ_TOKEN?: string;
  EMDASH_MERCHANT_ID?: string;
  EMDASH_API_URL?: string;
  EMDASH_ASSET_BASE?: string;
  EMDASH_USE_SOURCE_IMAGES?: string;
  OUDYN_KV?: KV;
};

type Context = {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function setup(env: Env) {
  configureCatalog({
    token: env.EMDASH_READ_TOKEN,
    merchantId: env.EMDASH_MERCHANT_ID,
    apiUrl: env.EMDASH_API_URL,
    assetBase: env.EMDASH_ASSET_BASE,
    useSourceImages: env.EMDASH_USE_SOURCE_IMAGES === "1",
  });
}

async function append(env: Env, key: string, record: unknown): Promise<boolean> {
  if (!env.OUDYN_KV) return false;
  const existing = (await env.OUDYN_KV.get(key, { type: "json" })) as unknown[] | null;
  const list = Array.isArray(existing) ? existing : [];
  list.push(record);
  await env.OUDYN_KV.put(key, JSON.stringify(list));
  return true;
}


export async function onRequest(context: Context): Promise<Response> {
  setup(context.env);
  const url = new URL(context.request.url);
  const segments = Array.isArray(context.params.path)
    ? context.params.path
    : String(context.params.path ?? "").split("/").filter(Boolean);
  const route = segments.join("/");

  try {
    if (context.request.method === "GET" && route === "health") {
      const products = await getInventory();
      return json({
        status: "ok",
        products: products.filter((product) => !product.soldOut).length,
        archive: products.filter((product) => product.soldOut).length,
        stories: storyCatalog.length,
        source: "emdash-functions",
      });
    }

    if (context.request.method === "GET" && route === "products") {
      const products = await getInventory();
      const page = listProducts(products, url);
      return json({ ...page, facets: facetsFor(products) });
    }

    if (context.request.method === "GET" && route.startsWith("products/")) {
      const product = await findProduct(decodeURIComponent(route.slice("products/".length)));
      return product ? json(product) : json({ error: "Product not found." }, 404);
    }

    if (context.request.method === "GET" && route === "collections") {
      return json(collectionsWithCount(await getInventory()));
    }

    if (context.request.method === "GET" && route.startsWith("collections/")) {
      const handle = decodeURIComponent(route.slice("collections/".length));
      const products = await getInventory();
      const collection = collectionsWithCount(products).find((item) => item.handle === handle);
      if (!collection) return json({ error: "Collection not found." }, 404);
      return json({
        ...collection,
        items: products.filter((product) => product.collection === handle && !product.soldOut),
      });
    }

    if (context.request.method === "GET" && route === "archive") {
      return json(
        (await getInventory())
          .filter((product) => product.soldOut)
          .map((product) => ({
            ...product,
            archiveLabel: "SOLD OUT",
            archiveYear: product.year ? String(product.year) : "ARCHIVE",
          })),
      );
    }

    if (context.request.method === "GET" && route === "stories") {
      return json(storyCatalog);
    }

    if (context.request.method === "GET" && route.startsWith("stories/")) {
      const slug = decodeURIComponent(route.slice("stories/".length));
      const story = storyCatalog.find((item) => item.slug === slug);
      return story ? json(story) : json({ error: "Story not found." }, 404);
    }

    if (context.request.method === "POST" && route === "orders") {
      return json({ error: "Online checkout is disabled. Send an availability enquiry instead." }, 410);
    }

    if (context.request.method === "POST" && route === "newsletter") {
      const body = (await context.request.json()) as { email?: string };
      if (!body?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return json({ error: "A valid email is required." }, 400);
      }
      const stored = await append(context.env, "newsletter", {
        email: body.email.toLowerCase(),
        createdAt: new Date().toISOString(),
      });
      if (!stored) return json({ error: "Newsletter storage is not configured." }, 503);
      return json({ ok: true }, 201);
    }

    if (context.request.method === "POST" && route === "contact") {
      const body = (await context.request.json()) as Record<string, string>;
      if (!body?.name || !body?.email || !body?.message) {
        return json({ error: "Name, email and message are required." }, 400);
      }
      const messageId = `MSG-${Date.now().toString(36).toUpperCase()}`;
      const stored = await append(context.env, "contacts", {
        messageId,
        ...body,
        createdAt: new Date().toISOString(),
      });
      if (!stored) return json({ error: "Contact storage is not configured." }, 503);
      return json({ ok: true, messageId }, 201);
    }

    return json({ error: "Not found." }, 404);
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "The catalog is unavailable." },
      502,
    );
  }
}
