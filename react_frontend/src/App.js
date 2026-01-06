import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import ConfigNoticeBanner from "./components/ConfigNoticeBanner";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";

import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AuthPage from "./pages/AuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import NotFoundPage from "./pages/NotFoundPage";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";

// PUBLIC_INTERFACE
function App() {
  /**
   * MediExpress SPA entry.
   * Provides routing + global state (auth/cart/orders) and themed layout.
   */
  return (
    <div className="app-shell">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <OrdersProvider>
              <Navbar />
              <ConfigNoticeBanner />
              <CartDrawer />

              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:id" element={<OrderTrackingPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>

              <footer className="container" style={{ padding: "18px 16px 26px" }}>
                <div className="subtle">
                  © {new Date().getFullYear()} MediExpress • Built with an Ocean Professional theme • API-ready frontend
                </div>
              </footer>
            </OrdersProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
