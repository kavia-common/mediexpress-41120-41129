import React from "react";
import Button from "./Button";

// PUBLIC_INTERFACE
export default function Pagination({ page, totalPages, onPageChange }) {
  /** Simple pagination control. */
  if (!totalPages || totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center", marginTop: 16 }}>
      <Button variant="ghost" onClick={() => onPageChange(page - 1)} disabled={prevDisabled}>
        Prev
      </Button>
      <span className="badge">
        Page <strong>{page}</strong> / {totalPages}
      </span>
      <Button variant="ghost" onClick={() => onPageChange(page + 1)} disabled={nextDisabled}>
        Next
      </Button>
    </div>
  );
}
