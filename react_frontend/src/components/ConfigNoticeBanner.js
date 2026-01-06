import React from "react";
import { getConfigIssues } from "../config";

// PUBLIC_INTERFACE
export default function ConfigNoticeBanner() {
  /** Displays non-blocking configuration warnings (missing API base URL, invalid WS URL). */
  const issues = getConfigIssues();
  if (!issues.length) return null;

  return (
    <div className="container" style={{ paddingTop: 10 }}>
      <div className="banner" role="status" aria-live="polite">
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Configuration notice</div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {issues.map((x) => (
            <li key={x} style={{ margin: "4px 0" }}>
              {x}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
