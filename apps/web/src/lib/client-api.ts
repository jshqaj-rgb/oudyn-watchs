import type {
  ContactRequest,
  ContactResponse,
  ProductListResponse,
} from "@oudyn/contracts";

const CLIENT_API = "/api/catalog";

export async function clientProducts(params: URLSearchParams): Promise<ProductListResponse> {
  const response = await fetch(`${CLIENT_API}/products?${params.toString()}`);
  if (!response.ok) throw new Error("Could not load products.");
  return (await response.json()) as ProductListResponse;
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
