import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Button from "./Button";
import { formatCurrency } from "../utils/format";

// PUBLIC_INTERFACE
export default function CartDrawer() {
  /** Right-side cart drawer; open/close is controlled by CartContext. */
  const navigate = useNavigate();
  const { isOpen, closeCart, items, subtotal, deliveryFee, total, updateQty, removeItem, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="drawer">
        <div className="drawer-header">
          <div style={{ fontWeight: 900 }}>Your cart</div>
          <Button variant="ghost" onClick={closeCart} aria-label="Close cart">
            Close
          </Button>
        </div>

        <div className="drawer-body">
          {!items.length ? (
            <div className="card card-pad">
              <div style={{ fontWeight: 800 }}>Cart is empty</div>
              <div className="subtle" style={{ marginTop: 6 }}>
                Add medicines from the catalog to continue.
              </div>
              <div style={{ marginTop: 12 }}>
                <Link to="/catalog" onClick={closeCart}>
                  <Button>Browse catalog</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid" style={{ gap: 10 }}>
              {items.map((x) => (
                <div key={x.product.id} className="card card-pad" style={{ padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 900, fontSize: 14 }}>{x.product.name}</div>
                      <div className="subtle" style={{ marginTop: 4 }}>
                        {formatCurrency(x.product.price)} • {x.product.manufacturer}
                      </div>
                    </div>
                    <Button variant="danger" onClick={() => removeItem(x.product.id)}>
                      Remove
                    </Button>
                  </div>

                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
                    <div className="label">Qty</div>
                    <input
                      className="input"
                      type="number"
                      min={1}
                      max={99}
                      value={x.qty}
                      onChange={(e) => updateQty(x.product.id, e.target.value)}
                      style={{ width: 110 }}
                    />
                    <div style={{ marginLeft: "auto", fontWeight: 900 }}>
                      {formatCurrency(Number(x.product.price || 0) * Number(x.qty || 0))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="drawer-footer">
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="subtle">Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="subtle">Delivery</span>
              <strong>{deliveryFee ? formatCurrency(deliveryFee) : "Free"}</strong>
            </div>
            <div className="hr" style={{ margin: "6px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 900 }}>Total</span>
              <span style={{ fontWeight: 900, fontSize: 18 }}>{formatCurrency(total)}</span>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Button
                onClick={() => {
                  closeCart();
                  navigate("/checkout");
                }}
                disabled={!items.length}
                style={{ flex: 1 }}
              >
                Checkout
              </Button>
              <Button variant="ghost" onClick={clearCart} disabled={!items.length}>
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Clicking backdrop closes */}
      <button
        onClick={closeCart}
        aria-label="Close cart backdrop"
        style={{
          position: "fixed",
          inset: 0,
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "default",
        }}
      />
    </div>
  );
}
