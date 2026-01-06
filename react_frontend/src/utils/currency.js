/**
 * Currency helpers (single source of truth).
 */

export const DEFAULT_USD_TO_INR_RATE = 83.5;

// PUBLIC_INTERFACE
export function usdToInr(amountUsd, rate = DEFAULT_USD_TO_INR_RATE) {
  /** Convert a USD amount to INR using the given rate. */
  const n = Number(amountUsd);
  const r = Number(rate);
  if (!Number.isFinite(n) || !Number.isFinite(r) || r <= 0) return 0;
  return n * r;
}

// PUBLIC_INTERFACE
export function formatInr(amountInr) {
  /** Format an INR amount with the ₹ symbol and 2 decimals. */
  const n = Number(amountInr);
  const safe = Number.isFinite(n) ? n : 0;
  return `₹${safe.toFixed(2)}`;
}

// PUBLIC_INTERFACE
export function formatUsd(amountUsd) {
  /** Format a USD amount with the $ symbol and 2 decimals. */
  const n = Number(amountUsd);
  const safe = Number.isFinite(n) ? n : 0;
  return `$${safe.toFixed(2)}`;
}

