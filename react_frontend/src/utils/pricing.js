import { usdToInr } from "./currency";

/**
 * Pricing helpers that support a per-item INR override while keeping the rest of the app USD-based.
 *
 * Product shape expectations:
 * - product.price: number (USD base)
 * - product.displayPriceInr?: number (optional INR override for primary display)
 */

// PUBLIC_INTERFACE
export function getPrimaryInrPrice(product, rate) {
  /**
   * Returns the INR amount that should be used as the *primary* displayed INR price.
   * If product.displayPriceInr is present and finite, it is used.
   * Otherwise, it is computed by converting product.price (USD) using the global rate.
   */
  const override = Number(product?.displayPriceInr);
  if (Number.isFinite(override) && override >= 0) return override;

  return usdToInr(product?.price, rate);
}

// PUBLIC_INTERFACE
export function getSecondaryUsdPrice(product, rate) {
  /**
   * Returns the USD amount that should be used as the *secondary* displayed USD price.
   * If an INR override is present, we compute the implied USD for consistent secondary display.
   * Otherwise, we use product.price directly.
   */
  const override = Number(product?.displayPriceInr);
  const r = Number(rate);

  if (Number.isFinite(override) && override >= 0 && Number.isFinite(r) && r > 0) {
    return override / r;
  }

  return Number(product?.price) || 0;
}

// PUBLIC_INTERFACE
export function getLinePrices({ product, qty, rate }) {
  /**
   * Convenience helper for cart line items.
   * Returns both INR and USD totals while respecting displayPriceInr override.
   */
  const q = Number(qty);
  const safeQty = Number.isFinite(q) && q > 0 ? q : 0;

  const eachInr = getPrimaryInrPrice(product, rate);
  const eachUsd = getSecondaryUsdPrice(product, rate);

  return {
    eachInr,
    eachUsd,
    lineInr: eachInr * safeQty,
    lineUsd: eachUsd * safeQty
  };
}
