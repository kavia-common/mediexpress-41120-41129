import React from "react";
import "../App.css";

// PUBLIC_INTERFACE
export function StatusBlock({ title, message, variant = "default", actions }) {
  /** Render a consistent status block for loading/errors/empty states. */
  const cls = `alert ${variant === "error" ? "alertError" : ""}`;
  return (
    <div className={cls} role={variant === "error" ? "alert" : "status"}>
      {title ? <p className="alertTitle">{title}</p> : null}
      {message ? <p className="small">{message}</p> : null}
      {actions ? <div className="spacer">{actions}</div> : null}
    </div>
  );
}

// PUBLIC_INTERFACE
export function LoadingBlock({ message = "Loading…" }) {
  /** Convenience loading state component. */
  return <StatusBlock title="Please wait" message={message} />;
}
