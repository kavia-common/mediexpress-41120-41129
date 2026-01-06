import React, { createContext, useContext, useMemo, useState } from "react";
import { loadStoredAuth, loginApi, registerApi, storeAuth } from "../api/auth";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Global auth provider with token/user stored in localStorage. */
  const initial = loadStoredAuth();
  const [token, setToken] = useState(initial.token);
  const [user, setUser] = useState(initial.user);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const isAuthed = !!token;

  async function doLogin({ email, password }) {
    setAuthError("");
    setAuthLoading(true);
    const res = await loginApi({ email, password });
    setAuthLoading(false);

    if (!res.ok) {
      setAuthError(res.error || "Login failed.");
      return { ok: false, error: res.error };
    }

    const newToken = res.data?.token || "";
    const newUser = res.data?.user || { email };
    setToken(newToken);
    setUser(newUser);
    storeAuth({ token: newToken, user: newUser });
    return { ok: true };
  }

  async function doRegister({ name, email, password }) {
    setAuthError("");
    setAuthLoading(true);
    const res = await registerApi({ name, email, password });
    setAuthLoading(false);

    if (!res.ok) {
      setAuthError(res.error || "Registration failed.");
      return { ok: false, error: res.error };
    }

    const newToken = res.data?.token || "";
    const newUser = res.data?.user || { name, email };
    setToken(newToken);
    setUser(newUser);
    storeAuth({ token: newToken, user: newUser });
    return { ok: true };
  }

  function logout() {
    setToken("");
    setUser(null);
    storeAuth({ token: "", user: null });
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthed,
      authLoading,
      authError,
      login: doLogin,
      register: doRegister,
      logout,
    }),
    [token, user, isAuthed, authLoading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state/actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
