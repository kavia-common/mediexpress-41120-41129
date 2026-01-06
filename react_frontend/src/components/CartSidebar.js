import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../state/CartContext";
import "../App.css";

// PUBLIC_INTERFACE
export function CartSidebar({ open, onClose }) {
  /** Slide-in cart sidebar for quick updates and navigation to cart/checkout. */
  const { items, totals, setQuantity, removeFromCart } = useCart();

  if (!open) return null;

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Cart sidebar" onClick={onClose}>
      <div className="sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="sidebarHeader">
          <h3 className="sidebarTitle">Your cart</h3>
          <button className="btn btnGhost btnSm" type="button" onClick={onClose} aria-label="Close cart sidebar">
            Close
          </button>
        </div>

        <div className="sidebarBody">
          {items.length === 0 ? (
            <p className="small">Your cart is empty. Add a medicine to continue.</p>
          ) : (
            <div className="grid">
              {items.map((i) => (
                <div key={i.product.id} className="card cardPad">
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {i.product.name}
                      </div>
                      <div className="small">{i.product.category}{i.product.strength ? ` • ${i.product.strength}` : ""}</div>
                      <div className="price">₹{i.product.price}</div>
                    </div>
                    <button className="btn btnDanger btnSm" type="button" onClick={() => removeFromCart(i.product.id)}>
                      Remove
                    </button>
                  </div>

                  <div className="spacer" />
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <span className="small">Quantity</span>
                    <div className="row">
                      <button className="btn btnGhost btnSm" type="button" onClick={() => setQuantity(i.product.id, i.quantity - 1)}>-</button>
                      <span style={{ fontWeight: 900, minWidth: 24, textAlign: "center" }}>{i.quantity}</span>
                      <button className="btn btnGhost btnSm" type="button" onClick={() => setQuantity(i.product.id, i.quantity + 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sidebarFooter">
          <div className="kv">
            <span className="kvLabel">Subtotal</span>
            <span className="kvValue">₹{totals.subtotal}</span>
          </div>
          <div className="kv">
            <span className="kvLabel">Delivery</span>
            <span className="kvValue">{totals.delivery === 0 ? "Free" : `₹${totals.delivery}`}</span>
          </div>
          <hr className="hr" />
          <div className="kv">
            <span className="kvLabel">Total</span>
            <span className="kvValue">₹{totals.total}</span>
          </div>

          <div className="spacer" />
          <div className="row" style={{ justifyContent: "space-between" }}>
            <Link className="btn btnGhost btnSm" to="/cart" onClick={onClose}>View cart</Link>
            <Link className="btn btnPrimary btnSm" to="/checkout" onClick={onClose}>Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
