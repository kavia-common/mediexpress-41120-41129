/**
 * Environment helpers for the MediExpress frontend.
 * All values are read from process.env (CRA build-time).
 */

/** Parse comma-separated or JSON feature flags into a map. */
function parseFeatureFlags(raw) {
  if (!raw) return {};
  const trimmed = String(raw).trim();
  if (!trimmed) return {};
  try {
    // JSON object: {"flagA": true, "flagB": false}
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    // fall through to CSV parsing
  }
  // CSV: "flagA,flagB,flagC"
  const flags = {};
  trimmed
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((name) => {
      flags[name] = true;
    });
  return flags;
}

// PUBLIC_INTERFACE
export function getRuntimeConfig() {
  /**
   * Return runtime configuration derived from environment variables.
   * @returns {{apiBase: string, wsUrl: string|null, frontendUrl: string|null, nodeEnv: string, experimentsEnabled: boolean, featureFlags: object, healthcheckPath: string|null}}
   */
  const apiBase =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    "";

  const wsUrl = process.env.REACT_APP_WS_URL || null;
  const frontendUrl = process.env.REACT_APP_FRONTEND_URL || null;

  const nodeEnv = process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || "development";
  const experimentsEnabled = String(process.env.REACT_APP_EXPERIMENTS_ENABLED || "").toLowerCase() === "true";
  const featureFlags = parseFeatureFlags(process.env.REACT_APP_FEATURE_FLAGS);

  const healthcheckPath = process.env.REACT_APP_HEALTHCHECK_PATH || null;

  return {
    apiBase: apiBase.replace(/\/$/, ""),
    wsUrl,
    frontendUrl,
    nodeEnv,
    experimentsEnabled,
    featureFlags,
    healthcheckPath,
  };
}
