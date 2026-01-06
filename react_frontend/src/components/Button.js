import React from "react";

// PUBLIC_INTERFACE
export default function Button({ variant = "primary", className = "", ...props }) {
  /** Theme-consistent button with variants: primary, secondary, ghost, danger. */
  const variantClass =
    variant === "secondary"
      ? "btn btn-secondary"
      : variant === "ghost"
        ? "btn btn-ghost"
        : variant === "danger"
          ? "btn btn-danger"
          : "btn";

  return <button className={`${variantClass} ${className}`.trim()} {...props} />;
}
