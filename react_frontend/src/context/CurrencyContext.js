import React, { createContext, useContext, useMemo, useState } from "react";
import { DEFAULT_USD_TO_INR_RATE } from "../utils/currency";

const CurrencyContext = createContext(null);

// PUBLIC_INTERFACE
export function CurrencyProvider({ children, defaultRate = DEFAULT_USD_TO_INR_RATE }) {
  /** Provides global currency rate state (USD→INR) to the application. */
  const [rate, setRate] = useState(defaultRate);

  const value = useMemo(() => ({ rate, setRate }), [rate]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

// PUBLIC_INTERFACE
export function useCurrency() {
  /** Hook for consuming currency rate state/actions. */
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}

