/**
 * Application configuration sourced from environment variables.
 * CRA exposes env vars with REACT_APP_ prefix at build time.
 */

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns REST API base URL from env; empty string if missing. */
  return (process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "").trim();
}

// PUBLIC_INTERFACE
export function getWsBaseUrl() {
  /** Returns WebSocket base URL from env; empty string if missing. */
  return (process.env.REACT_APP_WS_URL || "").trim();
}

// PUBLIC_INTERFACE
export function getConfigIssues() {
  /** Returns a list of human-readable configuration issues to show in UI. */
  const issues = [];
  if (!getApiBaseUrl()) {
    issues.push(
      "Backend API base URL is not configured. Set REACT_APP_API_BASE (or REACT_APP_BACKEND_URL) to enable live data."
    );
  }
  // WS URL is optional/reserved; don't warn unless provided but invalid (basic check)
  const ws = getWsBaseUrl();
  if (ws && !/^wss?:\/\//i.test(ws)) {
    issues.push("REACT_APP_WS_URL is set but does not look like a valid ws:// or wss:// URL.");
  }
  return issues;
}
