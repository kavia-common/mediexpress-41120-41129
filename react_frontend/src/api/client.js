import { getRuntimeConfig } from "../config/env";

/**
 * Minimal API client for the MediExpress frontend.
 * - Reads base URL from REACT_APP_API_BASE or REACT_APP_BACKEND_URL
 * - Adds Authorization header when token exists
 * - Provides safe fallbacks to keep the UI functional if backend routes differ
 */

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function safeParseJson(resp) {
  const text = await resp.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function buildUrl(path) {
  const { apiBase } = getRuntimeConfig();
  if (!apiBase) return path; // allows relative in dev if proxy exists (not assumed)
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!path.startsWith("/")) path = `/${path}`;
  return `${apiBase}${path}`;
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = "GET", token, body, headers } = {}) {
  /**
   * Perform an API request and return JSON when possible.
   * Throws an Error with .status and .data when available.
   */
  const url = buildUrl(path);

  const mergedHeaders = {
    Accept: "application/json",
    ...(body ? { "Content-Type": "application/json" } : null),
    ...(token ? { Authorization: `Bearer ${token}` } : null),
    ...(headers || {}),
  };

  let resp;
  try {
    resp = await fetch(url, {
      method,
      headers: mergedHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    const err = new Error("Network error. Please check your connection and API base URL.");
    err.cause = e;
    err.status = 0;
    throw err;
  }

  const data = await safeParseJson(resp);

  if (!resp.ok) {
    const err = new Error(
      (data && data.message) ||
        (typeof data === "string" ? data : null) ||
        `Request failed (${resp.status})`
    );
    err.status = resp.status;
    err.data = data;
    throw err;
  }

  return data;
}

/**
 * ---- Domain wrappers ----
 * We try multiple common endpoints. If all fail, we return mocked data
 * to avoid a broken UI when backend routes are unknown in this template.
 */

const MOCK_PRODUCTS = [
  {
    id: "med-001",
    name: "Paracetamol 500mg",
    description: "Fast relief for fever and mild pain. Pack of 10 tablets.",
    price: 49,
    category: "Pain relief",
    strength: "500mg",
    prescriptionRequired: false,
    featured: true,
  },
  {
    id: "med-002",
    name: "Cetirizine 10mg",
    description: "Non-drowsy allergy relief. Pack of 10 tablets.",
    price: 79,
    category: "Allergy",
    strength: "10mg",
    prescriptionRequired: false,
    featured: true,
  },
  {
    id: "med-003",
    name: "Amoxicillin 500mg",
    description: "Antibiotic (requires prescription). Pack of 10 capsules.",
    price: 199,
    category: "Antibiotic",
    strength: "500mg",
    prescriptionRequired: true,
    featured: false,
  },
  {
    id: "med-004",
    name: "Omeprazole 20mg",
    description: "Acidity and reflux control. Pack of 10 capsules.",
    price: 149,
    category: "Gastro",
    strength: "20mg",
    prescriptionRequired: false,
    featured: false,
  },
];

function normalizeProduct(p) {
  if (!p || typeof p !== "object") return null;
  return {
    id: String(p.id ?? p._id ?? p.sku ?? p.code ?? ""),
    name: p.name ?? p.title ?? "Unnamed medicine",
    description: p.description ?? p.desc ?? "",
    price: Number(p.price ?? p.mrp ?? p.amount ?? 0),
    category: p.category ?? p.type ?? "General",
    strength: p.strength ?? p.dosage ?? "",
    prescriptionRequired: Boolean(p.prescriptionRequired ?? p.requiresPrescription ?? false),
    featured: Boolean(p.featured ?? false),
    raw: p,
  };
}

// PUBLIC_INTERFACE
export async function fetchProducts({ q, category, sort } = {}) {
  /**
   * Fetch product list with optional query/filter/sort.
   */
  const candidates = [
    { path: "/medicines", map: (d) => d },
    { path: "/products", map: (d) => d },
    { path: "/catalog", map: (d) => d?.items ?? d },
  ];

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort);

  for (const c of candidates) {
    try {
      const data = await apiRequest(`${c.path}${params.toString() ? `?${params}` : ""}`);
      const arr = Array.isArray(c.map(data)) ? c.map(data) : [];
      const normalized = arr.map(normalizeProduct).filter(Boolean);
      if (normalized.length) return normalized;
      // If endpoint exists but empty, still return empty.
      return normalized;
    } catch {
      // try next
    }
  }

  // Fallback mock (filtered client-side)
  await sleep(250);
  let list = MOCK_PRODUCTS.map(normalizeProduct).filter(Boolean);
  if (q) {
    const needle = q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle)
    );
  }
  if (category) list = list.filter((p) => p.category === category);
  if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
  return list;
}

