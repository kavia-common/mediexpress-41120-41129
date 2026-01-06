import React, { useEffect, useMemo, useState } from "react";
import { medicines } from "../data/medicines";
import ProductCard from "../components/ProductCard";
import Badge from "../components/Badge";

// PUBLIC_INTERFACE
export default function ProductsPage({ externalQuery = "" }) {
  /** Product listing page with name search + availability filter. */
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState("All");

  useEffect(() => {
    if (externalQuery && externalQuery.trim()) {
      setQuery(externalQuery.trim());
    }
  }, [externalQuery]);

  const availabilityOptions = ["All", "In Stock", "Limited", "Out of Stock"];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return medicines
      .filter((m) => (availability === "All" ? true : m.availability === availability))
      .filter((m) => (q ? m.name.toLowerCase().includes(q) : true));
  }, [query, availability]);

  return (
    <section className="section">
      <div className="container">
        <div className="sectionTitleRow">
          <div>
            <h2 className="h2">Products</h2>
            <p className="p">Browse medicines with quick cart actions. (Mock data)</p>
          </div>
          <Badge tone="neutral">{filtered.length} items</Badge>
        </div>

        <div
          className="surface"
          style={{
            padding: 14,
            marginBottom: 14,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 6, flex: "1 1 320px" }}>
            <span className="p" style={{ fontSize: 12 }}>Search by name</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Paracetamol"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid var(--mx-border)",
                background: "var(--mx-surface)",
                fontSize: 14
              }}
              aria-label="Search products by name"
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 220 }}>
            <span className="p" style={{ fontSize: 12 }}>Availability</span>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid var(--mx-border)",
                background: "var(--mx-surface)",
                fontSize: 14
              }}
              aria-label="Filter by availability"
            >
              {availabilityOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="surface gradientHero" style={{ padding: 18 }}>
            <h3 className="h2" style={{ marginBottom: 6 }}>No matches found</h3>
            <p className="p">Try clearing your search or switching availability.</p>
          </div>
        ) : (
          <div className="grid gridCols4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
