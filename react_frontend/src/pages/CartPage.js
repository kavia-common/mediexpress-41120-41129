import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../state/CartContext";
import "../App.css";

// PUBLIC_INTERFACE
export function CartPage() {
  /** Full cart page for reviewing items and proceeding to checkout. */
  const { items, totals, setQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="row wrap" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="h1">Cart</h1>
          <p className="p">Review quantities and checkout when ready.</p>
        </div>
        <div className="row wrap">
          <Link className="btn btnGhost btnSm" to="/catalog">Continue shopping</Link>
          {items.length ? (
            <button className="btn btnDanger btnSm" type="button" onClick={clearCart}>Clear cart</button>
          ) : null}
        </div>
      </div>

      <div className="spacer" />

      {items.length === 0 ? (
        <div className="card cardPad">
          <p className="alertTitle">Your cart is empty</p>
          <p className="small">Add a medicine from the catalog to proceed.</p>
          <div className="spacer" />
          <Link className="btn btnPrimary" to="/catalog">Browse catalog</Link>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "1.2fr 0.8fr", gap: 14 }}>
          <div className="grid">
            {items.map((i) => (
              <div key={i.product.id} className="card cardPad">
                <div className="row wrap" style={{ justifyContent: "space-between" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 900 }}>{i.product.name}</div>
                    <div className="small">{i.product.category}{i.product.strength ? ` • ${i.product.strength}` : ""}</div>
                    <div className="price">₹{i.product.price}</div>
                  </div>

                  <div className="row wrap" style={{ justifyContent: "flex-end" }}>
                    <button className="btn btnGhost btnSm" type="button" onClick={() => setQuantity(i.product.id, i.quantity - 1)}>-</button>
                    <span style={{ fontWeight: 900, minWidth: 30, textAlign: "center" }}>{i.quantity}</span>
                    <button className="btn btnGhost btnSm" type="button" onClick={() => setQuantity(i.product.id, i.quantity + 1)}>+</button>
                    <button className="btn btnDanger btnSm" type="button" onClick={() => removeFromCart(i.product.id)}>Remove</button>
                  </div>
                </div>

                <div className="spacer" />
                <div className="kv">
                  <span className="kvLabel">Item total</span>
                  <span className="kvValue">₹{i.quantity * i.product.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="card cardPad" style={{ alignSelf: "start" }}>
            <p className="alertTitle">Order summary</p>
            <div className="spacer" />
            <div className="kv"><span className="kvLabel">Subtotal</span><span className="kvValue">₹{totals.subtotal}</span></div>
            <div className="kv"><span className="kvLabel">Delivery</span><span className="kvValue">{totals.delivery === 0 ? "Free" : `₹${totals.delivery}`}</span></div>
            <hr className="hr" />
            <div className="kv"><span className="kvLabel">Total</span><span className="kvValue">₹{totals.total}</span></div>

            <div className="spacer" />
            <button className="btn btnPrimary btnBlock" type="button" onClick={() => navigate("/checkout")}>
              Proceed to checkout
            </button>
            <div className="spacer" />
            <p className="small">Free delivery for orders above ₹499.</p>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 980px) {
          .grid[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
