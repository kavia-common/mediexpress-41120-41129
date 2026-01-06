import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProductById } from "../api/client";
import { LoadingBlock, StatusBlock } from "../components/StatusBlock";
import { useCart } from "../state/CartContext";
import "../App.css";

// PUBLIC_INTERFACE
export function ProductDetailPage() {
  /** Product detail and add-to-cart flow. */
  const { id } = useParams();
  const { addToCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetchProductById(id)
      .then((p) => {
        if (!alive) return;
        setProduct(p);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Failed to load product.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) return <div className="container"><LoadingBlock message="Loading medicine details…" /></div>;
  if (error) {
    return (
      <div className="container">
        <StatusBlock variant="error" title="Could not load medicine" message={error} />
        <div className="spacer" />
        <Link className="btn btnGhost" to="/catalog">Back to catalog</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <StatusBlock title="Not found" message="This medicine is unavailable." />
        <div className="spacer" />
        <Link className="btn btnGhost" to="/catalog">Back to catalog</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row wrap" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="h1">{product.name}</h1>
          <p className="p">{product.category}{product.strength ? ` • ${product.strength}` : ""}</p>
        </div>
        <Link className="btn btnGhost btnSm" to="/catalog">Back</Link>
      </div>

      <div className="spacer" />

      <div className="grid" style={{ gridTemplateColumns: "1.1fr 0.9fr", gap: 14 }}>
        <div className="card cardPad">
          <div className="productImage" style={{ height: 220 }} aria-hidden="true">Rx</div>
          <div className="spacer" />
          <span className="badge">{product.prescriptionRequired ? "Prescription required" : "Over the counter"}</span>
          <div className="spacer" />
          <p className="p" style={{ color: "rgba(17,24,39,0.75)" }}>{product.description || "No description provided."}</p>
        </div>

        <div className="card cardPad">
          <div className="kv">
            <span className="kvLabel">Price</span>
            <span className="kvValue">₹{product.price}</span>
          </div>
          <div className="spacer" />
          <label className="small" htmlFor="qty">Quantity</label>
          <div className="row">
            <button className="btn btnGhost btnSm" type="button" onClick={() => setQty((x) => Math.max(1, x - 1))}>-</button>
            <input
              id="qty"
              className="input"
              style={{ width: 80, textAlign: "center" }}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
              inputMode="numeric"
            />
            <button className="btn btnGhost btnSm" type="button" onClick={() => setQty((x) => x + 1)}>+</button>
          </div>

          <div className="spacer" />
          <button
            className="btn btnPrimary btnBlock"
            type="button"
            onClick={() => addToCart(product, qty)}
          >
            Add to cart
          </button>

          <div className="spacer" />
          <Link className="btn btnAccent btnBlock" to="/cart">Go to cart</Link>

          {product.prescriptionRequired ? (
            <>
              <div className="spacer" />
              <div className="alert">
                <p className="alertTitle">Prescription note</p>
                <p className="small">You may be asked to provide a prescription before delivery.</p>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .grid[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
