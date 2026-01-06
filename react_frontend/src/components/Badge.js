import React from "react";

// PUBLIC_INTERFACE
export default function Badge({ tone = "neutral", children }) {
  /** Small badge/tag used for availability and featured items. */
  const toneClass =
    tone === "success" ? "badge badgeSuccess" : tone === "error" ? "badge badgeError" : "badge";

  return <span className={toneClass}>{children}</span>;
}
