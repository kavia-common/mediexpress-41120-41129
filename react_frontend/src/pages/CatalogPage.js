import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchProducts } from "../api/client";
import { LoadingBlock, StatusBlock } from "../components/StatusBlock";
import "../App.css";

function uniqueCategories(products) {
  const set = new Set(products.map((p) => p.category).filter(Boolean));
  return Array.from(set);
}

// PUBLIC_INTERFACE
export function CatalogPage() {
  /** Product listing with query, category filter, and sort. */
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetchProducts({ q, category, sort })
      .then((list) => {
        if (!alive) return;
        setProducts(list);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Failed to load catalog.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [q, category, sort]);

  const categories = useMemo(() => uniqueCategories(products), [products]);

  function updateParam(name, value) {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(name);
    else next.set(name, value);
    // Reset page-like params if ever added
    setSearchParams(next);
  }

  return (
    <div className="container">
      <div className="row wrap" style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="h1">Catalog</h1>
          <p className="p">Find the right medicine and add it to your cart.</p>
        </div>
        <Link className="btn btnGhost btnSm" to="/">Back to home</Link>
      </div>

      <div className="spacer" />

      <div className="card cardPad">
        <div className="row wrap">
          <div style={{ width: 280, flex: "1 1 220px" }}>
            <label className="small" htmlFor="filterCategory">Category</label>
            <select
              id="filterCategory"
              className="select"
              value={category}
              onChange={(e) => updateParam("category", e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ width: 220, flex: "1 1 180px" }}>
            <label className="small" htmlFor="sort">Sort</label>
            <select
              id="sort"
              className="select"
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
            >
              <option value="">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <div style={{ flex: "2 1 260px" }}>
            <label className="small" htmlFor="q">Search</label>
            <input
              id="q"
              className="input"
              value={q}
              onChange={(e) => updateParam("q", e.target.value)}
              placeholder="Type to search…"
            />
          </div>
        </div>
      </div>

      <div className="spacer" />

      {loading ? <LoadingBlock message="Loading catalog…" /> : null}
      {error ? (
        <StatusBlock
          variant="error"
          title="Catalog unavailable"
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
          {products.length === 0 ? (
            <StatusBlock title="No results" message="Try changing filters or searching for a different name." />
          ) : (
            <div className="grid grid-4">
              {products.map((p) => (
                <Link key={p.id} to={`/product/${encodeURIComponent(p.id)}`} className="card cardPad cardHover">
                  <div className="productImage" aria-hidden="true">Rx</div>
                  <div className="productTitle">{p.name}</div>
                  <div className="small">{p.category}{p.strength ? ` • ${p.strength}` : ""}</div>
                  <div className="productMeta">
                    <span className="price">₹{p.price}</span>
                    <span className="badge">{p.prescriptionRequired ? "Prescription" : "OTC"}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
