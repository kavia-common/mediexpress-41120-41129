import React, { useMemo, useState } from "react";
import Button from "../components/Button";

const steps = [
  { key: "placed", title: "Placed", desc: "We’ve received your order." },
  { key: "packed", title: "Packed", desc: "Your medicines are being packed." },
  { key: "out", title: "Out for Delivery", desc: "Rider is on the way to you." },
  { key: "delivered", title: "Delivered", desc: "Order delivered successfully." }
];

function mockProgressFromOrderId(orderId) {
  // Deterministic mock: use last digit to compute progress.
  const digits = orderId.replace(/\D/g, "");
  const last = digits ? Number(digits[digits.length - 1]) : 0;
  return Math.min(steps.length - 1, Math.floor((last / 10) * steps.length));
}

// PUBLIC_INTERFACE
export default function OrderTrackingPage() {
  /** Order tracking page with mocked timeline/progress. */
  const [orderId, setOrderId] = useState("");
  const [submittedId, setSubmittedId] = useState("");

  const activeIndex = useMemo(() => mockProgressFromOrderId(submittedId), [submittedId]);

  const submit = (e) => {
    e.preventDefault();
    const trimmed = orderId.trim();
    if (!trimmed) return;
    setSubmittedId(trimmed);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="sectionTitleRow">
          <div>
            <h2 className="h2">Order Tracking</h2>
            <p className="p">Enter an order ID to see a mocked delivery timeline.</p>
          </div>
        </div>

        <div className="surface gradientHero" style={{ padding: 18 }}>
          <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, flex: "1 1 320px" }}>
              <span className="p" style={{ fontSize: 12 }}>Order ID</span>
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g., MX-10384"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid var(--mx-border)",
                  background: "var(--mx-surface)",
                  fontSize: 14
                }}
                aria-label="Order ID"
              />
            </label>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <Button variant="primary" type="submit">
                Track
              </Button>
            </div>
          </form>

          {!submittedId ? (
            <p className="p" style={{ marginTop: 12 }}>
              Tip: Try different last digits to see different progress states.
            </p>
          ) : (
            <>
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <strong>Order: {submittedId}</strong>
                <span className="badge">
                  Status: {steps[activeIndex].title}
                </span>
              </div>

              <div className="timeline" aria-label="Order status timeline">
                {steps.map((s, idx) => {
                  const cls = idx < activeIndex ? "dot dotDone" : idx === activeIndex ? "dot dotActive" : "dot";
                  return (
                    <div className="timelineItem" key={s.key}>
                      <div className={cls} aria-hidden="true" />
                      <div>
                        <p className="timelineTitle">{s.title}</p>
                        <p className="timelineDesc">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
