import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { formatCurrency } from "../utils/format";
import { useCart } from "../context/CartContext";

// PUBLIC_INTERFACE
export default function ProductCard({ product }) {
  /** Displays a product summary card with add-to-cart action. */
  const { addItem } = useCart();

  const discount =
    product.mrp && product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ padding: 14 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ minWidth: 0 }}>
            <Link to={`/product/${encodeURIComponent(product.id)}`}>
              <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.25 }}>{product.name}</div>
              <div className="subtle" style={{ marginTop: 4 }}>
                {product.genericName} • {product.manufacturer}
              </div>
            </Link>
          </div>

          <span className="badge" title="Category">
            <span className="badge-dot" />
            {product.category}
          </span>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginTop: 12 }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>{formatCurrency(product.price)}</div>
          {product.mrp ? (
            <div className="subtle" style={{ textDecoration: "line-through" }}>
              {formatCurrency(product.mrp)}
            </div>
          ) : null}
          {discount ? (
            <div className="subtle" style={{ color: "rgba(29,78,216,1)", fontWeight: 800 }}>
              {discount}% off
            </div>
          ) : null}
        </div>

        <div className="subtle" style={{ marginTop: 8, minHeight: 34 }}>
          {product.description}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <Button onClick={() => addItem(product, 1)} style={{ flex: 1 }}>
            Add to cart
          </Button>
          <Link to={`/product/${encodeURIComponent(product.id)}`}>
            <Button variant="ghost">Details</Button>
          </Link>
        </div>

        {product.prescriptionRequired ? (
          <div className="subtle" style={{ marginTop: 10, color: "#7c4a00", fontWeight: 700 }}>
            Prescription required
          </div>
        ) : null}
      </div>
    </div>
  );
}
