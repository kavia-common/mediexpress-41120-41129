import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const CART_KEY = "mediexpress_cart_v1";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function CartProvider({ children }) {
  /** Global cart provider with localStorage persistence. */
  const [items, setItems] = useState(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    persistCart(items);
  }, [items]);

  function openCart() {
    setIsOpen(true);
  }

  function closeCart() {
    setIsOpen(false);
  }

  function toggleCart() {
    setIsOpen((v) => !v);
  }

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const idx = prev.findIndex((x) => String(x.product.id) === String(product.id));
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Math.min(99, next[idx].qty + qty) };
        return next;
      }
      return [...prev, { product, qty: Math.min(99, Math.max(1, qty)) }];
    });
    setIsOpen(true);
  }

  function updateQty(productId, qty) {
    const q = Math.min(99, Math.max(1, Number(qty || 1)));
    setItems((prev) =>
      prev.map((x) => (String(x.product.id) === String(productId) ? { ...x, qty: q } : x))
    );
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((x) => String(x.product.id) !== String(productId)));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, x) => sum + Number(x.product.price || 0) * Number(x.qty || 0), 0);
  const itemCount = items.reduce((sum, x) => sum + Number(x.qty || 0), 0);

  // Simple fees (UI only)
  const deliveryFee = subtotal > 399 ? 0 : items.length ? 39 : 0;
  const total = subtotal + deliveryFee;

  const value = useMemo(
    () => ({
      items,
      isOpen,
      itemCount,
      subtotal,
      deliveryFee,
      total,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      updateQty,
      removeItem,
      clearCart,
    }),
    [items, isOpen, itemCount, subtotal, deliveryFee, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// PUBLIC_INTERFACE
export function useCart() {
  /** Hook to access cart state/actions. */
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
