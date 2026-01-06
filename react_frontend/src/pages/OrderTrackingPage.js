import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import { useCurrency } from "../context/CurrencyContext";
import { formatInr, formatUsd, usdToInr } from "../utils/currency";
import { getLinePrices } from "../utils/pricing";
import { getOrderStatus, ORDER_STATUSES } from "../utils/orderService";
import { FALLBACK_MEDICINE_IMAGE } from "../data/medicines";

const UI_STEPS = [
  { key: "PLACED", title: "Placed", desc: "We’ve received your order." },
  { key: "PREPARING", title: "Preparing", desc: "Your medicines are being packed and prepared." },
  { key: "DISPATCHED", title: "Dispatched", desc: "Your order has left the store." },
  { key: "OUT_FOR_DELIVERY", title: "Out for delivery", desc: "A rider is on the way to you." },
  { key: "DELIVERED", title: "Delivered", desc: "Order delivered successfully." }
];

function getActiveIndexFromStatus(status) {
  const idx = UI_STEPS.findIndex((s) => s.key === status);
  return Math.max(0, idx === -1 ? 0 : idx);
}

function usePollingUntilDelivered(orderId, refreshMs = 7000) {
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setSnapshot(null);
      return undefined;
    }

    let mounted = true;

    const tick = () => {
      const next = getOrderStatus(orderId);
      if (mounted) setSnapshot(next);
      return next;
    };

    // Immediate fetch on mount / orderId change.
    let last = tick();

    const interval = window.setInterval(() => {
      // Stop polling once delivered.
      if (last?.status === "DELIVERED") return;
      last = tick();
    }, refreshMs);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [orderId, refreshMs]);

  return snapshot;
}