// PUBLIC_INTERFACE
export async function fetchProductById(id) {
  /**
   * Fetch single product by id.
   */
  const candidates = [
    `/medicines/${encodeURIComponent(id)}`,
    `/products/${encodeURIComponent(id)}`,
  ];

  for (const path of candidates) {
    try {
      const data = await apiRequest(path);
      const p = normalizeProduct(data?.item ?? data?.product ?? data);
      if (p && p.id) return p;
    } catch {
      // try next
    }
  }

  await sleep(150);
  const mock = MOCK_PRODUCTS.map(normalizeProduct).find((p) => p.id === id);
  if (mock) return mock;
  const err = new Error("Medicine not found.");
  err.status = 404;
  throw err;
}

// PUBLIC_INTERFACE
export async function registerUser({ name, email, password }) {
  /**
   * Register a new user.
   * Returns { token, user } if backend supports it; otherwise returns mock token.
   */
  const candidates = [
    { path: "/auth/register" },
    { path: "/register" },
    { path: "/users/register" },
  ];

  for (const c of candidates) {
    try {
      const data = await apiRequest(c.path, { method: "POST", body: { name, email, password } });
      const token = data?.token ?? data?.access_token ?? null;
      const user = data?.user ?? data?.profile ?? { name, email };
      return { token, user };
    } catch {
      // try next
    }
  }

  // Fallback mock
  await sleep(250);
  return { token: "mock-token", user: { name, email } };
}

// PUBLIC_INTERFACE
export async function loginUser({ email, password }) {
  /**
   * Login a user.
   * Returns { token, user } if backend supports it; otherwise returns mock token.
   */
  const candidates = [
    { path: "/auth/login" },
    { path: "/login" },
    { path: "/users/login" },
  ];

  for (const c of candidates) {
    try {
      const data = await apiRequest(c.path, { method: "POST", body: { email, password } });
      const token = data?.token ?? data?.access_token ?? null;
      const user = data?.user ?? data?.profile ?? { email };
      return { token, user };
    } catch {
      // try next
    }
  }

  await sleep(200);
  return { token: "mock-token", user: { email } };
}

// PUBLIC_INTERFACE
export async function createOrder({ token, cartItems, address, payment }) {
  /**
   * Create an order for current cart.
   */
  const payload = {
    items: cartItems.map((i) => ({
      productId: i.product.id,
      quantity: i.quantity,
      price: i.product.price,
      name: i.product.name,
    })),
    address,
    payment: payment || { method: "placeholder" },
  };

  const candidates = [
    { path: "/orders" },
    { path: "/order" },
    { path: "/checkout" },
  ];

  for (const c of candidates) {
    try {
      const data = await apiRequest(c.path, { method: "POST", token, body: payload });
      const order = data?.order ?? data;
      const orderId = order?.id ?? order?._id ?? data?.orderId ?? data?.id ?? null;
      return { orderId: String(orderId || "mock-order"), order };
    } catch {
      // try next
    }
  }

  await sleep(300);
  return {
    orderId: `mock-${Date.now()}`,
    order: {
      id: `mock-${Date.now()}`,
      status: "PLACED",
      createdAt: new Date().toISOString(),
      items: payload.items,
      address: payload.address,
    },
  };
}

// PUBLIC_INTERFACE
export async function fetchOrder({ token, orderId }) {
  /**
   * Fetch an order and its status.
   */
  const candidates = [
    `/orders/${encodeURIComponent(orderId)}`,
    `/order/${encodeURIComponent(orderId)}`,
    `/tracking/${encodeURIComponent(orderId)}`,
  ];

  for (const path of candidates) {
    try {
      const data = await apiRequest(path, { token });
      return data?.order ?? data;
    } catch {
      // try next
    }
  }

  await sleep(250);
  return {
    id: orderId,
    status: "OUT_FOR_DELIVERY",
    updatedAt: new Date().toISOString(),
    timeline: [
      { key: "PLACED", title: "Order placed", at: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
      { key: "CONFIRMED", title: "Pharmacy confirmed", at: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
      { key: "PACKED", title: "Packed", at: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
      { key: "OUT_FOR_DELIVERY", title: "Out for delivery", at: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
    ],
  };
}

// PUBLIC_INTERFACE
export async function fetchHealthcheck(path) {
  /**
   * Fetch healthcheck endpoint (path can be absolute or relative).
   */
  const endpoint = path || "/health";
  return apiRequest(endpoint);
}
