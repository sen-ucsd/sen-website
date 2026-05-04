"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

interface Connection {
  id: string;
  google_email: string;
  expires_at: string | null;
}

/**
 * Pill-shaped widget for the admin header. Shows a "Connect Google Calendar"
 * call to action when the current user has no connection, or the connected
 * gmail with a small disconnect affordance when they do.
 */
export function CalendarConnectButton() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function load() {
    const supabase = getSupabaseBrowser();
    const { data } = await supabase
      .from("calendar_connections")
      .select("id, google_email, expires_at")
      .order("created_at", { ascending: true });
    setConnections((data ?? []) as Connection[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // Pick up ?calendar_connected= and ?calendar_error= from the OAuth callback.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("calendar_connected");
    const err = params.get("calendar_error");
    if (connected || err) {
      // Strip the params so refresh doesn't re-show them
      const url = new URL(window.location.href);
      url.searchParams.delete("calendar_connected");
      url.searchParams.delete("calendar_error");
      window.history.replaceState({}, "", url.toString());
      if (err) {
        // Lightweight visual cue; full toast system would be overkill here.
        console.warn("Calendar connect error:", err);
      }
      load();
    }
  }, []);

  async function disconnect(id: string) {
    setBusy(true);
    await fetch("/api/calendar/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBusy(false);
    load();
  }

  if (loading) {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px]"
        style={{
          border: "1px solid rgba(30, 42, 69, 1)",
          color: "rgba(240, 236, 228, 0.4)",
        }}
      >
        Loading calendar…
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <motion.a
        href="/api/calendar/connect"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] tracking-wide"
        style={{
          background: "rgba(212, 168, 67, 0.1)",
          border: "1px solid rgba(212, 168, 67, 0.4)",
          color: "#E8C97A",
          fontFamily: "var(--font-manrope)",
          fontWeight: 500,
        }}
      >
        <GoogleGlyph />
        <span>Connect Calendar</span>
      </motion.a>
    );
  }

  // Show first connection inline; if multiple, only the most recent + a count.
  const primary = connections[0];
  const extra = connections.length - 1;
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full pl-2.5 pr-1.5 py-1 text-[12px]"
      style={{
        background: "rgba(122, 200, 146, 0.08)",
        border: "1px solid rgba(122, 200, 146, 0.32)",
        color: "rgba(240, 236, 228, 0.85)",
        fontFamily: "var(--font-manrope)",
      }}
    >
      <span
        aria-hidden
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{
          background: "#7AC892",
          boxShadow: "0 0 6px rgba(122, 200, 146, 0.7)",
        }}
      />
      <span className="truncate max-w-[180px]">{primary.google_email}</span>
      {extra > 0 && (
        <span style={{ color: "rgba(240, 236, 228, 0.45)" }}>+{extra}</span>
      )}
      <button
        type="button"
        onClick={() => disconnect(primary.id)}
        disabled={busy}
        title="Disconnect this calendar"
        aria-label={`Disconnect ${primary.google_email}`}
        className="ml-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] transition-colors disabled:opacity-50"
        style={{
          background: "rgba(240, 236, 228, 0.06)",
          color: "rgba(240, 236, 228, 0.55)",
        }}
      >
        ×
      </button>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg
      aria-hidden
      width="13"
      height="13"
      viewBox="0 0 24 24"
      style={{ flexShrink: 0 }}
    >
      <path
        fill="currentColor"
        d="M21.35 11.1H12v3.9h5.36c-.23 1.37-1.65 4.02-5.36 4.02a5.92 5.92 0 110-11.84c1.85 0 3.1.79 3.81 1.47l2.6-2.5C16.74 4.7 14.62 3.7 12 3.7a8.3 8.3 0 100 16.6c4.78 0 7.95-3.36 7.95-8.1 0-.55-.06-1.05-.6-2.1z"
      />
    </svg>
  );
}
