import type {
  ContactRequest,
  ContactResponse,
  OrderRequest,
  OrderResponse,
  ProductListResponse,
} from "@oudyn/contracts";

const CLIENT_API = "/api/catalog";

export async function clientProducts(params: URLSearchParams): Promise<ProductListResponse> {
  const response = await fetch(`${CLIENT_API}/products?${params.toString()}`);
  if (!response.ok) throw new Error("Could not load products.");
  return (await response.json()) as ProductListResponse;
}

export async function clientNewsletter(email: string): Promise<{ ok: boolean; error?: string }> {
  const response = await fetch(`${CLIENT_API}/newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = (await response.json()) as { ok?: boolean; error?: string };
  if (!response.ok) return { ok: false, error: data.error ?? "Could not subscribe." };
  return { ok: true };
}

export async function clientOrder(payload: OrderRequest): Promise<OrderResponse> {
  const response = await fetch(`${CLIENT_API}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as OrderResponse & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "The order could not be placed.");
  return data;
}

export async function clientContact(payload: ContactRequest): Promise<ContactResponse> {
  const response = await fetch(`${CLIENT_API}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as ContactResponse & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "The message could not be sent.");
  return data;
}
