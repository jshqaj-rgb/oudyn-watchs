type Env = {
  API_ORIGIN?: string;
};

type Context = {
  request: Request;
  params: Record<string, string | string[]>;
  env: Env;
};

export async function onRequest(context: Context): Promise<Response> {
  const origin = context.env.API_ORIGIN?.replace(/\/$/, "");
  if (!origin) {
    return json({ error: "API_ORIGIN is not configured for this Pages project." }, 503);
  }

  const url = new URL(context.request.url);
  const path = Array.isArray(context.params.path)
    ? context.params.path.join("/")
    : context.params.path ?? "";
  const target = new URL(`/api/${path}`, origin);
  target.search = url.search;

  const headers = new Headers();
  const contentType = context.request.headers.get("content-type");
  const accept = context.request.headers.get("accept");
  const authorization = context.request.headers.get("authorization");
  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);
  if (authorization) headers.set("authorization", authorization);

  try {
    const upstream = await fetch(target, {
      method: context.request.method,
      headers,
      body:
        context.request.method === "GET" || context.request.method === "HEAD"
          ? undefined
          : context.request.body,
      redirect: "manual",
    });

    const responseHeaders = new Headers();
    const upstreamType = upstream.headers.get("content-type");
    const cacheControl = upstream.headers.get("cache-control");
    if (upstreamType) responseHeaders.set("content-type", upstreamType);
    if (cacheControl) responseHeaders.set("cache-control", cacheControl);
    responseHeaders.set("x-oudyn-proxy", "pages");

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return json({ error: "The catalog service is unreachable." }, 502);
  }
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
