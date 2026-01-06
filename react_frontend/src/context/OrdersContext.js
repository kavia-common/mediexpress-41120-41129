import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getOrderApi, listOrdersApi, placeOrderApi } from "../api/orders";
import { getWsBaseUrl } from "../config";
import { useAuth } from "./AuthContext";

const OrdersContext = createContext(null);

// PUBLIC_INTERFACE
export function OrdersProvider({ children }) {
  /**
   * Global orders provider:
   * - listOrders(): fetches user's orders
   * - placeOrder(): creates a new order
   * - startTracking(orderId): starts polling loop (WebSocket-ready; uses REST polling today)
   */
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const [tracking, setTracking] = useState({ orderId: "", status: "", lastUpdated: 0, error: "" });
  const trackingTimer = useRef(null);

  const wsUrl = getWsBaseUrl(); // reserved for future live tracking

  async function listOrders() {
    setOrdersError("");
    setOrdersLoading(true);
    const res = await listOrdersApi({ token });
    setOrdersLoading(false);

    if (!res.ok) {
      setOrdersError(res.error || "Unable to load orders.");
      // keep old orders in UI
      return { ok: false, error: res.error };
    }

    setOrders(Array.isArray(res.data) ? res.data : res.data?.items || []);
    return { ok: true };
  }

  async function placeOrder(payload) {
    setOrdersError("");
    const res = await placeOrderApi({ token, payload });
    if (!res.ok) {
      setOrdersError(res.error || "Unable to place order.");
      return { ok: false, error: res.error };
    }

    const newOrder = res.data;
    setOrders((prev) => [newOrder, ...prev]);
    return { ok: true, order: newOrder };
  }

  async function pollOrder(orderId) {
    const res = await getOrderApi({ token, orderId });
    if (!res.ok) {
      setTracking((t) => ({ ...t, error: res.error || "Unable to track order.", lastUpdated: Date.now() }));
      return;
    }
    const status = res.data?.status || "Processing";
    setTracking({ orderId, status, lastUpdated: Date.now(), error: "" });
    // also update in list if present
    setOrders((prev) =>
      prev.map((o) => (String(o.id) === String(orderId) ? { ...o, status, ...res.data } : o))
    );
  }

  function stopTracking() {
    if (trackingTimer.current) {
      clearInterval(trackingTimer.current);
      trackingTimer.current = null;
    }
  }

  function startTracking(orderId) {
    stopTracking();
    setTracking({ orderId, status: "Loading…", lastUpdated: Date.now(), error: "" });

    // WebSocket-ready placeholder: if wsUrl exists we could connect here.
    // We keep REST polling as baseline behavior.
    void pollOrder(orderId);
    trackingTimer.current = setInterval(() => void pollOrder(orderId), 5000);
  }

  useEffect(() => {
    // Cleanup on unmount
    return () => stopTracking();
  }, []);

  const value = useMemo(
    () => ({
      orders,
      ordersLoading,
      ordersError,
      listOrders,
      placeOrder,
      tracking,
      startTracking,
      stopTracking,
      wsUrl,
    }),
    [orders, ordersLoading, ordersError, tracking, wsUrl]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

// PUBLIC_INTERFACE
export function useOrders() {
  /** Hook to access orders state/actions. */
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
