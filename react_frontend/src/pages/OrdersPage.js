import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";

// PUBLIC_INTERFACE
export default function OrdersPage() {
  /** Orders listing page. */
  const navigate = useNavigate();
  const { isAuthed } = useAuth();
  const { orders, ordersLoading, ordersError, listOrders } = useOrders();

  useEffect(() => {
    if (!isAuthed) return;
    void listOrders();
  }, [isAuthed, listOrders]);

  if (!isAuthed) {
    return (
      <div className="page">
        <div className="container">
          <div className="card card-pad">
            <div style={{ fontWeight: 900, fontSize: 16 }}>Login required</div>
            <div className="subtle" style={{ marginTop: 6 }}>
              Please login to view your orders and track deliveries.
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

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="h1">Your orders</h1>
            <div className="subtle">Track current orders and view past purchases</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button variant="ghost" onClick={() => void listOrders()} disabled={ordersLoading}>
              Refresh
            </Button>
            <Link to="/catalog">
              <Button>Shop now</Button>
            </Link>
          </div>
        </div>

        {ordersError ? (
          <div className="banner banner-error" role="alert" style={{ marginBottom: 12 }}>
            {ordersError}
          </div>
        ) : null}

        {ordersLoading ? (
          <div className="card card-pad">
            <div className="skel" style={{ height: 14, width: "60%", marginBottom: 10 }} />
            <div className="skel" style={{ height: 14, width: "45%", marginBottom: 10 }} />
            <div className="skel" style={{ height: 14, width: "55%" }} />
          </div>
        ) : !orders.length ? (
          <div className="card card-pad">
            <div style={{ fontWeight: 900, fontSize: 16 }}>No orders yet</div>
            <div className="subtle" style={{ marginTop: 6 }}>
              Place your first order from the catalog.
            </div>
            <div style={{ marginTop: 12 }}>
              <Link to="/catalog">
                <Button>Browse medicines</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid" style={{ gap: 10 }}>
            {orders.map((o) => (
              <div key={o.id || o._id} className="card card-pad" style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>
                      Order #{String(o.id || o._id || "").slice(-8).toUpperCase() || "—"}
                    </div>
                    <div className="subtle" style={{ marginTop: 4 }}>
                      Status: <strong>{o.status || "Processing"}</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <Button
                      variant="ghost"
                      onClick={() => navigate(`/orders/${encodeURIComponent(o.id || o._id)}`)}
                    >
                      Track
                    </Button>
                  </div>
                </div>

                {o.createdAt ? (
                  <div className="subtle" style={{ marginTop: 10 }}>
                    Placed: {new Date(o.createdAt).toLocaleString()}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
