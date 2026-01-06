import { getApiBaseUrl } from "../config";

/**
 * Minimal API client wrapper around fetch.
 * - Reads base URL from REACT_APP_API_BASE (fallback REACT_APP_BACKEND_URL).
 * - Adds Authorization header when token provided.
 * - Returns a normalized result object so UI can render graceful states.
 */

function normalizeBase(base) {
  return (base || "").replace(/\/+$/, "");
}

function normalizePath(path) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

async function safeParseJson(resp) {
  try {
    return await resp.json();
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = "GET", token, body, query, headers } = {}) {
  /** Performs an HTTP request and returns { ok, status, data, error }. */
  const base = normalizeBase(getApiBaseUrl());
  if (!base) {
    return { ok: false, status: 0, data: null, error: "API base URL not configured." };
  }

  const url = new URL(base + normalizePath(path));
  if (query && typeof query === "object") {
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      url.searchParams.set(k, String(v));
    });
  }

  const finalHeaders = {
    Accept: "application/json",
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers || {}),
  };

  try {
    const resp = await fetch(url.toString(), {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await safeParseJson(resp);
    if (!resp.ok) {
      const message =
        (data && (data.error || data.message)) || `Request failed with status ${resp.status} ${resp.statusText}`;
      return { ok: false, status: resp.status, data, error: message };
    }
    return { ok: true, status: resp.status, data, error: null };
  } catch (e) {
    return { ok: false, status: 0, data: null, error: e?.message || "Network error. Is the backend reachable?" };
  }
}
