import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext";
import "../App.css";

// PUBLIC_INTERFACE
export function Navbar({ onOpenCart }) {
  /** Top navigation bar with search, auth, and cart quick access. */
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const initialQ = useMemo(() => {
    // preserve q when navigating between catalog/home
    const q = searchParams.get("q");
    return q || "";
  }, [searchParams]);

  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    setQ(initialQ);
  }, [initialQ, location.pathname]);

  function submit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    navigate(`/catalog${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <div className="navbar">
      <div className="container">
        <div className="navInner">
          <Link className="brand" to="/">
            <span className="brandDot" aria-hidden="true" />
            MediExpress
          </Link>

          <div className="navGrow">
            <form onSubmit={submit} className="row" aria-label="Search medicines">
              <input
                className="input"
                placeholder="Search medicines, brands, categories…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search"
              />
              <button className="btn btnPrimary btnSm" type="submit">
                Search
              </button>
            </form>
          </div>

          <div className="navActions">
            <button className="btn btnGhost btnSm" type="button" onClick={onOpenCart} aria-label="Open cart sidebar">
              Cart <span className="cartCount" aria-label={`${itemCount} items in cart`}>{itemCount}</span>
            </button>

            {!isAuthenticated ? (
              <>
                <Link className="btn btnGhost btnSm" to="/login">Login</Link>
                <Link className="btn btnPrimary btnSm" to="/register">Register</Link>
              </>
            ) : (
              <div className="pill" aria-label="User menu">
                <span className="pillLabel">
                  {user?.name ? `Hi, ${user.name}` : (user?.email || "Signed in")}
                </span>
                <Link className="btn btnGhost btnSm" to="/orders">Orders</Link>
                <button className="btn btnDanger btnSm" type="button" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
