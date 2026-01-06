import { apiRequest } from "./client";
import { fallbackProducts } from "../data/fallbackProducts";

// PUBLIC_INTERFACE
export async function listProducts({ q, category, page = 1, limit = 12 } = {}) {
  /**
   * Lists products from backend.
   * Expected response shapes:
   * - { items: Product[], page, totalPages, total }
   * - OR Product[]
   * If backend is unavailable, returns a filtered fallback list.
   */
  const res = await apiRequest("/products", { query: { q, category, page, limit } });
  if (!res.ok) {
    const filtered = filterFallback({ q, category });
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * limit;
    const items = filtered.slice(start, start + limit);
    return {
      ok: true,
      fromFallback: true,
      items,
      page: safePage,
      totalPages,
      total,
      warning: res.error,
    };
  }

  const data = res.data;
  if (Array.isArray(data)) {
    return { ok: true, fromFallback: false, items: data, page: 1, totalPages: 1, total: data.length };
  }

  return {
    ok: true,
    fromFallback: false,
    items: data?.items || [],
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    total: data?.total || (data?.items ? data.items.length : 0),
  };
}

function filterFallback({ q, category }) {
  const qq = (q || "").trim().toLowerCase();
  const cat = (category || "").trim().toLowerCase();
  return fallbackProducts.filter((p) => {
    const matchesQ =
      !qq ||
      p.name.toLowerCase().includes(qq) ||
      p.genericName.toLowerCase().includes(qq) ||
      p.manufacturer.toLowerCase().includes(qq);
    const matchesCat = !cat || p.category.toLowerCase() === cat;
    return matchesQ && matchesCat;
  });
}

// PUBLIC_INTERFACE
export async function getProduct(productId) {
  /** Fetches product details; falls back to local dataset if missing. */
  const res = await apiRequest(`/products/${encodeURIComponent(productId)}`);
  if (!res.ok) {
    const item = fallbackProducts.find((p) => String(p.id) === String(productId));
    if (item) return { ok: true, fromFallback: true, item, warning: res.error };
    return { ok: false, error: res.error || "Product not found." };
  }
  return { ok: true, fromFallback: false, item: res.data };
}
