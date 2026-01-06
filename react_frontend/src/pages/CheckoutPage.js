import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../api/client";
import { StatusBlock } from "../components/StatusBlock";
import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext";
import "../App.css";

// PUBLIC_INTERFACE
export function CheckoutPage() {
  /** Checkout flow with address/payment placeholder, creates an order and redirects to tracking. */
  const { token, isAuthenticated } = useAuth();
  const { items, totals, clearCart } = useCart();
  const navigate = useNavigate();

  const [addressLine1, setAddressLine1] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressPincode, setAddressPincode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canCheckout = useMemo(() => items.length > 0, [items.length]);

  async function submit(e) {
    e.preventDefault();
    setError(null);

    if (!canCheckout) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await createOrder({
        token: isAuthenticated ? token : null,
        cartItems: items,
        address: {
          line1: addressLine1,
          city: addressCity,
          pincode: addressPincode,
        },
        payment: { method: "placeholder" },
      });

      clearCart();
      navigate(`/orders/track?orderId=${encodeURIComponent(res.orderId)}`);
    } catch (e2) {
      setError(e2?.message || "Checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="row wrap" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="h1">Checkout</h1>
          <p className="p">Enter delivery details and place your order.</p>
        </div>
        <Link className="btn btnGhost btnSm" to="/cart">Back to cart</Link>
      </div>

      <div className="spacer" />

      {!canCheckout ? (
        <div className="card cardPad">
          <p className="alertTitle">Cart is empty</p>
          <p className="small">Add medicines first to checkout.</p>
          <div className="spacer" />
          <Link className="btn btnPrimary" to="/catalog">Browse catalog</Link>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "1.1fr 0.9fr", gap: 14 }}>
          <div className="card cardPad">
            {error ? <StatusBlock variant="error" title="Checkout error" message={error} /> : null}

            <form onSubmit={submit} className="grid">
              <div>
                <label className="small" htmlFor="line1">Address line</label>
                <input id="line1" className="input" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} required />
              </div>
              <div className="row wrap">
                <div style={{ flex: "1 1 220px" }}>
                  <label className="small" htmlFor="city">City</label>
                  <input id="city" className="input" value={addressCity} onChange={(e) => setAddressCity(e.target.value)} required />
                </div>
                <div style={{ width: 180 }}>
                  <label className="small" htmlFor="pincode">Pincode</label>
                  <input id="pincode" className="input" value={addressPincode} onChange={(e) => setAddressPincode(e.target.value)} required />
                </div>
              </div>

              <div className="alert">
                <p className="alertTitle">Payment</p>
                <p className="small">
                  Payment integration is a placeholder in this build. You can complete the order to test tracking.
                </p>
              </div>

              <button className="btn btnPrimary btnBlock" type="submit" disabled={loading}>
                {loading ? "Placing order…" : "Place order"}
              </button>

              {!isAuthenticated ? (
                <p className="small">
                  Tip: <Link to="/login" style={{ color: "var(--ocean-primary)", fontWeight: 900 }}>Login</Link> to view all orders in one place.
                </p>
              ) : null}
            </form>
          </div>

          <div className="card cardPad" style={{ alignSelf: "start" }}>
            <p className="alertTitle">Summary</p>
            <div className="spacer" />
            <div className="kv"><span className="kvLabel">Items</span><span className="kvValue">{items.length}</span></div>
            <div className="kv"><span className="kvLabel">Subtotal</span><span className="kvValue">₹{totals.subtotal}</span></div>
            <div className="kv"><span className="kvLabel">Delivery</span><span className="kvValue">{totals.delivery === 0 ? "Free" : `₹${totals.delivery}`}</span></div>
            <hr className="hr" />
            <div className="kv"><span className="kvLabel">Total</span><span className="kvValue">₹{totals.total}</span></div>
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
