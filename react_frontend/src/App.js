import React, { useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";

import { CartProvider, useCart } from "./context/CartContext";

import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";

/**
 * Internal shell that needs router hooks (location/navigate).
 */
function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [navQuery, setNavQuery] = useState("");

  const activePath = location.pathname;

  const title = useMemo(() => {
    if (activePath === "/") return "Home";
    if (activePath === "/products") return "Products";
    if (activePath === "/track") return "Order Tracking";
    return "MedExpress";
  }, [activePath]);

  const handleSearch = (query) => {
    setNavQuery(query);

    // If user searches from anywhere, route to products and apply query.
    if (activePath !== "/products") {
      navigate("/products");
    }
  };

  return (
    <div className="appRoot">
      <a className="skipLink" href="#main">
        Skip to content
      </a>

      <Navbar
        currentPath={activePath}
        onOpenCart={() => setIsCartOpen(true)}
        onSearch={handleSearch}
        title={title}
      />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main id="main" className="appMain" role="main">
        <Routes>
          <Route path="/" element={<HomePage onCtaBrowse={() => navigate("/products")} />} />
          <Route path="/products" element={<ProductsPage externalQuery={navQuery} />} />
          <Route path="/track" element={<OrderTrackingPage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main application entry with providers.
   * Routing is handled client-side with react-router-dom.
   */
  return (
    <BrowserRouter>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
