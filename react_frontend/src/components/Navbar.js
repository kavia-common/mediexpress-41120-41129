import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Button from "./Button";
import SearchBar from "./SearchBar";

// PUBLIC_INTERFACE
export default function Navbar({ currentPath, onOpenCart, onSearch }) {
  /** Top navigation bar shown on all pages. */
  const { itemCount } = useCart();

  const navClass = (path) => (currentPath === path ? "navLink navLinkActive" : "navLink");

  return (
    <header className="navbar" role="banner">
      <div className="container navbarInner">
        <Link to="/" className="brand" aria-label="Jashmedicine Home">
          <div className="brandMark" aria-hidden="true" />
          <div className="brandText">
            <div className="brandName">Jashmedicine</div>
            <div className="brandTagline">Pharmacy delivery, fast</div>
          </div>
        </Link>

        <nav className="navLinks" aria-label="Primary">
          <Link className={navClass("/")} to="/">
            Home
          </Link>
          <Link className={navClass("/products")} to="/products">
            Products
          </Link>
          <Link className={navClass("/track")} to="/track">
            Track Order
          </Link>
        </nav>

        <div className="navSpacer" />

        <SearchBar onSearch={onSearch} />

        <div className="navActions">
          <Button variant="ghost" type="button" onClick={() => window.alert("Login is not implemented yet.")}>
            Login
          </Button>

          <Button
            variant="primary"
            type="button"
            onClick={onOpenCart}
            aria-label={`Open cart${itemCount ? `, ${itemCount} items` : ""}`}
          >
            Cart <span className="badge" aria-label={`${itemCount} items in cart`}>{itemCount}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
