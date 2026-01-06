import React from "react";

// PUBLIC_INTERFACE
export default function Footer() {
  /** Simple footer with basic navigation hints. */
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footerInner">
        <div>© {new Date().getFullYear()} MedExpress (mock)</div>
        <div>
          Adjust mock products in <span className="kbd">src/data/medicines.js</span>
        </div>
      </div>
    </footer>
  );
}
