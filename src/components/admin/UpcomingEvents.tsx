"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChapterEvent {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  organizer_user_id: string | null;
  organizer_google_email: string | null;
  attendee_emails: string[];
  google_event_link: string | null;
  meet_link: string | null;
}

export interface UpcomingEventsHandle {
  refresh: () => void;
}

/**
 * Upcoming chapter events list. Rendered alongside the WBS so the board can
 * see what's been scheduled. Self-refreshes; the parent can also call
 * `refresh()` via the imperative handle right after a slot is scheduled.
 */
export const UpcomingEvents = forwardRef<UpcomingEventsHandle>(
  function UpcomingEvents(_, ref) {
    const [events, setEvents] = useState<ChapterEvent[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
      try {
        const res = await fetch("/api/calendar/events?limit=10");
        if (!res.ok) return;
        const data = (await res.json()) as { events: ChapterEvent[] };
        setEvents(data.events ?? []);
      } finally {
        setLoading(false);
      }
    }, []);

    useImperativeHandle(ref, () => ({ refresh }), [refresh]);

    useEffect(() => {
      refresh();
    }, [refresh]);

    if (loading) return null;
    if (events.length === 0) return null;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl"
        style={{
          background: "rgba(20, 27, 45, 0.55)",
          border: "1px solid rgba(30, 42, 69, 1)",
        }}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <span
              aria-hidden
              className="inline-block w-1 h-4"
              style={{
                background:
                  "linear-gradient(to bottom, #E8C97A 0%, rgba(160, 124, 46, 0.3) 100%)",
              }}
            />
            <span
              className="text-eyebrow"
              style={{ color: "rgba(232, 201, 122, 0.7)" }}
            >
              Upcoming
            </span>
            <span
              className="ml-auto text-[11px]"
              style={{ color: "rgba(240, 236, 228, 0.4)" }}
            >
              {events.length} scheduled
            </span>
          </div>

          <ul className="space-y-2">
            <AnimatePresence>
              {events.map((e) => (
                <EventRow key={e.id} event={e} onChange={refresh} />
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </motion.div>
    );
  }
);

function EventRow({
  event,
  onChange,
}: {
  event: ChapterEvent;
  onChange: () => void;
}) {
  const [busy, setBusy] = useState(false);

  const start = new Date(event.start_at);
  const end = new Date(event.end_at);
  const date = start.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeFmt = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const time = `${timeFmt.format(start)} – ${timeFmt.format(end)}`;

  async function cancel() {
    if (!confirm(`Cancel "${event.title}"? This removes it from the board only — Google Calendar still has the event unless you delete it there too.`))
      return;
    setBusy(true);
    await fetch(`/api/calendar/events?id=${event.id}`, { method: "DELETE" });
    setBusy(false);
    onChange();
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl px-3.5 py-3 flex items-start gap-3 group"
      style={{
        background: "rgba(5, 8, 22, 0.45)",
        border: "1px solid rgba(30, 42, 69, 1)",
      }}
    >
      <div
        className="shrink-0 w-12 sm:w-14 rounded-lg p-1.5 text-center"
        style={{
          background: "rgba(212, 168, 67, 0.08)",
          border: "1px solid rgba(212, 168, 67, 0.22)",
        }}
      >
        <div
          className="text-[10px] tracking-[0.18em] uppercase"
          style={{ color: "rgba(232, 201, 122, 0.7)" }}
        >
          {start.toLocaleDateString("en-US", { month: "short" })}
        </div>
        <div
          className="font-display text-[20px] leading-none mt-0.5"
          style={{
            color: "#F0ECE4",
            fontFamily: "var(--font-newsreader)",
            fontWeight: 500,
          }}
        >
          {start.getDate()}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div
          className="text-[14px] truncate"
          style={{
            color: "#F0ECE4",
            fontFamily: "var(--font-manrope)",
            fontWeight: 500,
          }}
        >
          {event.title}
        </div>
        <div
          className="text-[12px] mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5"
          style={{ color: "rgba(240, 236, 228, 0.55)" }}
        >
          <span>{date}</span>
          <span aria-hidden style={{ color: "rgba(240, 236, 228, 0.25)" }}>·</span>
          <span>{time}</span>
          {event.attendee_emails.length > 0 && (
            <>
              <span aria-hidden style={{ color: "rgba(240, 236, 228, 0.25)" }}>·</span>
              <span>{event.attendee_emails.length} attendee{event.attendee_emails.length === 1 ? "" : "s"}</span>
            </>
          )}
        </div>
        {(event.google_event_link || event.meet_link) && (
          <div className="mt-1.5 flex flex-wrap gap-2 text-[11.5px]">
            {event.google_event_link && (
              <a
                href={event.google_event_link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
                style={{ color: "rgba(232, 201, 122, 0.85)" }}
              >
                Open in Calendar →
              </a>
            )}
            {event.meet_link && (
              <a
                href={event.meet_link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
                style={{ color: "rgba(232, 201, 122, 0.85)" }}
              >
                Join Meet →
              </a>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={cancel}
        disabled={busy}
        className="shrink-0 self-start opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center w-6 h-6 rounded-full text-[12px] disabled:opacity-50"
        style={{
          background: "rgba(232, 140, 122, 0.08)",
          border: "1px solid rgba(232, 140, 122, 0.3)",
          color: "rgba(232, 140, 122, 0.85)",
        }}
        title="Remove from board"
        aria-label="Remove from board"
      >
        ×
      </button>
    </motion.li>
  );
}
