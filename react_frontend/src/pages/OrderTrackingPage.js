import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchOrder } from "../api/client";
import { getRuntimeConfig } from "../config/env";
import { LoadingBlock, StatusBlock } from "../components/StatusBlock";
import { useAuth } from "../state/AuthContext";
import "../App.css";

const DEFAULT_STEPS = [
  { key: "PLACED", title: "Order placed" },
  { key: "CONFIRMED", title: "Pharmacy confirmed" },
  { key: "PACKED", title: "Packed" },
  { key: "OUT_FOR_DELIVERY", title: "Out for delivery" },
  { key: "DELIVERED", title: "Delivered" },
];

function normalizeTimeline(order) {
  if (Array.isArray(order?.timeline) && order.timeline.length) {
    return order.timeline.map((t) => ({
      key: t.key || t.status || t.step || "UPDATE",
      title: t.title || t.message || t.status || "Update",
      at: t.at || t.time || t.createdAt || null,
    }));
  }
  // derive from status
  const status = String(order?.status || "").toUpperCase();
  const idx = DEFAULT_STEPS.findIndex((s) => s.key === status);
  const timeline = DEFAULT_STEPS.map((s, i) => ({
    key: s.key,
    title: s.title,
    at: i <= idx && idx >= 0 ? new Date(Date.now() - (idx - i) * 1000 * 60 * 8).toISOString() : null,
  }));
  return timeline;
}

function isStepActive(step, currentStatus) {
  const idxStep = DEFAULT_STEPS.findIndex((s) => s.key === step.key);
  const idxCurrent = DEFAULT_STEPS.findIndex((s) => s.key === currentStatus);
  if (idxStep < 0 || idxCurrent < 0) return false;
  return idxStep <= idxCurrent;
}

// PUBLIC_INTERFACE
export function OrderTrackingPage() {
  /** Track order status timeline; prefers WS updates if configured, otherwise polls API. */
  const { token } = useAuth();
  const cfg = getRuntimeConfig();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  const [input, setInput] = useState(orderId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [order, setOrder] = useState(null);
  const [source, setSource] = useState(null); // "ws" | "poll"
  const wsRef = useRef(null);
  const pollRef = useRef(null);

  const timeline = useMemo(() => (order ? normalizeTimeline(order) : []), [order]);
  const currentStatus = useMemo(() => String(order?.status || "").toUpperCase(), [order?.status]);

  async function load(id) {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrder({ token, orderId: id });
      setOrder(data);
    } catch (e) {
      setError(e?.message || "Failed to load order.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }

  // initial load
  useEffect(() => {
    if (orderId) load(orderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Setup live updates (WS if possible) once we have an orderId
  useEffect(() => {
    function cleanup() {
      if (wsRef.current) {
        try { wsRef.current.close(); } catch { /* ignore */ }
        wsRef.current = null;
      }
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }

    cleanup();

    if (!orderId) return cleanup;

    const wsUrl = cfg.wsUrl;
    if (wsUrl) {
      try {
        // We don't know the backend WS protocol; best-effort:
        // - connect
        // - send subscribe message if possible
        // - accept JSON messages that include orderId/status/timeline
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;
        setSource("ws");

        ws.onopen = () => {
          try {
            ws.send(JSON.stringify({ type: "subscribe", orderId }));
          } catch {
            // ignore
          }
        };

        ws.onmessage = (evt) => {
          try {
            const msg = JSON.parse(evt.data);
            const nextOrder = msg?.order ?? msg;
            const msgOrderId = String(nextOrder?.id ?? nextOrder?.orderId ?? "");
            if (msgOrderId && msgOrderId !== orderId) return;
            if (nextOrder && typeof nextOrder === "object") {
              setOrder((prev) => ({ ...(prev || {}), ...nextOrder }));
            }
          } catch {
            // ignore non-json
          }
        };

        ws.onerror = () => {
          // fallback to polling
          cleanup();
          pollRef.current = setInterval(() => load(orderId), 5000);
          setSource("poll");
        };

        ws.onclose = () => {
          // if closed unexpectedly, start polling
          if (!pollRef.current) {
            pollRef.current = setInterval(() => load(orderId), 5000);
            setSource("poll");
          }
        };

        return cleanup;
      } catch {
        // fallback polling
      }
    }

    pollRef.current = setInterval(() => load(orderId), 5000);
    setSource("poll");
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, cfg.wsUrl]);

  function submit(e) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (input) next.set("orderId", input);
    else next.delete("orderId");
    setSearchParams(next);
  }

  return (
    <div className="container">
      <div className="row wrap" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="h1">Order tracking</h1>
          <p className="p">See a status timeline and live updates when available.</p>
        </div>
        <Link className="btn btnGhost btnSm" to="/">Back</Link>
      </div>

      <div className="spacer" />

      <div className="card cardPad">
        <form onSubmit={submit} className="row wrap">
          <div style={{ flex: "1 1 280px" }}>
            <label className="small" htmlFor="orderId">Order ID</label>
            <input
              id="orderId"
              className="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 12345"
            />
          </div>
          <div style={{ alignSelf: "end" }}>
            <button className="btn btnPrimary" type="submit">Track</button>
          </div>
          <div style={{ alignSelf: "end" }}>
            <span className="badge">
              Updates: {source === "ws" ? "Live (WS)" : source === "poll" ? "Polling" : "—"}
            </span>
          </div>
        </form>
      </div>

      <div className="spacer" />

      {loading ? <LoadingBlock message="Fetching latest status…" /> : null}
      {error ? <StatusBlock variant="error" title="Unable to track order" message={error} /> : null}

      {order ? (
        <div className="grid" style={{ gridTemplateColumns: "1fr 0.9fr", gap: 14 }}>
          <div className="card cardPad">
            <p className="alertTitle">Timeline</p>
            <div className="spacer" />
            <div className="timeline">
              {timeline.map((t) => (
                <div key={`${t.key}-${t.at || ""}`} className="timelineItem">
                  <div className={`timelineDot ${isStepActive(t, currentStatus) ? "timelineDotActive" : ""}`} aria-hidden="true" />
                  <div>
                    <p className="timelineTitle">{t.title}</p>
                    <p className="timelineMeta">
                      {t.at ? new Date(t.at).toLocaleString() : "Pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card cardPad" style={{ alignSelf: "start" }}>
            <p className="alertTitle">Order details</p>
            <div className="spacer" />
            <div className="kv"><span className="kvLabel">Order ID</span><span className="kvValue">{String(order.id ?? order.orderId ?? orderId)}</span></div>
            <div className="kv"><span className="kvLabel">Current status</span><span className="kvValue">{currentStatus || "UNKNOWN"}</span></div>
            {order.updatedAt ? (
              <div className="kv"><span className="kvLabel">Updated</span><span className="kvValue">{new Date(order.updatedAt).toLocaleString()}</span></div>
            ) : null}
            <div className="spacer" />
            <p className="small">
              If WebSocket updates are enabled, you’ll see near real-time changes. Otherwise the page polls every ~5s.
            </p>
          </div>
        </div>
      ) : (
        !loading && !error ? <StatusBlock title="Enter an order ID" message="After checkout, you will be redirected here automatically." /> : null
      )}

      <style>{`
        @media (max-width: 980px) {
          .grid[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
