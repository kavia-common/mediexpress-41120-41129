import React from "react";

// PUBLIC_INTERFACE
export default function Input({ label, hint, error, ...props }) {
  /** Theme-consistent input with optional label/hint/error. */
  return (
    <div className="form-row">
      {label ? <div className="label">{label}</div> : null}
      <input className="input" {...props} aria-invalid={!!error} />
      {hint ? <div className="subtle">{hint}</div> : null}
      {error ? (
        <div className="subtle" style={{ color: "var(--error)", fontWeight: 700 }}>
          {error}
        </div>
      ) : null}
    </div>
  );
}
