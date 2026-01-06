// PUBLIC_INTERFACE
export function formatCurrency(value, currency = "INR") {
  /** Formats numeric values to currency for display. */
  const num = Number(value || 0);
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(num);
  } catch {
    return `₹${num}`;
  }
}
