import React, { useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import { getRuntimeConfig } from "./config/env";
import { useFeatureFlags } from "./hooks/useFeatureFlags";

import { AuthProvider } from "./state/AuthContext";
import { CartProvider } from "./state/CartContext";

import { Navbar } from "./components/Navbar";
import { CartSidebar } from "./components/CartSidebar";

import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrdersPage } from "./pages/OrdersPage";
import { OrderTrackingPage } from "./pages/OrderTrackingPage";
import { HealthcheckPage } from "./pages/HealthcheckPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// PUBLIC_INTERFACE
function App() {
  /** Application entry component containing providers and routing. */
  const [cartOpen, setCartOpen] = useState(false);
  const cfg = useMemo(() => getRuntimeConfig(), []);
  const { experimentsEnabled, isEnabled } = useFeatureFlags();

  // Example experiment gating: enable subtle UI badge/route toggles based on flags.
  const showHealthcheck = Boolean(cfg.healthcheckPath) || isEnabled("healthcheck");
  const showExperimentsNote = experimentsEnabled && isEnabled("exp:showExperimentsNote");

  return (
    <div className="appShell">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar onOpenCart={() => setCartOpen(true)} />
            <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

            <main className="main">
              {showExperimentsNote ? (
                <div className="container">
                  <div className="alert">
                    <p className="alertTitle">Experiments enabled</p>
                    <p className="small">You are seeing experimental UI toggles based on feature flags.</p>
                  </div>
                  <div className="spacer" />
                </div>
              ) : null}

              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />

                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/track" element={<OrderTrackingPage />} />

                {showHealthcheck ? <Route path="/health" element={<HealthcheckPage />} /> : null}
                <Route path="/home" element={<Navigate to="/" replace />} />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
