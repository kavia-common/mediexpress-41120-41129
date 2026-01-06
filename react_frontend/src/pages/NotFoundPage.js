import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

// PUBLIC_INTERFACE
export function NotFoundPage() {
  /** 404 page. */
  return (
    <div className="container">
      <div className="card cardPad">
        <h1 className="h1">Page not found</h1>
        <p className="p">The page you’re looking for doesn’t exist.</p>
        <div className="spacer" />
        <Link className="btn btnPrimary" to="/">Go home</Link>
      </div>
    </div>
  );
}
