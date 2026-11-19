import { configureCatalog, getInventory } from "../../packages/catalog/index.ts";

type Env = {
  EMDASH_READ_TOKEN?: string;
  EMDASH_MERCHANT_ID?: string;
  EMDASH_API_URL?: string;
  EMDASH_ASSET_BASE?: string;
  EMDASH_USE_SOURCE_IMAGES?: string;
};

export const onRequest: PagesFunction<Env> = async ({ env }) => {
  configureCatalog({
    token: env.EMDASH_READ_TOKEN,
    merchantId: env.EMDASH_MERCHANT_ID,
    apiUrl: env.EMDASH_API_URL,
    assetBase: env.EMDASH_ASSET_BASE,
    useSourceImages: env.EMDASH_USE_SOURCE_IMAGES === "1",
  });

  try {
    const products = await getInventory();
    return new Response(
      JSON.stringify(
        products.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          image: product.sourceImage ?? product.images[0] ?? "",
        })),
      ),
      { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } },
    );
  } catch {
    return new Response(JSON.stringify({ error: "Catalog service unavailable." }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }
};
