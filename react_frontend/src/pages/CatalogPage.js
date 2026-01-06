import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { categories } from "../data/fallbackProducts";
import { listProducts } from "../api/catalog";
import ProductList from "../components/ProductList";
import Pagination from "../components/Pagination";
import Button from "../components/Button";

// PUBLIC_INTERFACE
export default function CatalogPage() {
  /** Catalog page with search, category filter, and pagination. */
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const page = Number(params.get("page") || 1);

  const [state, setState] = useState({
    loading: true,
    items: [],
    error: "",
    fromFallback: false,
    warning: "",
    page: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    let mounted = true;
    setState((s) => ({ ...s, loading: true, error: "" }));

    (async () => {
      const res = await listProducts({ q, category, page, limit: 12 });
      if (!mounted) return;

      if (!res.ok) {
        setState((s) => ({ ...s, loading: false, error: res.error || "Unable to load catalog." }));
        return;
      }

      setState({
        loading: false,
        items: res.items || [],
        error: "",
        fromFallback: !!res.fromFallback,
        warning: res.warning || "",
        page: res.page || 1,
        totalPages: res.totalPages || 1,
        total: res.total || 0,
      });
    })();

    return () => {
      mounted = false;
    };
  }, [q, category, page]);

  function setQuery(next) {
    const p = new URLSearchParams(location.search);
    Object.entries(next).forEach(([k, v]) => {
      if (!v) p.delete(k);
      else p.set(k, String(v));
    });
    // reset page on filter changes
    if (next.q !== undefined || next.category !== undefined) p.delete("page");
    navigate(`/catalog?${p.toString()}`);
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="h1">Catalog</h1>
            <div className="subtle">
              Search results: <strong>{state.total}</strong>
              {state.fromFallback ? " • Offline demo data" : ""}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {state.fromFallback ? (
              <span className="badge" title={state.warning || "Backend unavailable; showing offline demo data"}>
                <span className="badge-dot" style={{ background: "var(--secondary)" }} />
                Offline demo
              </span>
            ) : null}

            <Button
              variant="ghost"
              onClick={() => setQuery({ q: "", category: "" })}
              disabled={!q && !category}
              aria-label="Clear filters"
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="card card-pad" style={{ marginBottom: 14 }}>
          <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 12, alignItems: "end" }}>
            <div className="form-row">
              <div className="label">Search</div>
              <input
                className="input"
                value={q}
                placeholder="Type to search..."
                onChange={(e) => setQuery({ q: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="label">Category</div>
              <select className="select" value={category} onChange={(e) => setQuery({ category: e.target.value })}>
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {state.warning ? (
            <div className="subtle" style={{ marginTop: 10 }}>
              Note: {state.warning}
            </div>
          ) : null}
        </div>

        <ProductList products={state.items} loading={state.loading} error={state.error} columns={4} />
        <Pagination
          page={state.page}
          totalPages={state.totalPages}
          onPageChange={(nextPage) => setQuery({ page: nextPage })}
        />
      </div>
    </div>
  );
}
