import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProducts } from "../api/catalog";
import ProductList from "../components/ProductList";
import Button from "../components/Button";

// PUBLIC_INTERFACE
export default function HomePage() {
  /** Landing page showcasing featured medicines. */
  const [state, setState] = useState({ loading: true, items: [], error: "", warning: "", fromFallback: false });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await listProducts({ page: 1, limit: 8 });
      if (!mounted) return;

      if (!res.ok) {
        setState({ loading: false, items: [], error: res.error || "Unable to load products.", warning: "", fromFallback: false });
        return;
      }

      setState({
        loading: false,
        items: res.items || [],
        error: "",
        warning: res.warning || "",
        fromFallback: !!res.fromFallback,
      });
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="h1">Fast pharmacy delivery, made simple</h1>
            <div className="subtle" style={{ marginTop: 6 }}>
              Browse trusted medicines, add to cart, checkout, and track your order.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {state.fromFallback ? (
              <span className="badge" title={state.warning || "Backend unavailable; showing offline demo data"}>
                <span className="badge-dot" style={{ background: "var(--secondary)" }} />
                Offline demo
              </span>
            ) : null}
            <Link to="/catalog">
              <Button>Browse catalog</Button>
            </Link>
          </div>
        </div>

        <div className="card card-pad" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 16 }}>Featured medicines</div>
              <div className="subtle">Popular picks and everyday essentials</div>
            </div>
            <Link to="/catalog">
              <Button variant="ghost">View all</Button>
            </Link>
          </div>
        </div>

        <ProductList products={state.items} loading={state.loading} error={state.error} columns={4} />
      </div>
    </div>
  );
}
