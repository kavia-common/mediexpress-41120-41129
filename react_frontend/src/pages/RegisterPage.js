import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { StatusBlock } from "../components/StatusBlock";
import "../App.css";

// PUBLIC_INTERFACE
export function RegisterPage() {
  /** User registration page. */
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();
    clearError();
    try {
      await register({ name, email, password });
      navigate("/");
    } catch {
      // error already set
    }
  }

  return (
    <div className="container">
      <div className="row wrap" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="h1">Create account</h1>
          <p className="p">Register to checkout faster and track orders.</p>
        </div>
        <Link className="btn btnGhost btnSm" to="/">Back</Link>
      </div>

      <div className="spacer" />

      <div className="card cardPad" style={{ maxWidth: 560 }}>
        {error ? <StatusBlock variant="error" title="Registration failed" message={error} /> : null}
        <form onSubmit={submit} className="grid">
          <div>
            <label className="small" htmlFor="name">Full name</label>
            <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
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
              minLength={6}
              required
            />
          </div>

          <button className="btn btnPrimary btnBlock" type="submit" disabled={loading}>
            {loading ? "Creating…" : "Register"}
          </button>

          <p className="small">
            Already have an account? <Link to="/login" style={{ color: "var(--ocean-primary)", fontWeight: 800 }}>Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
