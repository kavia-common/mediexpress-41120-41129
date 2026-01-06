import React, { useEffect, useMemo, useRef } from "react";
import { useCart } from "../context/CartContext";
import Button from "./Button";
import { useCurrency } from "../context/CurrencyContext";
import { formatInr, formatUsd, usdToInr } from "../utils/currency";
import { getLinePrices } from "../utils/pricing";
import { FALLBACK_MEDICINE_IMAGE } from "../data/medicines";

// PUBLIC_INTERFACE
export default function CartDrawer({ isOpen, onClose }) {
  /** Cart sidebar/drawer accessible globally. */
  const { cartItems, subtotal, increment, decrement, removeItem, clear } = useCart();
  const { rate } = useCurrency();
  const closeBtnRef = useRef(null);

  const subtotalInr = useMemo(() => usdToInr(subtotal, rate), [subtotal, rate]);

  useEffect(() => {
    if (!isOpen) return;

    // Focus management: focus close button when opening.
    closeBtnRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`drawerOverlay ${isOpen ? "drawerOverlayOpen" : ""}`}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
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
                      {formatInr(eachInr)} each{" "}
                      <span className="priceSecondary">({formatUsd(eachUsd)} USD)</span>
                    </p>

                    <div className="qtyRow" aria-label={`Quantity controls for ${product.name}`}>
                      <button
                        className="qtyBtn"
                        type="button"
                        onClick={() => decrement(product.id)}
                        aria-label="Decrease quantity"
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
                        aria-label="Increase quantity"
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

                    <Button variant="ghost" type="button" onClick={() => removeItem(product.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="drawerFooter">
          <div className="totalRow">
            <span>Subtotal</span>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.1 }}>
              <span className="totalPrimary">{formatInr(subtotalInr)}</span>
              <span className="totalSecondary">({formatUsd(subtotal)} USD)</span>
            </span>
          </div>

          <div className="drawerCtas">
            <Button
              variant="primary"
              type="button"
              onClick={() => {
                if (cartItems.length === 0) return;
                window.alert("Checkout is not implemented yet (mock UI).");
              }}
              disabled={cartItems.length === 0}
            >
              Checkout
            </Button>
            <Button variant="ghost" type="button" onClick={clear} disabled={cartItems.length === 0}>
              Clear
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
