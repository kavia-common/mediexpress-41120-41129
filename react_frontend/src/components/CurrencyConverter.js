import React, { useMemo, useState } from "react";

// PUBLIC_INTERFACE
export default function CurrencyConverter({
  defaultRate = 83.0,
  title = "USD → INR Converter"
}) {
  /** Simple USD to INR converter with a configurable (static) exchange rate. */
  const [usd, setUsd] = useState("");
  const [rate, setRate] = useState(String(defaultRate));

  const parsedUsd = useMemo(() => {
    // Empty string should not show an error; treat it as "no input".
    if (usd.trim() === "") return { kind: "empty" };

    const n = Number(usd);
    if (!Number.isFinite(n)) return { kind: "invalid" };
    if (n < 0) return { kind: "invalid" };

    return { kind: "valid", value: n };
  }, [usd]);

  const parsedRate = useMemo(() => {
    const n = Number(rate);
    if (!Number.isFinite(n)) return { kind: "invalid" };
    if (n <= 0) return { kind: "invalid" };
    return { kind: "valid", value: n };
  }, [rate]);

  const inrValue = useMemo(() => {
    if (parsedUsd.kind !== "valid") return null;
    if (parsedRate.kind !== "valid") return null;
    return parsedUsd.value * parsedRate.value;
  }, [parsedUsd, parsedRate]);

  const inrDisplay = useMemo(() => {
    if (parsedUsd.kind === "empty") return "—";
    if (parsedUsd.kind === "invalid") return "—";
    if (parsedRate.kind !== "valid") return "—";
    if (inrValue == null) return "—";
    return inrValue.toFixed(2);
  }, [parsedUsd, parsedRate, inrValue]);

  return (
    <section className="section" aria-label="Currency converter">
      <div className="container">
        <div className="surface" style={{ padding: 18 }}>
          <div className="sectionTitleRow" style={{ marginBottom: 12 }}>
            <div>
              <h2 className="h2">{title}</h2>
              <p className="p">Convert USD to INR using a static rate (editable below).</p>
            </div>
            <span className="badge badgeSuccess">Static rate</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              alignItems: "start"
            }}
          >
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="p" style={{ fontSize: 12 }}>
                USD amount
              </span>
              <input
                value={usd}
                onChange={(e) => setUsd(e.target.value)}
                inputMode="decimal"
                type="text"
                placeholder="e.g., 25"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid var(--mx-border)",
                  background: "var(--mx-surface)",
                  fontSize: 14
                }}
                aria-label="USD amount"
              />
              {parsedUsd.kind === "invalid" ? (
                <span className="p" style={{ fontSize: 12, color: "var(--mx-error)" }}>
                  Please enter a valid non-negative number.
                </span>
              ) : (
                <span className="p" style={{ fontSize: 12 }}>
                  Tip: amounts update in real time as you type.
                </span>
              )}
            </label>

            <div className="surface gradientHero" style={{ padding: 14, borderRadius: 18 }}>
              <div className="p" style={{ fontSize: 12, marginBottom: 6 }}>
                Result (INR)
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 10
                }}
              >
                <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: "-0.01em" }}>
                  ₹{inrDisplay}
                </div>
                <span className="badge">2 decimals</span>
              </div>

              <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span className="p" style={{ fontSize: 12 }}>
                    Exchange rate (INR per 1 USD)
                  </span>
                  <input
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    inputMode="decimal"
                    type="text"
                    placeholder="e.g., 83.0"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 14,
                      border: "1px solid var(--mx-border)",
                      background: "var(--mx-surface)",
                      fontSize: 14
                    }}
                    aria-label="Exchange rate INR per 1 USD"
                  />
                  {parsedRate.kind !== "valid" ? (
                    <span className="p" style={{ fontSize: 12, color: "var(--mx-error)" }}>
                      Rate must be a positive number.
                    </span>
                  ) : (
                    <span className="p" style={{ fontSize: 12 }}>
                      This is a static value for now—can be wired to live rates later.
                    </span>
                  )}
                </label>
              </div>
            </div>
          </div>

          <p className="p" style={{ marginTop: 12, fontSize: 12 }}>
            Note: This converter does not call any external APIs yet.
          </p>

          <style>{`
            @media (max-width: 860px) {
              .surface > div[style*="grid-template-columns"] {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
