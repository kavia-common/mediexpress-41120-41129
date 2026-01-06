const STORAGE_KEY = "mx_orders_v1";

/**
 * Order statuses used by the tracking flow.
 * Kept in a single place so UI + service stay consistent.
 */
export const ORDER_STATUSES = ["PLACED", "PREPARING", "DISPATCHED", "OUT_FOR_DELIVERY", "DELIVERED"];

function safeJsonParse(value, fallback) {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function loadAllOrders() {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const data = safeJsonParse(raw, {});
  // Ensure an object shape (id -> order)
  return data && typeof data === "object" ? data : {};
}

function saveAllOrders(ordersById) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ordersById));
}

function nowIso() {
  return new Date().toISOString();
}

function generateOrderId() {
  // Stable-ish and readable ID for demo purposes.
  // Example: MX-20260106-483921
  const d = new Date();
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const rnd = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
  return `MX-${yyyy}${mm}${dd}-${rnd}`;
}

function clampStatus(status) {
  return ORDER_STATUSES.includes(status) ? status : "PLACED";
}

function getStatusIndex(status) {
  return Math.max(0, ORDER_STATUSES.indexOf(clampStatus(status)));
}

function nextStatus(status) {
  const idx = getStatusIndex(status);
  return ORDER_STATUSES[Math.min(ORDER_STATUSES.length - 1, idx + 1)];
}

function progressOrderIfDue(order, nowMs) {
  const createdAtMs = Date.parse(order.createdAt);
  if (!Number.isFinite(createdAtMs)) return order;

  // Progression cadence (mock): move to next status every ~10s after creation.
  // Auto-refreshing every 5–10s will show updates naturally.
  const stepMs = 10_000;
  const elapsed = Math.max(0, nowMs - createdAtMs);
  const expectedIndex = Math.min(ORDER_STATUSES.length - 1, Math.floor(elapsed / stepMs));

  const currentIndex = getStatusIndex(order.status);
  if (expectedIndex <= currentIndex) return order;

  // Apply transitions one-by-one so history is filled correctly.
  let updated = { ...order };
  for (let i = currentIndex; i < expectedIndex; i += 1) {
    const next = ORDER_STATUSES[i + 1];
    updated = {
      ...updated,
      status: next,
      history: [
        ...(updated.history || []),
        {
          status: next,
          at: nowIso()
        }
      ]
    };
  }
  return updated;
}

// PUBLIC_INTERFACE
export function createOrder(cartItems, totals) {
  /**
   * Create and persist a new order from cart items + totals.
   * Returns: { orderId, createdAt, status, history, items, totals }
   */
  const items = (cartItems || []).map(({ product, qty }) => ({
    product,
    qty
  }));

  const orderId = generateOrderId();
  const createdAt = nowIso();

  const order = {
    orderId,
    createdAt,
    status: "PLACED",
    history: [{ status: "PLACED", at: createdAt }],
    items,
    totals: totals || {}
  };

  const all = loadAllOrders();
  all[orderId] = order;
  saveAllOrders(all);

  return order;
}

// PUBLIC_INTERFACE
export function getOrder(orderId) {
  /** Retrieve an order by ID from localStorage, or null if missing. */
  if (!orderId) return null;
  const all = loadAllOrders();
  return all[orderId] || null;
}

// PUBLIC_INTERFACE
export function getOrderStatus(orderId) {
  /**
   * Returns the latest order status for the orderId and persists any progressed states.
   * Shape: { orderId, status, history, createdAt, items, totals }
   */
  if (!orderId) return null;

  const all = loadAllOrders();
  const existing = all[orderId];
  if (!existing) return null;

  const progressed = progressOrderIfDue(existing, Date.now());
  if (progressed !== existing) {
    all[orderId] = progressed;
    saveAllOrders(all);
  }

  return progressed;
}
