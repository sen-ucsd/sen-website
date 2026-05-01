"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Task } from "./TaskBoard";

interface Props {
  vision: Task;
  onUpdate: (id: string, patch: Partial<Task>) => void;
}

export function VisionCard({ vision, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: vision.title,
    description: vision.description ?? "",
  });

  function startEdit() {
    setDraft({
      title: vision.title,
      description: vision.description ?? "",
    });
    setEditing(true);
  }

  function commit() {
    const t = draft.title.trim();
    if (!t) {
      setEditing(false);
      return;
    }
    onUpdate(vision.id, {
      title: t,
      description: draft.description.trim() || null,
    });
    setEditing(false);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 30% 0%, rgba(212, 168, 67, 0.07) 0%, transparent 60%), rgba(20, 27, 45, 0.55)",
        border: "1px solid rgba(212, 168, 67, 0.35)",
        boxShadow:
          "0 0 0 1px rgba(212,168,67,0.08) inset, 0 0 60px rgba(212,168,67,0.06)",
      }}
    >
      {/* Pulse-dot in the corner — same vibe as the chapter dots on the map */}
      <div
        aria-hidden
        className="absolute top-6 right-6 w-2 h-2 rounded-full"
        style={{
          background: "#E8C97A",
          boxShadow: "0 0 14px rgba(232, 201, 122, 0.85)",
          animation: "dot-pulse 2.4s ease-in-out infinite",
        }}
      />

      <div className="p-7 md:p-10">
        <div className="flex items-center gap-3 mb-5">
          <span
            aria-hidden
            className="inline-block w-1 h-5"
            style={{
              background:
                "linear-gradient(to bottom, #E8C97A 0%, rgba(160, 124, 46, 0.3) 100%)",
            }}
          />
          <span
            className="text-eyebrow"
            style={{ color: "rgba(232, 201, 122, 0.7)" }}
          >
            Chapter Vision
          </span>
        </div>

        {editing ? (
          <div className="space-y-4">
            <textarea
              autoFocus
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({ ...d, title: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) commit();
                if (e.key === "Escape") setEditing(false);
              }}
              rows={2}
              className="font-display w-full bg-transparent outline-none resize-none"
              style={{
                fontSize: "clamp(22px, 3vw, 32px)",
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
                color: "#F0ECE4",
                fontWeight: 500,
                fontFamily: "var(--font-newsreader)",
              }}
              placeholder="What is this chapter trying to do?"
            />
            <textarea
              value={draft.description}
              onChange={(e) =>
                setDraft((d) => ({ ...d, description: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) commit();
                if (e.key === "Escape") setEditing(false);
              }}
              rows={3}
              placeholder="Add any context that frames the work below."
              className="w-full rounded-lg px-3 py-2 text-[14px] outline-none"
              style={{
                background: "rgba(5, 8, 22, 0.5)",
                border: "1px solid rgba(30, 42, 69, 1)",
                color: "rgba(240, 236, 228, 0.85)",
                fontFamily: "var(--font-manrope)",
              }}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={commit}
                className="text-[12px] tracking-wide rounded-full px-4 py-1.5"
                style={{
                  background: "#D4A843",
                  color: "#050816",
                  fontWeight: 500,
                  fontFamily: "var(--font-manrope)",
                }}
              >
                Save Vision
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-[12px] tracking-wide rounded-full px-4 py-1.5"
                style={{
                  border: "1px solid rgba(30, 42, 69, 1)",
                  color: "rgba(240, 236, 228, 0.6)",
                }}
              >
                Cancel
              </button>
              <span
                className="ml-auto text-[10px]"
                style={{ color: "rgba(240, 236, 228, 0.3)" }}
              >
                ⌘↵ to save · esc to cancel
              </span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="text-left w-full group"
          >
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(24px, 3.5vw, 40px)",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                color: "#F0ECE4",
                fontWeight: 500,
                fontFamily: "var(--font-newsreader)",
              }}
            >
              {vision.title}
            </h2>
            {vision.description && (
              <p
                className="mt-4 text-[15px] md:text-base leading-[1.7] max-w-3xl"
                style={{ color: "rgba(240, 236, 228, 0.55)" }}
              >
                {vision.description}
              </p>
            )}
            <span
              className="inline-block mt-5 text-[11px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: "rgba(232, 201, 122, 0.65)" }}
            >
              Click to edit ↗
            </span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
