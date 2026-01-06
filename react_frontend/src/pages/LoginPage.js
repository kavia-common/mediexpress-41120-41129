import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { StatusBlock } from "../components/StatusBlock";
import "../App.css";

// PUBLIC_INTERFACE
export function LoginPage() {
  /** User login page. */
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();
    clearError();
    try {
      await login({ email, password });
      navigate("/");
    } catch {
      // error already set
    }
  }

  return (
    <div className="container">
      <div className="row wrap" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="h1">Login</h1>
          <p className="p">Welcome back. Continue to your cart and orders.</p>
        </div>
        <Link className="btn btnGhost btnSm" to="/">Back</Link>
      </div>

      <div className="spacer" />

      <div className="card cardPad" style={{ maxWidth: 560 }}>
        {error ? <StatusBlock variant="error" title="Login failed" message={error} /> : null}
        <form onSubmit={submit} className="grid">
          <div>
            <label className="small" htmlFor="email">Email</label>
            <input id="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="small" htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btnPrimary btnBlock" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </button>

          <p className="small">
            New here? <Link to="/register" style={{ color: "var(--ocean-primary)", fontWeight: 800 }}>Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
