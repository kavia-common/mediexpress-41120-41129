import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import "../App.css";

// PUBLIC_INTERFACE
export function OrdersPage() {
  /** Orders index page (minimal), directs user to track by order id. */
  const { isAuthenticated } = useAuth();

  return (
    <div className="container">
      <div className="row wrap" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="h1">Orders</h1>
          <p className="p">Track your delivery status and updates.</p>
        </div>
        <Link className="btn btnGhost btnSm" to="/">Back</Link>
      </div>

      <div className="spacer" />

      <div className="card cardPad">
        <p className="alertTitle">Order tracking</p>
        <p className="small">
          {isAuthenticated
            ? "Enter an order ID to track it. In a full backend integration, your past orders would appear here."
            : "Login to keep orders connected to your account, or track using an order ID."}
        </p>
        <div className="spacer" />
        <Link className="btn btnPrimary" to="/orders/track">Track an order</Link>
      </div>
    </div>
  );
}
