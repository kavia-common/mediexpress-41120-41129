import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser } from "../api/client";

const AuthContext = createContext(null);

function loadAuth() {
  try {
    const raw = localStorage.getItem("mediexpress_auth_v1");
    if (!raw) return { token: null, user: null };
    const parsed = JSON.parse(raw);
    return { token: parsed?.token || null, user: parsed?.user || null };
  } catch {
    return { token: null, user: null };
  }
}

function saveAuth({ token, user }) {
  try {
    localStorage.setItem("mediexpress_auth_v1", JSON.stringify({ token, user }));
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides login/register/logout and user session state. */
  const initial = loadAuth();
  const [token, setToken] = useState(initial.token);
  const [user, setUser] = useState(initial.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    saveAuth({ token, user });
  }, [token, user]);

  const value = useMemo(() => {
    async function login({ email, password }) {
      setLoading(true);
      setError(null);
      try {
        const res = await loginUser({ email, password });
        setToken(res.token || null);
        setUser(res.user || { email });
        return res;
      } catch (e) {
        setError(e?.message || "Login failed");
        throw e;
      } finally {
        setLoading(false);
      }
    }

    async function register({ name, email, password }) {
      setLoading(true);
      setError(null);
      try {
        const res = await registerUser({ name, email, password });
        setToken(res.token || null);
        setUser(res.user || { name, email });
        return res;
      } catch (e) {
        setError(e?.message || "Registration failed");
        throw e;
      } finally {
        setLoading(false);
      }
    }

    function logout() {
      setToken(null);
      setUser(null);
      setError(null);
    }

    return {
      token,
      user,
      isAuthenticated: Boolean(token),
      loading,
      error,
      login,
      register,
      logout,
      clearError: () => setError(null),
    };
  }, [token, user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state/actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
