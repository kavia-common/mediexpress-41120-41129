import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// PUBLIC_INTERFACE
export default function Navbar() {
  /** Top navigation bar with global search and quick actions. */
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthed, user, logout } = useAuth();
  const { itemCount, toggleCart } = useCart();

  const [search, setSearch] = useState("");

  // Keep search synced with query param on catalog route.
  const isCatalog = location.pathname.startsWith("/catalog");
  useEffect(() => {
    if (!isCatalog) return;
    const params = new URLSearchParams(location.search);
    setSearch(params.get("q") || "");
  }, [isCatalog, location.search]);

  const rightLabel = useMemo(() => {
    if (!isAuthed) return "Login";
    const name = user?.name || user?.email || "Account";
    return name.length > 18 ? `${name.slice(0, 18)}…` : name;
  }, [isAuthed, user]);

  function submitSearch(e) {
    e.preventDefault();
    navigate(`/catalog?q=${encodeURIComponent(search.trim())}`);
  }

  return (
    <div className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <NavLink to="/" className="brand" aria-label="MediExpress home">
            <div className="brand-mark">ME</div>
            <div>
              MediExpress
              <div className="subtle" style={{ marginTop: 2 }}>
                Pharmacy delivery
              </div>
            </div>
          </NavLink>

          <form className="searchbar" onSubmit={submitSearch} role="search" aria-label="Search medicines">
            <input
              className="input"
              placeholder="Search medicines (e.g., Paracetamol, Vitamin C)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" aria-label="Search">
              Search
            </Button>
          </form>

          <div className="nav-actions">
            <div className="nav-links" aria-label="Primary navigation">
              <NavLink
                to="/catalog"
                className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
              >
                Catalog
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
              >
                Orders
              </NavLink>
            </div>

            <Button variant="ghost" onClick={toggleCart} aria-label="Open cart">
              Cart ({itemCount})
            </Button>

            {!isAuthed ? (
              <NavLink to="/auth" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
                {rightLabel}
              </NavLink>
            ) : (
              <Button variant="ghost" onClick={logout} aria-label="Logout">
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
