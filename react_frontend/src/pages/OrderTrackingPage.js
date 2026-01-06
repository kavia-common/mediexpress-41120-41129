import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";

// PUBLIC_INTERFACE
export default function OrderTrackingPage() {
  /** Order tracking page (REST polling; WebSocket-ready). */
  const { id } = useParams();
  const { isAuthed } = useAuth();
  const { tracking, startTracking, stopTracking, wsUrl } = useOrders();

  useEffect(() => {
    if (!isAuthed || !id) return;
    startTracking(id);
    return () => stopTracking();
  }, [isAuthed, id, startTracking, stopTracking]);

  if (!isAuthed) {
    return (
      <div className="page">
        <div className="container">
          <div className="card card-pad">
            <div style={{ fontWeight: 900, fontSize: 16 }}>Login required</div>
            <div className="subtle" style={{ marginTop: 6 }}>
              Please login to track your order.
            </div>
            <div style={{ marginTop: 12 }}>
              <Link to="/auth">
                <Button>Go to login</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const status = tracking.orderId === id ? tracking.status : "Loading…";

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="h1">Track order</h1>
            <div className="subtle">
              Order ID: <strong>{id}</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/orders">
              <Button variant="ghost">Back to orders</Button>
            </Link>
            <Button variant="ghost" onClick={() => startTracking(id)}>
              Refresh
            </Button>
          </div>
        </div>

        <div className="card card-pad">
          {tracking.error ? (
            <div className="banner banner-error" role="alert" style={{ marginBottom: 12 }}>
              {tracking.error}
            </div>
          ) : null}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div className="label">Current status</div>
              <div style={{ fontWeight: 900, fontSize: 22, marginTop: 6 }}>{status}</div>
              <div className="subtle" style={{ marginTop: 6 }}>
                Last updated:{" "}
                {tracking.lastUpdated ? new Date(tracking.lastUpdated).toLocaleTimeString() : "—"} (auto-refreshes every 5s)
              </div>
            </div>

            <div className="badge" title="Tracking mode">
              <span className="badge-dot" style={{ background: wsUrl ? "var(--primary)" : "var(--secondary)" }} />
              {wsUrl ? "WebSocket-ready" : "Polling mode"}
            </div>
          </div>

          <div className="hr" />

          <div className="subtle">
            This page is structured to support real-time tracking via WebSockets in the future using <code>REACT_APP_WS_URL</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
