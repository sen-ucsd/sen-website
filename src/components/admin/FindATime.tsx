"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

interface ParticipantResult {
  displayName: string;
  status: "ok" | "not_connected" | "error";
  googleEmail?: string;
  error?: string;
}

interface Slot {
  start: string;
  end: string;
}

interface FreeBusyResponse {
  participants: ParticipantResult[];
  slots: Slot[];
}

const DURATION_OPTIONS = [
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hr" },
  { value: 90, label: "1.5 hr" },
  { value: 120, label: "2 hr" },
];

const RANGE_OPTIONS = [
  { value: 7, label: "Next 7 days" },
  { value: 14, label: "Next 14 days" },
  { value: 30, label: "Next 30 days" },
];

/**
 * "Find a time" panel. Pulls the live profiles list, lets the admin pick which
 * board members to consider, then asks /api/calendar/freebusy for mutual
 * availability inside working hours.
 */
export function FindATime({ onScheduled }: { onScheduled?: () => void } = {}) {
  const [profiles, setProfiles] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [duration, setDuration] = useState(60);
  const [rangeDays, setRangeDays] = useState(14);
  const [startHour, setStartHour] = useState(10);
  const [endHour, setEndHour] = useState(20);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<FreeBusyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [schedulingSlot, setSchedulingSlot] = useState<Slot | null>(null);
  const [scheduledMessage, setScheduledMessage] = useState<string | null>(null);

  const tz =
    (typeof Intl !== "undefined" &&
      Intl.DateTimeFormat().resolvedOptions().timeZone) ||
    "America/Los_Angeles";

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowser();
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("chapter_id", "san-diego")
        .order("display_name", { ascending: true });
      setProfiles(
        (data ?? []).map((p: { display_name: string }) => p.display_name)
      );
    }
    load();
  }, []);

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  async function handleSubmit() {
    if (selected.size === 0) {
      setError("Pick at least one person.");
      return;
    }
    setPending(true);
    setError(null);
    setResult(null);
    const now = new Date();
    const min = now.toISOString();
    const max = new Date(
      now.getTime() + rangeDays * 24 * 3_600_000
    ).toISOString();
    try {
      const res = await fetch("/api/calendar/freebusy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantDisplayNames: Array.from(selected),
          timeMin: min,
          timeMax: max,
          durationMinutes: duration,
          workingHours: { startHour, endHour },
          timeZone: tz,
        }),
      });
      const data = (await res.json()) as FreeBusyResponse | { error?: string };
      if (!res.ok || "error" in data) {
        const msg =
          "error" in data && typeof data.error === "string"
            ? data.error
            : "Something went wrong.";
        setError(msg);
        setPending(false);
        return;
      }
      setResult(data as FreeBusyResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setPending(false);
  }

  const grouped = useMemo(() => groupSlotsByDay(result?.slots ?? [], tz), [
    result,
    tz,
  ]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl"
      style={{
        background:
          "radial-gradient(circle at 30% 0%, rgba(212, 168, 67, 0.06) 0%, transparent 60%), rgba(20, 27, 45, 0.55)",
        border: "1px solid rgba(30, 42, 69, 1)",
      }}
    >
      <div className="p-5 sm:p-6 md:p-7">
        <div className="flex items-center gap-3 mb-1">
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
            Find a time
          </span>
        </div>
        <p
          className="text-[13px] mt-1 max-w-2xl"
          style={{ color: "rgba(240, 236, 228, 0.5)" }}
        >
          Pick board members and a window. We'll show slots when everyone is
          free inside working hours, pulled live from Google Calendar.
        </p>

        {/* People */}
        <div className="mt-5">
          <Label>People</Label>
          {profiles.length === 0 ? (
            <p
              className="text-[12px] italic mt-1"
              style={{ color: "rgba(240, 236, 228, 0.35)" }}
            >
              No board members yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {profiles.map((p) => {
                const on = selected.has(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggle(p)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] transition-colors"
                    style={{
                      background: on
                        ? "rgba(212, 168, 67, 0.14)"
                        : "rgba(20, 27, 45, 0.55)",
                      border: `1px solid ${
                        on
                          ? "rgba(212, 168, 67, 0.5)"
                          : "rgba(30, 42, 69, 1)"
                      }`,
                      color: on ? "#E8C97A" : "rgba(240, 236, 228, 0.7)",
                      fontFamily: "var(--font-manrope)",
                    }}
                  >
                    <span
                      aria-hidden
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px]"
                      style={{
                        background: on
                          ? "rgba(212, 168, 67, 0.25)"
                          : "rgba(212, 168, 67, 0.12)",
                        color: "#E8C97A",
                        fontFamily: "var(--font-newsreader)",
                        fontWeight: 600,
                      }}
                    >
                      {p.charAt(0)}
                    </span>
                    {p}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Knobs */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Knob label="Duration">
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className={selectClass}
              style={selectStyle}
            >
              {DURATION_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </Knob>
          <Knob label="Window">
            <select
              value={rangeDays}
              onChange={(e) => setRangeDays(Number(e.target.value))}
              className={selectClass}
              style={selectStyle}
            >
              {RANGE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </Knob>
          <Knob label="Start">
            <select
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
              className={selectClass}
              style={selectStyle}
            >
              {Array.from({ length: 24 }).map((_, h) => (
                <option key={h} value={h}>
                  {hourLabel(h)}
                </option>
              ))}
            </select>
          </Knob>
          <Knob label="End">
            <select
              value={endHour}
              onChange={(e) => setEndHour(Number(e.target.value))}
              className={selectClass}
              style={selectStyle}
            >
              {Array.from({ length: 24 }).map((_, h) => (
                <option key={h} value={h}>
                  {hourLabel(h)}
                </option>
              ))}
            </select>
          </Knob>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={pending || selected.size === 0}
            whileHover={
              !pending && selected.size > 0
                ? { scale: 1.02, boxShadow: "0 0 20px rgba(212,168,67,0.25)" }
                : undefined
            }
            whileTap={!pending && selected.size > 0 ? { scale: 0.98 } : undefined}
            className="rounded-full px-5 py-2 text-[13px] tracking-wide font-display disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "#D4A843", color: "#050816", fontWeight: 500 }}
          >
            {pending ? "Looking for a time…" : "Find availability"}
          </motion.button>
          {error && (
            <span className="text-[13px]" style={{ color: "#E8A35E" }}>
              {error}
            </span>
          )}
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-6 pt-5"
              style={{ borderTop: "1px solid rgba(30, 42, 69, 1)" }}
            >
              <ParticipantSummary participants={result.participants} />

              {result.slots.length === 0 ? (
                <p
                  className="mt-4 text-[14px] leading-[1.65]"
                  style={{ color: "rgba(240, 236, 228, 0.55)" }}
                >
                  No mutual free windows found in this range. Try a wider window
                  or a shorter duration.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {Array.from(grouped.entries()).map(([day, slots]) => (
                    <div key={day}>
                      <div
                        className="text-[11px] tracking-[0.18em] uppercase mb-2"
                        style={{ color: "rgba(232, 201, 122, 0.7)" }}
                      >
                        {day}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {slots.map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSchedulingSlot(s)}
                            className="inline-block rounded-full px-3 py-1 text-[12px] transition-colors hover:bg-[rgba(212,168,67,0.16)]"
                            style={{
                              background: "rgba(212, 168, 67, 0.07)",
                              border: "1px solid rgba(212, 168, 67, 0.28)",
                              color: "rgba(240, 236, 228, 0.92)",
                              fontFamily: "var(--font-manrope)",
                              cursor: "pointer",
                            }}
                            title="Click to schedule this slot"
                          >
                            {formatRange(s.start, s.end, tz)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {scheduledMessage && (
          <div
            className="mt-5 rounded-lg p-3 text-[13px]"
            style={{
              background: "rgba(122, 200, 146, 0.08)",
              border: "1px solid rgba(122, 200, 146, 0.32)",
              color: "rgba(240, 236, 228, 0.85)",
            }}
            role="status"
          >
            {scheduledMessage}
          </div>
        )}
      </div>

      <ScheduleSlotModal
        slot={schedulingSlot}
        durationMinutes={duration}
        attendeeDisplayNames={Array.from(selected)}
        timeZone={tz}
        onClose={() => setSchedulingSlot(null)}
        onScheduled={(msg) => {
          setSchedulingSlot(null);
          setScheduledMessage(msg);
          onScheduled?.();
        }}
      />
    </motion.div>
  );
}

function ScheduleSlotModal({
  slot,
  durationMinutes,
  attendeeDisplayNames,
  timeZone,
  onClose,
  onScheduled,
}: {
  slot: Slot | null;
  durationMinutes: number;
  attendeeDisplayNames: string[];
  timeZone: string;
  onClose: () => void;
  onScheduled: (msg: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [withMeet, setWithMeet] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Selected start time inside the free window. The user drags to position
  // a duration-sized block; we book exactly that range, not the whole window.
  const [selectedStartMs, setSelectedStartMs] = useState<number | null>(null);

  useEffect(() => {
    setTitle("");
    setDescription("");
    setError(null);
    if (slot) setSelectedStartMs(new Date(slot.start).getTime());
    else setSelectedStartMs(null);
  }, [slot]);

  useEffect(() => {
    if (!slot) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slot, onClose]);

  if (!slot) return null;

  const durationMs = durationMinutes * 60_000;
  const freeStartMs = new Date(slot.start).getTime();
  const freeEndMs = new Date(slot.end).getTime();
  const startMs = selectedStartMs ?? freeStartMs;
  const endMs = startMs + durationMs;

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (!slot) return;
    if (!title.trim()) {
      setError("Give the event a title.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/calendar/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendeeDisplayNames,
          title: title.trim(),
          description: description.trim() || undefined,
          startIso: new Date(startMs).toISOString(),
          endIso: new Date(endMs).toISOString(),
          timeZone,
          withMeet,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        if (data.error === "scope_missing") {
          setError(
            "Your calendar connection needs the new write scope. Disconnect and reconnect once, then try again."
          );
        } else if (data.error === "organizer_not_connected") {
          setError("Connect your own Google Calendar before scheduling.");
        } else {
          setError(data.detail || data.error || "Couldn't schedule.");
        }
        setPending(false);
        return;
      }
      const notConnected: string[] = data.notConnected ?? [];
      const lines = [
        `Scheduled. Invitations went out to ${data.invitedEmails.length} attendee(s).`,
      ];
      if (notConnected.length > 0) {
        lines.push(
          `Note: ${notConnected.join(
            ", "
          )} aren't connected to Google Calendar so they were skipped.`
        );
      }
      if (data.meetLink) {
        lines.push(`Meet link: ${data.meetLink}`);
      }
      onScheduled(lines.join(" "));
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : String(e2));
      setPending(false);
    }
  }

  const startDate = new Date(startMs);
  const endDate = new Date(endMs);
  const dayLabel = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(startDate);
  const timeFmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const timeLabel = `${timeFmt.format(startDate)} – ${timeFmt.format(endDate)}`;
  const freeWindowLabel = `${timeFmt.format(
    new Date(freeStartMs)
  )} – ${timeFmt.format(new Date(freeEndMs))}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: "rgba(5, 8, 22, 0.78)", backdropFilter: "blur(8px)" }}
      >
        <motion.form
          onSubmit={handleSchedule}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md rounded-2xl"
          style={{
            background: "#0A0E1A",
            border: "1px solid rgba(212, 168, 67, 0.32)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          }}
        >
          <div className="p-6 sm:p-7">
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
                Schedule this slot
              </span>
            </div>
            <p
              className="text-[15px] leading-[1.5] mb-1"
              style={{ color: "rgba(240, 236, 228, 0.85)" }}
            >
              {dayLabel}
            </p>
            <p
              className="font-display text-[20px]"
              style={{
                color: "#E8C97A",
                fontFamily: "var(--font-newsreader)",
                fontWeight: 500,
              }}
            >
              {timeLabel}
            </p>
            <p
              className="text-[12px] mt-2"
              style={{ color: "rgba(240, 236, 228, 0.5)" }}
            >
              Everyone's free between {freeWindowLabel}. Drag the gold block
              below to choose a {durationMinutes}-minute window inside it.
            </p>

            <DurationPicker
              freeStartMs={freeStartMs}
              freeEndMs={freeEndMs}
              durationMs={durationMs}
              startMs={startMs}
              onChange={setSelectedStartMs}
              timeZone={timeZone}
            />

            <p
              className="text-[12px] mt-3"
              style={{ color: "rgba(240, 236, 228, 0.5)" }}
            >
              Inviting{" "}
              {attendeeDisplayNames.length > 0
                ? attendeeDisplayNames.join(", ")
                : "you (no other attendees)"}
              .
            </p>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span
                  className="text-[12px] tracking-wide block mb-2"
                  style={{ color: "rgba(240, 236, 228, 0.55)" }}
                >
                  Title
                </span>
                <input
                  autoFocus
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Board sync"
                  className="w-full rounded-lg px-3.5 py-2.5 outline-none text-[14px]"
                  style={{
                    background: "rgba(20, 27, 45, 0.55)",
                    border: "1px solid rgba(30, 42, 69, 1)",
                    color: "#F0ECE4",
                    fontFamily: "var(--font-manrope)",
                  }}
                />
              </label>
              <label className="block">
                <span
                  className="text-[12px] tracking-wide block mb-2"
                  style={{ color: "rgba(240, 236, 228, 0.55)" }}
                >
                  Description (optional)
                </span>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's the agenda?"
                  className="w-full rounded-lg px-3.5 py-2.5 outline-none text-[13.5px] resize-none"
                  style={{
                    background: "rgba(20, 27, 45, 0.55)",
                    border: "1px solid rgba(30, 42, 69, 1)",
                    color: "#F0ECE4",
                    fontFamily: "var(--font-manrope)",
                  }}
                />
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={withMeet}
                  onChange={(e) => setWithMeet(e.target.checked)}
                  className="appearance-none w-4 h-4 rounded relative"
                  style={{
                    background: withMeet
                      ? "#D4A843"
                      : "rgba(20, 27, 45, 0.55)",
                    border: `1px solid ${
                      withMeet
                        ? "#D4A843"
                        : "rgba(30, 42, 69, 1)"
                    }`,
                  }}
                />
                <span
                  className="text-[13px]"
                  style={{ color: "rgba(240, 236, 228, 0.7)" }}
                >
                  Add a Google Meet link
                </span>
              </label>
            </div>

            {error && (
              <p
                className="mt-4 text-[13px]"
                style={{ color: "#E8A35E" }}
                role="alert"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={pending}
                className="rounded-full px-4 py-2 text-[12px] tracking-wide disabled:opacity-50"
                style={{
                  border: "1px solid rgba(30, 42, 69, 1)",
                  color: "rgba(240, 236, 228, 0.7)",
                }}
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={pending || !title.trim()}
                whileHover={
                  !pending && title.trim()
                    ? { scale: 1.02, boxShadow: "0 0 24px rgba(212,168,67,0.3)" }
                    : undefined
                }
                whileTap={
                  !pending && title.trim() ? { scale: 0.98 } : undefined
                }
                className="rounded-full px-5 py-2 text-[13px] tracking-wide font-display disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "#D4A843",
                  color: "#050816",
                  fontWeight: 500,
                }}
              >
                {pending ? "Scheduling…" : "Schedule"}
              </motion.button>
            </div>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}

function ParticipantSummary({
  participants,
}: {
  participants: ParticipantResult[];
}) {
  const notConnected = participants.filter((p) => p.status === "not_connected");
  const errored = participants.filter((p) => p.status === "error");
  if (notConnected.length === 0 && errored.length === 0) return null;

  // Detect the "old token doesn't have read scope" case so we can give a
  // useful nudge instead of just dumping the raw 403 string.
  const looksLikeScopeIssue = errored.some((p) => {
    const msg = (p.error ?? "").toLowerCase();
    return (
      msg.includes("403") ||
      msg.includes("insufficient") ||
      msg.includes("invalid_grant")
    );
  });

  return (
    <div className="space-y-2 mb-2">
      {notConnected.length > 0 && (
        <p className="text-[12px]" style={{ color: "rgba(240, 236, 228, 0.5)" }}>
          Not yet connected to Google Calendar:{" "}
          <strong style={{ color: "#E8A35E" }}>
            {notConnected.map((p) => p.displayName).join(", ")}
          </strong>
          . They'll need to connect from their own admin login.
        </p>
      )}
      {errored.length > 0 && (
        <div className="space-y-1">
          <p className="text-[12px]" style={{ color: "#E8A35E" }}>
            Couldn't reach calendar for{" "}
            {errored.map((p) => p.displayName).join(", ")}.
          </p>
          {looksLikeScopeIssue ? (
            <p
              className="text-[11.5px] leading-[1.55]"
              style={{ color: "rgba(240, 236, 228, 0.55)" }}
            >
              The connection looks like it doesn't have the read scope yet.
              Disconnect (× on the Calendar pill in the header) and reconnect
              once — the new consent screen will request both read and write
              access.
            </p>
          ) : (
            errored
              .filter((p) => p.error)
              .map((p, i) => (
                <p
                  key={i}
                  className="text-[11px] leading-[1.55] font-mono"
                  style={{ color: "rgba(240, 236, 228, 0.4)" }}
                >
                  {p.displayName}: {p.error}
                </p>
              ))
          )}
        </div>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] tracking-[0.18em] uppercase"
      style={{ color: "rgba(232, 201, 122, 0.55)" }}
    >
      {children}
    </span>
  );
}

function Knob({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="text-[11px] tracking-wide block mb-1.5"
        style={{ color: "rgba(240, 236, 228, 0.5)" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const selectClass =
  "w-full rounded-lg px-3 py-2 outline-none text-[13px] focus:border-[rgba(212,168,67,0.45)]";
const selectStyle: React.CSSProperties = {
  background: "rgba(20, 27, 45, 0.55)",
  border: "1px solid rgba(30, 42, 69, 1)",
  color: "#F0ECE4",
  fontFamily: "var(--font-manrope)",
};

function hourLabel(h: number): string {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function groupSlotsByDay(slots: Slot[], tz: string): Map<string, Slot[]> {
  const map = new Map<string, Slot[]>();
  for (const s of slots) {
    const key = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(new Date(s.start));
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }
  return map;
}

function formatRange(start: string, end: string, tz: string): string {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${fmt.format(new Date(start))} – ${fmt.format(new Date(end))}`;
}

// Snap dragged-or-clicked positions to 15-minute boundaries.
const SNAP_MS = 15 * 60_000;

/**
 * Horizontal "drag to position" picker. The track represents the entire
 * mutual-free window; the gold block on it is the meeting we'll actually
 * schedule. Clicking the track centers the block on the click; dragging
 * the block moves it. Snaps to 15-minute boundaries.
 */
function DurationPicker({
  freeStartMs,
  freeEndMs,
  durationMs,
  startMs,
  onChange,
  timeZone,
}: {
  freeStartMs: number;
  freeEndMs: number;
  durationMs: number;
  startMs: number;
  onChange: (newStartMs: number) => void;
  timeZone: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    pointerX: number;
    startMs: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  const freeRange = freeEndMs - freeStartMs;
  const maxStartMs = freeEndMs - durationMs;
  const draggable = maxStartMs > freeStartMs;

  function clampStart(ms: number): number {
    if (ms < freeStartMs) return freeStartMs;
    if (ms > maxStartMs) return maxStartMs;
    return ms;
  }
  function snapStart(ms: number): number {
    return Math.round(ms / SNAP_MS) * SNAP_MS;
  }
  function commit(ms: number) {
    onChange(clampStart(snapStart(ms)));
  }

  const leftPct = ((startMs - freeStartMs) / freeRange) * 100;
  const widthPct = (durationMs / freeRange) * 100;

  function handleTrackPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!trackRef.current || !draggable) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    // Center the duration block on the click position
    const centerMs = freeStartMs + ratio * freeRange;
    commit(centerMs - durationMs / 2);
  }

  function handleHandlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggable) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      pointerX: e.clientX,
      startMs,
    };
    setDragging(true);
  }
  function handleHandlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || !trackRef.current) return;
    const trackWidth = trackRef.current.getBoundingClientRect().width;
    if (trackWidth <= 0) return;
    const deltaPx = e.clientX - dragRef.current.pointerX;
    const deltaMs = (deltaPx / trackWidth) * freeRange;
    commit(dragRef.current.startMs + deltaMs);
  }
  function handleHandlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    e.currentTarget.releasePointerCapture(dragRef.current.pointerId);
    dragRef.current = null;
    setDragging(false);
  }

  // Tick labels at the start, the middle, and the end of the free window.
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const midMs = freeStartMs + freeRange / 2;
  const showMid = freeRange >= 2 * 60 * 60_000; // only if window > 2h

  return (
    <div className="mt-4 select-none">
      <div className="flex items-center justify-between gap-2 mb-1.5 text-[10px] tracking-[0.18em] uppercase">
        <span style={{ color: "rgba(232, 201, 122, 0.55)" }}>
          {fmt.format(new Date(freeStartMs))}
        </span>
        {showMid && (
          <span style={{ color: "rgba(240, 236, 228, 0.32)" }}>
            {fmt.format(new Date(midMs))}
          </span>
        )}
        <span style={{ color: "rgba(232, 201, 122, 0.55)" }}>
          {fmt.format(new Date(freeEndMs))}
        </span>
      </div>

      <div
        ref={trackRef}
        onPointerDown={handleTrackPointerDown}
        className="relative w-full rounded-full"
        style={{
          height: 40,
          background: "rgba(212, 168, 67, 0.08)",
          border: "1px solid rgba(212, 168, 67, 0.25)",
          cursor: draggable ? "pointer" : "default",
          touchAction: "none",
        }}
        role="slider"
        aria-label="Choose a meeting time within this free window"
        aria-valuemin={freeStartMs}
        aria-valuemax={maxStartMs}
        aria-valuenow={startMs}
      >
        {/* Subtle 30-min grid */}
        <GridTicks
          freeStartMs={freeStartMs}
          freeEndMs={freeEndMs}
          stepMs={30 * 60_000}
        />

        <div
          onPointerDown={handleHandlePointerDown}
          onPointerMove={handleHandlePointerMove}
          onPointerUp={handleHandlePointerUp}
          onPointerCancel={handleHandlePointerUp}
          className="absolute top-0 bottom-0 rounded-full flex items-center justify-center"
          style={{
            left: `${leftPct}%`,
            width: `${widthPct}%`,
            minWidth: 36,
            background: dragging
              ? "linear-gradient(180deg, #E8C97A 0%, #D4A843 100%)"
              : "linear-gradient(180deg, #D4A843 0%, #B68B2E 100%)",
            border: "1px solid rgba(232, 201, 122, 0.7)",
            boxShadow: dragging
              ? "0 0 0 2px rgba(212,168,67,0.25), 0 6px 24px rgba(212,168,67,0.4)"
              : "0 2px 14px rgba(212,168,67,0.25)",
            cursor: draggable ? (dragging ? "grabbing" : "grab") : "default",
            transition: dragging ? "none" : "background 160ms ease",
            touchAction: "none",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 18,
              height: 4,
              borderRadius: 2,
              background: "rgba(5, 8, 22, 0.55)",
            }}
          />
        </div>
      </div>

      {!draggable && (
        <p
          className="text-[11px] mt-2"
          style={{ color: "rgba(240, 236, 228, 0.4)" }}
        >
          The free window is exactly the meeting length, so there's nothing to
          adjust.
        </p>
      )}
    </div>
  );
}

function GridTicks({
  freeStartMs,
  freeEndMs,
  stepMs,
}: {
  freeStartMs: number;
  freeEndMs: number;
  stepMs: number;
}) {
  const range = freeEndMs - freeStartMs;
  // Don't bother drawing more than 24 ticks — gets noisy.
  const count = Math.min(Math.floor(range / stepMs), 24);
  if (count < 2) return null;
  const ticks: number[] = [];
  for (let i = 1; i < count; i++) ticks.push(i / count);
  return (
    <>
      {ticks.map((pct, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute top-1/2"
          style={{
            left: `${pct * 100}%`,
            width: 1,
            height: 8,
            transform: "translate(-0.5px, -50%)",
            background: "rgba(212, 168, 67, 0.22)",
          }}
        />
      ))}
    </>
  );
}
