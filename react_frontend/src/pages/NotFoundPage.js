import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

// PUBLIC_INTERFACE
export default function NotFoundPage() {
  /** 404 route page. */
  return (
    <div className="page">
      <div className="container">
        <div className="card card-pad" style={{ textAlign: "center", padding: 24 }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Page not found</div>
          <div className="subtle" style={{ marginTop: 8 }}>
            The page you’re looking for doesn’t exist.
          </div>
          <div style={{ marginTop: 14 }}>
            <Link to="/">
              <Button>Go home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