// PUBLIC_INTERFACE
export default function OrderTrackingPage() {
  /**
   * Order tracking page:
   * - Reads orderId from URL (?orderId=...)
   * - Uses OrderService (localStorage) to fetch & auto-progress status
   * - Auto-refreshes every ~7s until DELIVERED
   */
  const [params] = useSearchParams();
  const orderId = (params.get("orderId") || "").trim();

  const { rate } = useCurrency();
  const order = usePollingUntilDelivered(orderId, 7000);

  const activeIndex = useMemo(() => getActiveIndexFromStatus(order?.status), [order?.status]);

  const totals = useMemo(() => {
    if (!order?.items?.length) return null;

    const items = order.items;
    const subtotalUsd = items.reduce((sum, it) => sum + (Number(it?.qty) || 0) * (Number(it?.product?.price) || 0), 0);
    const subtotalInr = usdToInr(subtotalUsd, rate);
    return { subtotalUsd, subtotalInr };
  }, [order?.items, rate]);

  const canRetry = Boolean(orderId);

  return (
    <section className="section">
      <div className="container">
        <div className="sectionTitleRow">
          <div>
            <h2 className="h2">Order Tracking</h2>
            <p className="p">Live-like tracking updates refresh every few seconds (mock, client-side only).</p>
          </div>
          {orderId ? <span className="badge">Order: {orderId}</span> : null}
        </div>

        {!orderId ? (
          <div className="surface gradientHero" style={{ padding: 18 }}>
            <h3 className="h2" style={{ marginBottom: 6 }}>
              Missing order ID
            </h3>
            <p className="p" style={{ marginBottom: 12 }}>
              Please place an order from your cart, or open a tracking link that includes <span className="kbd">?orderId=...</span>.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn btnPrimary" to="/products">
                Back to Products
              </Link>
              <Link className="btn btnGhost" to="/">
                Home
              </Link>
            </div>
          </div>
        ) : !order ? (
          <div className="surface gradientHero" style={{ padding: 18 }}>
            <h3 className="h2" style={{ marginBottom: 6 }}>
              Awaiting status…
            </h3>
            <p className="p" style={{ marginBottom: 12 }}>
              We couldn’t find this order yet, or the status hasn’t loaded. We’ll keep retrying automatically.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <Link className="btn btnGhost" to="/products">
                Back to Products
              </Link>
              <Button
                variant="primary"
                type="button"
                disabled={!canRetry}
                onClick={() => {
                  // Force a one-off refresh by reading status again.
                  // (Polling hook will update soon anyway; this is just a manual affordance.)
                  getOrderStatus(orderId);
                }}
              >
                Retry now
              </Button>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: 14,
              alignItems: "start"
            }}
          >
            {/* Left: timeline */}
            <div className="surface gradientHero" style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div className="p" style={{ fontSize: 12 }}>
                    Current status
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-0.01em" }}>
                    {UI_STEPS[activeIndex]?.title || "Placed"}
                  </div>
                </div>

                <span className="badge badgeSuccess" title="Auto-refreshes until delivered">
                  Auto-refresh
                </span>
              </div>

              <div className="timeline" aria-label="Order status timeline">
                {UI_STEPS.map((s, idx) => {
                  const cls = idx < activeIndex ? "dot dotDone" : idx === activeIndex ? "dot dotActive" : "dot";
                  const historyAt = (order.history || []).find((h) => h.status === s.key)?.at;

                  return (
                    <div className="timelineItem" key={s.key}>
                      <div className={cls} aria-hidden="true" />
                      <div>
                        <p className="timelineTitle" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <span>{s.title}</span>
                          {historyAt ? (
                            <span className="priceSecondary" style={{ fontSize: 12 }}>
                              {new Date(historyAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          ) : null}
                        </p>
                        <p className="timelineDesc">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {ORDER_STATUSES.includes(order.status) && order.status === "DELIVERED" ? (
                <div className="surface" style={{ padding: 12, borderRadius: 16, marginTop: 14 }}>
                  <strong style={{ display: "block" }}>Delivered</strong>
                  <p className="p" style={{ margin: "4px 0 0" }}>
                    Thanks for ordering with Jashmedicine. (Mock)
                  </p>
                </div>
              ) : null}
            </div>

            {/* Right: order summary */}
            <aside className="surface" style={{ padding: 18 }}>
              <div className="sectionTitleRow" style={{ marginBottom: 10 }}>
                <div>
                  <h3 className="h2">Order summary</h3>
                  <p className="p" style={{ fontSize: 12 }}>
                    Created: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <Link className="btn btnGhost" to="/products">
                  Add more
                </Link>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {(order.items || []).map(({ product, qty }) => {
                  const { lineInr, lineUsd } = getLinePrices({ product, qty, rate });

                  return (
                    <div
                      key={product?.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "44px 1fr auto",
                        gap: 10,
                        alignItems: "center",
                        padding: 10,
                        borderRadius: 16,
                        border: "1px solid rgba(17,24,39,0.10)",
                        background: "rgba(17,24,39,0.015)"
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 14,
                          border: "1px solid rgba(17,24,39,0.08)",
                          background:
                            "linear-gradient(135deg, rgba(59, 130, 246, 0.10), rgba(249, 250, 251, 1))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden"
                        }}
                      >
                        <img
                          src={product?.image || product?.imageUrl || FALLBACK_MEDICINE_IMAGE}
                          alt={product?.name || "Medicine"}
                          style={{ width: "86%", height: "86%", objectFit: "contain" }}
                          loading="lazy"
                          onError={(e) => {
                            if (e.currentTarget.src !== FALLBACK_MEDICINE_IMAGE) {
                              e.currentTarget.src = FALLBACK_MEDICINE_IMAGE;
                            }
                          }}
                        />
                      </div>

                      <div>
                        <div style={{ fontWeight: 850, fontSize: 13 }}>{product?.name}</div>
                        <div className="priceSecondary" style={{ fontSize: 12 }}>
                          Qty: {qty}
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.15 }}>
                        <div className="price">{formatInr(lineInr)}</div>
                        <div className="priceSecondary">({formatUsd(lineUsd)} USD)</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 12, borderTop: "1px solid var(--mx-border)", paddingTop: 12 }}>
                <div className="totalRow" style={{ marginBottom: 0 }}>
                  <span>Total</span>
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.1 }}>
                    <span className="totalPrimary">{formatInr(totals?.subtotalInr || 0)}</span>
                    <span className="totalSecondary">({formatUsd(totals?.subtotalUsd || 0)} USD)</span>
                  </span>
                </div>

                <p className="p" style={{ marginTop: 10, fontSize: 12 }}>
                  This is a client-side demo. Status updates are simulated.
                </p>
              </div>
            </aside>

            <style>{`
              @media (max-width: 860px) {
                section .container > div[style*="grid-template-columns"] {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>
          </div>
        )}
      </div>
    </section>
  );
}
