import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { formatCurrency } from "../utils/format";

// PUBLIC_INTERFACE
export default function CheckoutPage() {
  /** Checkout page to place an order (API-ready; graceful errors). */
  const navigate = useNavigate();
  const { isAuthed } = useAuth();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { placeOrder } = useOrders();

  const [form, setForm] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    pincode: "",
    paymentMethod: "cod",
  });
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const orderPayload = useMemo(
    () => ({
      items: items.map((x) => ({ productId: x.product.id, qty: x.qty, price: x.product.price })),
      pricing: { subtotal, deliveryFee, total },
      deliveryAddress: { ...form },
    }),
    [items, subtotal, deliveryFee, total, form]
  );

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }
    if (!form.addressLine1 || !form.city || !form.pincode) {
      setError("Please fill delivery address (line 1, city, pincode).");
      return;
    }
    if (!isAuthed) {
      setError("Please login to place an order.");
      navigate("/auth");
      return;
    }

    setPlacing(true);
    const res = await placeOrder(orderPayload);
    setPlacing(false);

    if (!res.ok) {
      setError(res.error || "Unable to place order. Please try again.");
      return;
    }

    clearCart();
    const orderId = res.order?.id || res.order?._id || "";
    navigate(orderId ? `/orders/${encodeURIComponent(orderId)}` : "/orders");
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="h1">Checkout</h1>
            <div className="subtle">Confirm delivery details and place your order</div>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 14 }}>
          <div className="card card-pad">
            {error ? (
              <div className="banner banner-error" role="alert" style={{ marginBottom: 12 }}>
                {error}
              </div>
            ) : null}

            <form onSubmit={submit} className="grid" style={{ gap: 12 }}>
              <Input
                label="Address line 1"
                value={form.addressLine1}
                onChange={(e) => setForm((f) => ({ ...f, addressLine1: e.target.value }))}
                placeholder="House no, Street"
              />
              <Input
                label="Address line 2 (optional)"
                value={form.addressLine2}
                onChange={(e) => setForm((f) => ({ ...f, addressLine2: e.target.value }))}
                placeholder="Landmark, Apartment"
              />
              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Input
                  label="City"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  placeholder="City"
                />
                <Input
                  label="Pincode"
                  value={form.pincode}
                  onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
                  placeholder="Pincode"
                />
              </div>

              <div className="form-row">
                <div className="label">Payment method</div>
                <select
                  className="select"
                  value={form.paymentMethod}
                  onChange={(e) => setForm((f) => ({ ...f, paymentMethod: e.target.value }))}
                >
                  <option value="cod">Cash on delivery</option>
                  <option value="upi">UPI (placeholder)</option>
                  <option value="card">Card (placeholder)</option>
                </select>
                <div className="subtle">Payment integrations can be added later; this UI is implementation-ready.</div>
              </div>

              <div className="form-actions">
                <Button type="button" variant="ghost" onClick={() => navigate("/catalog")}>
                  Add more items
                </Button>
                <Button type="submit" disabled={placing}>
                  {placing ? "Placing order…" : "Place order"}
                </Button>
              </div>
            </form>
          </div>

          <div className="card card-pad">
            <div style={{ fontWeight: 900, fontSize: 16 }}>Order summary</div>
            <div className="hr" />
            <div style={{ display: "grid", gap: 10 }}>
              {items.map((x) => (
                <div key={x.product.id} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 13 }}>{x.product.name}</div>
                    <div className="subtle">Qty {x.qty}</div>
                  </div>
                  <div style={{ fontWeight: 900 }}>{formatCurrency(x.product.price * x.qty)}</div>
                </div>
              ))}
            </div>

            <div className="hr" />
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="subtle">Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="subtle">Delivery</span>
                <strong>{deliveryFee ? formatCurrency(deliveryFee) : "Free"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 900 }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: 18 }}>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="subtle" style={{ marginTop: 12 }}>
              Tip: Orders over ₹399 get free delivery (UI demo rule).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
