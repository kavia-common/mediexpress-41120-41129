import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function placeOrderApi({ token, payload }) {
  /** Places an order. Expected response: { id, status, ... } */
  return apiRequest("/orders", { method: "POST", token, body: payload });
}

// PUBLIC_INTERFACE
export async function listOrdersApi({ token }) {
  /** Lists user's orders. Expected response: Order[] */
  return apiRequest("/orders", { token });
}

// PUBLIC_INTERFACE
export async function getOrderApi({ token, orderId }) {
  /** Gets order detail by id. Expected response: Order */
  return apiRequest(`/orders/${encodeURIComponent(orderId)}`, { token });
}
