import React from "react";

// PUBLIC_INTERFACE
export default function Button({
  variant = "default",
  className = "",
  children,
  ...props
}) {
  /** Reusable button that maps variants to global CSS classes. */
  const variantClass =
    variant === "primary"
      ? "btn btnPrimary"
      : variant === "secondary"
        ? "btn btnSecondary"
        : variant === "ghost"
          ? "btn btnGhost"
          : "btn";

  return (
    <button className={`${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
