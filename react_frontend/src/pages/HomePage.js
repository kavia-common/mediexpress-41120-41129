import React, { useMemo } from "react";
import { medicines } from "../data/medicines";
import ProductCard from "../components/ProductCard";
import Button from "../components/Button";
import CurrencyConverter from "../components/CurrencyConverter";
import { useCurrency } from "../context/CurrencyContext";
import { formatInr, formatUsd, usdToInr } from "../utils/currency";

// PUBLIC_INTERFACE
export default function HomePage({ onCtaBrowse }) {
  /** Homepage with hero, featured medicines and quick value props. */
  const featured = useMemo(() => medicines.filter((m) => m.featured).slice(0, 4), []);
  const { rate, setRate } = useCurrency();

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="surface gradientHero" style={{ padding: 24 }}>
            <div className="grid" style={{ gridTemplateColumns: "1.2fr 0.8fr", gap: 18, alignItems: "center" }}>
              <div>
                <h1 className="h1">Order medicines online. Delivered in minutes.</h1>
                <p className="p" style={{ marginTop: 10, maxWidth: 640 }}>
                  MedExpress brings your essentials—pain relief, allergy support, hydration—right to your door with a clean,
                  modern experience. (Mock UI)
                </p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
                  <Button variant="primary" type="button" onClick={onCtaBrowse}>
                    Browse products
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => window.alert("Upload prescription not implemented yet.")}
                  >
                    Upload prescription
                  </Button>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                  <span className="badge">Fast delivery</span>
                  <span className="badge">Verified pharmacies</span>
                  <span className="badge">Secure checkout (mock)</span>
                </div>
              </div>

              <div className="surface" style={{ padding: 16, borderRadius: 18, boxShadow: "var(--mx-shadow-sm)" }}>
                <div className="h2" style={{ marginBottom: 8 }}>
                  Today’s highlights
                </div>
                <p className="p">Featured picks based on availability and common needs.</p>

                <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                  {featured.slice(0, 3).map((m) => {
                    const inr = usdToInr(m.price, rate);
                    return (
                      <div
                        key={m.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                          padding: 12,
                          borderRadius: 16,
                          border: "1px solid rgba(17,24,39,0.10)",
                          background: "rgba(255,255,255,0.70)",
                          boxShadow: "0 10px 18px rgba(17,24,39,0.06)"
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <strong style={{ fontSize: 14, letterSpacing: "-0.01em" }}>{m.name}</strong>
                          <span className="price">{formatInr(inr)}</span>
                          <span className="priceSecondary">({formatUsd(m.price)} USD)</span>
                        </div>
                        <span className="badge">Featured</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <style>{`
              @media (max-width: 860px) {
                .gradientHero .grid {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>
          </div>
        </div>
      </section>

      <CurrencyConverter title="USD → INR Rate" valueRate={rate} onRateChange={setRate} />

      <section className="section">
        <div className="container">
          <div className="sectionTitleRow">
            <div>
              <h2 className="h2">Featured medicines</h2>
              <p className="p">Popular items with quick add-to-cart.</p>
            </div>
            <Button variant="ghost" type="button" onClick={onCtaBrowse}>
              View all →
            </Button>
          </div>

          <div className="grid gridCols4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
