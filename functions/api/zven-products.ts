interface Env {
  API_ORIGIN?: string;
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const origin = env.API_ORIGIN;
  if (!origin) {
    return new Response(JSON.stringify({ error: "API_ORIGIN is not configured." }), {
      status: 503,
      headers: { "content-type": "application/json" },
    });
  }

  const target = new URL("/api/zven-products", origin);
  const headers = new Headers(request.headers);
  headers.delete("host");

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    });
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch {
    return new Response(JSON.stringify({ error: "Catalog service unavailable." }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }
};
