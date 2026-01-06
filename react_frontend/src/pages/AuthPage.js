import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function AuthPage() {
  /** Login/Register page with tab switch. */
  const navigate = useNavigate();
  const { isAuthed, authLoading, authError, login, register } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [localError, setLocalError] = useState("");

  if (isAuthed) {
    navigate("/");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLocalError("");

    if (!form.email || !form.password) {
      setLocalError("Please enter email and password.");
      return;
    }

    if (mode === "register" && !form.name.trim()) {
      setLocalError("Please enter your name.");
      return;
    }

    const res =
      mode === "login"
        ? await login({ email: form.email, password: form.password })
        : await register({ name: form.name, email: form.email, password: form.password });

    if (res.ok) navigate("/");
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="h1">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
            <div className="subtle" style={{ marginTop: 6 }}>
              Sign in to place orders and track deliveries.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Button variant={mode === "login" ? "primary" : "ghost"} onClick={() => setMode("login")}>
              Login
            </Button>
            <Button variant={mode === "register" ? "primary" : "ghost"} onClick={() => setMode("register")}>
              Register
            </Button>
          </div>
        </div>

        <div className="card card-pad" style={{ maxWidth: 520, margin: "0 auto" }}>
          {(localError || authError) ? (
            <div className="banner banner-error" role="alert" style={{ marginBottom: 12 }}>
              {localError || authError}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
            {mode === "register" ? (
              <Input
                label="Full name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
              />
            ) : null}

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
            />

            <div className="form-actions">
              <Button type="submit" disabled={authLoading}>
                {authLoading ? "Please wait…" : mode === "login" ? "Login" : "Create account"}
              </Button>
            </div>

            <div className="subtle">
              This frontend is API-ready. If the backend endpoints are unavailable, you may see graceful error messages.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
