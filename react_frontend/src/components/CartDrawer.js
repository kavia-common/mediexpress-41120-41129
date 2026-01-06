import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Button from "./Button";
import { useCurrency } from "../context/CurrencyContext";
import { formatInr, formatUsd, usdToInr } from "../utils/currency";
import { getLinePrices } from "../utils/pricing";
import { FALLBACK_MEDICINE_IMAGE } from "../data/medicines";
import { createOrder } from "../utils/orderService";

// PUBLIC_INTERFACE
export default function CartDrawer({ isOpen, onClose }) {
  /** Cart sidebar/drawer accessible globally. */
  const { cartItems, subtotal, increment, decrement, removeItem, clear } = useCart();
  const { rate } = useCurrency();
  const navigate = useNavigate();

  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);

  const [toast, setToast] = useState(null);

  const subtotalInr = useMemo(() => usdToInr(subtotal, rate), [subtotal, rate]);
  const hasItems = cartItems.length > 0;

  useEffect(() => {
    if (!isOpen) return;

    // Focus management: focus the drawer itself (dialog), so screen readers announce it.
    // Then, users can tab to the close button and controls naturally.
    drawerRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const placeOrder = () => {
    if (!hasItems) return;

    const order = createOrder(cartItems, {
      // Keep USD base subtotal and computed INR subtotal for consistent summary display.
      subtotalUsd: subtotal,
      subtotalInr,
      rate
    });

    clear();

    // Lightweight non-blocking confirmation message (inline toast).
    setToast({
      kind: "success",
      message: `Order placed: ${order.orderId}`
    });

    // Close the drawer so the tracking page is visible immediately.
    onClose?.();

    // Navigate to tracking page with orderId.
    navigate(`/track?orderId=${encodeURIComponent(order.orderId)}`);
  };

  return (
    <div
      className={`drawerOverlay ${isOpen ? "drawerOverlayOpen" : ""}`}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <aside
        ref={drawerRef}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
      >
        <div className="drawerHeader">
          <h2 className="drawerTitle">Your Cart</h2>
          <Button
            className="iconBtn"
            variant="ghost"
            type="button"
            onClick={onClose}
            ref={closeBtnRef}
            aria-label="Close cart"
          >
            ✕
          </Button>
        </div>

        <div className="drawerBody">
          {toast ? (
            <div
              className="surface"
              role="status"
              aria-live="polite"
              style={{
                padding: 12,
                marginBottom: 12,
                borderRadius: 16,
                borderColor: "rgba(245, 158, 11, 0.35)",
                background: "rgba(245, 158, 11, 0.10)"
              }}
            >
              <strong style={{ display: "block", marginBottom: 2 }}>Success</strong>
              <div className="p" style={{ margin: 0 }}>
                {toast.message}
              </div>
            </div>
          ) : null}

          {cartItems.length === 0 ? (
            <div className="surface gradientHero" style={{ padding: 16 }}>
              <p className="p" style={{ marginBottom: 10 }}>
                Your cart is empty. Add a medicine to get started.
              </p>
              <div className="p">Tip: Use the search bar to quickly find items.</div>
            </div>
          ) : (
            cartItems.map(({ product, qty }) => {
              const { eachInr, eachUsd, lineInr, lineUsd } = getLinePrices({ product, qty, rate });

              return (
                <div className="cartItem" key={product.id}>
                  <div className="cartThumb">
                    <img
                      src={product.image || product.imageUrl || FALLBACK_MEDICINE_IMAGE}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        // Avoid infinite loops; only swap to fallback once.
                        if (e.currentTarget.src !== FALLBACK_MEDICINE_IMAGE) {
                          e.currentTarget.src = FALLBACK_MEDICINE_IMAGE;
                        }
                      }}
                    />
                  </div>

                  <div>
                    <p className="cartItemTitle">{product.name}</p>
                    <p className="cartItemSub">
                      {formatInr(eachInr)} each <span className="priceSecondary">({formatUsd(eachUsd)} USD)</span>
                    </p>

                    <div className="qtyRow" aria-label={`Quantity controls for ${product.name}`}>
                      <button
                        className="qtyBtn"
                        type="button"
                        onClick={() => decrement(product.id)}
                        aria-label={`Decrease quantity for ${product.name}`}
                      >
                        −
                      </button>
                      <span className="qtyVal" aria-label={`Quantity ${qty}`}>
                        {qty}
                      </span>
                      <button
                        className="qtyBtn"
                        type="button"
                        onClick={() => increment(product.id)}
                        aria-label={`Increase quantity for ${product.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.15 }}>
                      <div className="price">{formatInr(lineInr)}</div>
                      <div className="priceSecondary">({formatUsd(lineUsd)} USD)</div>
                    </div>

                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => removeItem(product.id)}
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="drawerFooter">
          <div className="totalRow" aria-label="Cart total">
            <span>Total</span>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.1 }}>
              <span className="totalPrimary" aria-label={`Total in INR ${formatInr(subtotalInr)}`}>
                {formatInr(subtotalInr)}
              </span>
              <span className="totalSecondary" aria-label={`Total in USD ${formatUsd(subtotal)} USD`}>
                ({formatUsd(subtotal)} USD)
              </span>
            </span>
          </div>

          <div className="drawerCtas">
            <Button
              variant="primary"
              type="button"
              onClick={placeOrder}
              disabled={!hasItems}
              aria-label="Place order"
            >
              Order
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={clear}
              disabled={!hasItems}
              aria-label="Clear cart"
            >
              Clear
            </Button>
          </div>

          <p className="p" style={{ fontSize: 12, marginTop: 10 }}>
            Taxes & delivery fees (if any) are calculated at checkout. (Mock)
          </p>
        </div>
      </aside>
    </div>
  );
}
