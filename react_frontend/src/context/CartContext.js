import React, { createContext, useContext, useMemo, useReducer } from "react";

const CartContext = createContext(null);

function clampQty(qty) {
  if (Number.isNaN(qty)) return 1;
  return Math.max(1, Math.min(99, qty));
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product } = action.payload;
      const existing = state.items[product.id];
      const nextQty = clampQty((existing?.qty || 0) + 1);

      return {
        ...state,
        items: {
          ...state.items,
          [product.id]: { product, qty: nextQty }
        }
      };
    }

    case "REMOVE_ITEM": {
      const { productId } = action.payload;
      const nextItems = { ...state.items };
      delete nextItems[productId];
      return { ...state, items: nextItems };
    }

    case "SET_QTY": {
      const { productId, qty } = action.payload;
      const existing = state.items[productId];
      if (!existing) return state;

      const nextQty = clampQty(qty);
      return {
        ...state,
        items: {
          ...state.items,
          [productId]: { ...existing, qty: nextQty }
        }
      };
    }

    case "DECREMENT": {
      const { productId } = action.payload;
      const existing = state.items[productId];
      if (!existing) return state;

      const nextQty = existing.qty - 1;
      if (nextQty <= 0) {
        const nextItems = { ...state.items };
        delete nextItems[productId];
        return { ...state, items: nextItems };
      }

      return {
        ...state,
        items: {
          ...state.items,
          [productId]: { ...existing, qty: nextQty }
        }
      };
    }

    case "CLEAR": {
      return { ...state, items: {} };
    }

    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function CartProvider({ children }) {
  /** Provides cart state/actions to the application. */
  const [state, dispatch] = useReducer(cartReducer, { items: {} });

  const cartItems = useMemo(() => Object.values(state.items), [state.items]);

  const itemCount = useMemo(
    () => cartItems.reduce((sum, it) => sum + it.qty, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, it) => sum + it.qty * it.product.price, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      itemCount,
      subtotal,
      addItem: (product) => dispatch({ type: "ADD_ITEM", payload: { product } }),
      removeItem: (productId) => dispatch({ type: "REMOVE_ITEM", payload: { productId } }),
      setQty: (productId, qty) => dispatch({ type: "SET_QTY", payload: { productId, qty } }),
      increment: (productId) => dispatch({ type: "ADD_ITEM", payload: { product: state.items[productId]?.product } }),
      decrement: (productId) => dispatch({ type: "DECREMENT", payload: { productId } }),
      clear: () => dispatch({ type: "CLEAR" })
    }),
    [cartItems, itemCount, subtotal, state.items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// PUBLIC_INTERFACE
export function useCart() {
  /** Hook for consuming cart state/actions. */
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
