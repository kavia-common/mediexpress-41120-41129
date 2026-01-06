import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchProducts } from "../api/client";
import { LoadingBlock, StatusBlock } from "../components/StatusBlock";
import "../App.css";

function getCategories(products) {
  const set = new Set(products.map((p) => p.category).filter(Boolean));
  return Array.from(set);
}

// PUBLIC_INTERFACE
export function HomePage() {
  /** Landing page showing featured medicines and shortcuts. */
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetchProducts({ q })
      .then((list) => {
        if (!alive) return;
        setProducts(list);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Failed to load medicines.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [q]);

  const featured = useMemo(() => products.filter((p) => p.featured).slice(0, 8), [products]);
  const categories = useMemo(() => getCategories(products).slice(0, 6), [products]);

  return (
    <div className="container">
      <div className="hero">
        <h1 className="heroTitle">Order medicines in minutes.</h1>
        <p className="heroDesc">
          Browse trusted pharmacy inventory, add to cart, checkout quickly, and track delivery in real time.
        </p>
        <div className="spacer" />
        <div className="row wrap">
          <Link className="btn btnPrimary" to="/catalog">Browse catalog</Link>
          <Link className="btn btnGhost" to="/orders/track">Track an order</Link>
          <span className="badge">Ocean Professional UI</span>
        </div>
      </div>

      <div className="spacer" />

      {loading ? <LoadingBlock message="Loading featured medicines…" /> : null}
      {error ? (
        <StatusBlock
          variant="error"
          title="Could not load medicines"
          message={error}
          actions={
            <button className="btn btnPrimary btnSm" type="button" onClick={() => window.location.reload()}>
              Retry
            </button>
          }
        />
      ) : null}

      {!loading && !error ? (
        <>
          <div className="row wrap" style={{ justifyContent: "space-between" }}>
            <h2 className="h2" style={{ margin: "16px 0 10px" }}>Featured</h2>
            <Link className="btn btnGhost btnSm" to="/catalog">View all</Link>
          </div>

          <div className="grid grid-4">
            {featured.length ? (
              featured.map((p) => (
                <Link key={p.id} to={`/product/${encodeURIComponent(p.id)}`} className="card cardPad cardHover">
                  <div className="productImage" aria-hidden="true">
                    Rx
                  </div>
                  <div className="productTitle">{p.name}</div>
                  <div className="small">{p.category}{p.strength ? ` • ${p.strength}` : ""}</div>
                  <div className="productMeta">
                    <span className="price">₹{p.price}</span>
                    <span className="badge">{p.prescriptionRequired ? "Prescription" : "OTC"}</span>
                  </div>
                </Link>
              ))
            ) : (
              <StatusBlock title="No featured medicines yet" message="Try searching in the catalog." />
            )}
          </div>

          <div className="spacer" />
          <h2 className="h2" style={{ margin: "16px 0 10px" }}>Popular categories</h2>
          <div className="row wrap">
            {categories.map((c) => (
              <Link key={c} className="btn btnGhost btnSm" to={`/catalog?category=${encodeURIComponent(c)}`}>
                {c}
              </Link>
            ))}
            {!categories.length ? <span className="small">Categories will appear once catalog data is available.</span> : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
