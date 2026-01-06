import React from "react";
import ProductCard from "./ProductCard";

// PUBLIC_INTERFACE
export default function ProductList({ products, loading, error, columns = 4 }) {
  /** Product grid list with skeleton and empty/error handling. */
  const gridClass = columns === 3 ? "grid grid-3" : "grid grid-4";

  if (loading) {
    return (
      <div className={gridClass} aria-busy="true">
        {Array.from({ length: columns * 2 }).map((_, idx) => (
          <div key={idx} className="card card-pad">
            <div className="skel" style={{ height: 14, width: "70%", marginBottom: 10 }} />
            <div className="skel" style={{ height: 12, width: "55%", marginBottom: 16 }} />
            <div className="skel" style={{ height: 16, width: "40%", marginBottom: 10 }} />
            <div className="skel" style={{ height: 42, width: "100%" }} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="banner banner-error" role="alert">
        {error}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="card card-pad">
        <div style={{ fontWeight: 800 }}>No medicines found</div>
        <div className="subtle" style={{ marginTop: 6 }}>
          Try adjusting your search or filters.
        </div>
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
