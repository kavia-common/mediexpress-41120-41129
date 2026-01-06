import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);

function calcTotals(items) {
  const subtotal = items.reduce((sum, i) => sum + i.quantity * (i.product.price || 0), 0);
  const delivery = subtotal > 499 ? 0 : items.length ? 49 : 0;
  const total = subtotal + delivery;
  return { subtotal, delivery, total };
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem("mediexpress_cart_v1");
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
    return { items: parsed.items };
  } catch {
    return { items: [] };
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem("mediexpress_cart_v1", JSON.stringify({ items: state.items }));
  } catch {
    // ignore
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { product, quantity } = action.payload;
      const q = Math.max(1, Number(quantity || 1));
      const idx = state.items.findIndex((i) => i.product.id === product.id);
      let items;
      if (idx >= 0) {
        items = state.items.map((i, n) => (n === idx ? { ...i, quantity: i.quantity + q } : i));
      } else {
        items = [...state.items, { product, quantity: q }];
      }
      return { ...state, items };
    }
    case "SET_QTY": {
      const { productId, quantity } = action.payload;
      const q = Math.max(0, Number(quantity || 0));
      const items = q === 0
        ? state.items.filter((i) => i.product.id !== productId)
        : state.items.map((i) => (i.product.id === productId ? { ...i, quantity: q } : i));
      return { ...state, items };
    }
    case "REMOVE": {
      const { productId } = action.payload;
      return { ...state, items: state.items.filter((i) => i.product.id !== productId) };
    }
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function CartProvider({ children }) {
  /** Provides cart state/actions across the application. */
  const [state, dispatch] = useReducer(reducer, undefined, loadFromStorage);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const totals = useMemo(() => calcTotals(state.items), [state.items]);

  const api = useMemo(() => {
    return {
      items: state.items,
      totals,
      itemCount: state.items.reduce((sum, i) => sum + i.quantity, 0),
      addToCart: (product, quantity = 1) => dispatch({ type: "ADD", payload: { product, quantity } }),
      setQuantity: (productId, quantity) => dispatch({ type: "SET_QTY", payload: { productId, quantity } }),
      removeFromCart: (productId) => dispatch({ type: "REMOVE", payload: { productId } }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.items, totals]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

// PUBLIC_INTERFACE
export function useCart() {
  /** Hook to access cart state/actions. */
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
