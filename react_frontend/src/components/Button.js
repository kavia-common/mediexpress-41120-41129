import React, { forwardRef } from "react";

// PUBLIC_INTERFACE
const Button = forwardRef(function Button(
  { variant = "default", className = "", children, ...props },
  ref
) {
  /** Reusable button that maps variants to global CSS classes. Supports refs for focus management. */
  const variantClass =
    variant === "primary"
      ? "btn btnPrimary"
      : variant === "secondary"
        ? "btn btnSecondary"
        : variant === "ghost"
          ? "btn btnGhost"
          : "btn";

  return (
    <button ref={ref} className={`${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
});

export default Button;
