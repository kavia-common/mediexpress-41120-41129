import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../api/catalog";
import Button from "../components/Button";
import { formatCurrency } from "../utils/format";
import { useCart } from "../context/CartContext";

// PUBLIC_INTERFACE
export default function ProductDetailsPage() {
  /** Product details page. */
  const { id } = useParams();
  const { addItem } = useCart();

  const [state, setState] = useState({ loading: true, item: null, error: "", warning: "", fromFallback: false });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await getProduct(id);
      if (!mounted) return;

      if (!res.ok) {
        setState({ loading: false, item: null, error: res.error || "Unable to load product.", warning: "", fromFallback: false });
        return;
      }

      setState({
        loading: false,
        item: res.item,
        error: "",
        warning: res.warning || "",
        fromFallback: !!res.fromFallback,
      });
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (state.loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="card card-pad">
            <div className="skel" style={{ height: 22, width: "60%", marginBottom: 10 }} />
            <div className="skel" style={{ height: 12, width: "40%", marginBottom: 14 }} />
            <div className="skel" style={{ height: 14, width: "100%", marginBottom: 8 }} />
            <div className="skel" style={{ height: 14, width: "90%", marginBottom: 18 }} />
            <div className="skel" style={{ height: 44, width: 220 }} />
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="page">
        <div className="container">
          <div className="banner banner-error" role="alert">
            {state.error}
          </div>
        </div>
      </div>
    );
  }

  const p = state.item;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="h1">{p.name}</h1>
            <div className="subtle" style={{ marginTop: 6 }}>
              {p.genericName} • {p.manufacturer} • {p.category}
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
              <Button variant="ghost">Back to catalog</Button>
            </Link>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 14 }}>
          <div className="card card-pad">
            <div style={{ fontWeight: 900, fontSize: 16 }}>Description</div>
            <div className="subtle" style={{ marginTop: 8 }}>
              {p.description}
            </div>

            <div className="hr" />

            <div style={{ display: "grid", gap: 10 }}>
              <div>
                <div className="label">Dosage</div>
                <div style={{ fontWeight: 700, marginTop: 4 }}>{p.dosage || "As directed by physician"}</div>
              </div>

              <div>
                <div className="label">Prescription</div>
                <div style={{ fontWeight: 700, marginTop: 4 }}>
                  {p.prescriptionRequired ? "Required" : "Not required"}
                </div>
              </div>

              <div>
                <div className="label">Stock</div>
                <div style={{ fontWeight: 700, marginTop: 4 }}>{p.stock ?? "—"}</div>
              </div>
            </div>
          </div>

          <div className="card card-pad">
            <div style={{ fontWeight: 900, fontSize: 16 }}>Purchase</div>

            <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginTop: 10 }}>
              <div style={{ fontWeight: 900, fontSize: 22 }}>{formatCurrency(p.price)}</div>
              {p.mrp ? (
                <div className="subtle" style={{ textDecoration: "line-through" }}>
                  {formatCurrency(p.mrp)}
                </div>
              ) : null}
            </div>

            {p.prescriptionRequired ? (
              <div className="banner" style={{ marginTop: 12 }}>
                Prescription required. You can still add to cart; the pharmacist may request a prescription during checkout.
              </div>
            ) : null}

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <Button onClick={() => addItem(p, 1)}>Add to cart</Button>
              <Link to="/checkout">
                <Button variant="secondary" style={{ width: "100%" }}>
                  Go to checkout
                </Button>
              </Link>
            </div>

            {state.warning ? (
              <div className="subtle" style={{ marginTop: 12 }}>
                Note: {state.warning}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
