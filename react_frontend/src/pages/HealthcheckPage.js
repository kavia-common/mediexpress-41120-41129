import React, { useEffect, useState } from "react";
import { fetchHealthcheck } from "../api/client";
import { getRuntimeConfig } from "../config/env";
import { LoadingBlock, StatusBlock } from "../components/StatusBlock";
import "../App.css";

// PUBLIC_INTERFACE
export function HealthcheckPage() {
  /** Basic healthcheck diagnostics view. */
  const cfg = getRuntimeConfig();
  const path = cfg.healthcheckPath;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    if (!path) return;

    setLoading(true);
    setError(null);
    fetchHealthcheck(path)
      .then((d) => {
        if (!alive) return;
        setData(d);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Healthcheck failed.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [path]);

  return (
    <div className="container">
      <h1 className="h1">Healthcheck</h1>
      <p className="p">Quick connectivity diagnostics for the configured backend.</p>

      <div className="spacer" />

      <div className="card cardPad">
        <div className="kv"><span className="kvLabel">API base</span><span className="kvValue">{cfg.apiBase || "(not set)"}</span></div>
        <div className="kv"><span className="kvLabel">Healthcheck path</span><span className="kvValue">{path || "(not set)"}</span></div>
        <div className="kv"><span className="kvLabel">WS URL</span><span className="kvValue">{cfg.wsUrl || "(not set)"}</span></div>
      </div>

      <div className="spacer" />

      {!path ? (
        <StatusBlock
          title="Healthcheck not configured"
          message="Set REACT_APP_HEALTHCHECK_PATH to enable live healthcheck calls."
        />
      ) : null}

      {loading ? <LoadingBlock message="Calling healthcheck…" /> : null}
      {error ? <StatusBlock variant="error" title="Healthcheck failed" message={error} /> : null}

      {data ? (
        <>
          <div className="spacer" />
          <div className="card cardPad">
            <p className="alertTitle">Response</p>
            <pre className="small" style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </>
      ) : null}
    </div>
  );
}
