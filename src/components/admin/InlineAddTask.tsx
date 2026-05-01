"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  placeholder?: string;
  onSubmit: (title: string) => void | Promise<void>;
  /** Compact variant for nested children */
  compact?: boolean;
}

export function InlineAddTask({
  placeholder = "Add a task…",
  onSubmit,
  compact = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  async function commit() {
    const t = value.trim();
    if (!t) {
      setOpen(false);
      return;
    }
    await onSubmit(t);
    setValue("");
    // Stay open so the user can add several in a row
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group inline-flex items-center gap-2 rounded-full transition-all ${
          compact ? "px-3 py-1.5" : "px-4 py-2"
        }`}
        style={{
          border: "1px dashed rgba(160, 124, 46, 0.4)",
          color: "rgba(232, 201, 122, 0.7)",
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(232, 201, 122, 0.65)";
          e.currentTarget.style.background = "rgba(212, 168, 67, 0.06)";
          e.currentTarget.style.color = "#E8C97A";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(160, 124, 46, 0.4)";
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(232, 201, 122, 0.7)";
        }}
      >
        <span
          aria-hidden
          className={`${compact ? "text-[13px]" : "text-[14px]"} leading-none`}
        >
          +
        </span>
        <span
          className={`${
            compact ? "text-[11px]" : "text-[12px]"
          } tracking-wide`}
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          {placeholder}
        </span>
      </button>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.form
        key="form"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onSubmit={(e) => {
          e.preventDefault();
          commit();
        }}
        className={`flex items-center gap-2 rounded-full ${
          compact ? "px-3 py-1.5" : "px-4 py-2"
        }`}
        style={{
          background: "rgba(20, 27, 45, 0.6)",
          border: "1px solid rgba(212, 168, 67, 0.5)",
          boxShadow: "0 0 18px rgba(212, 168, 67, 0.12)",
        }}
      >
        <span
          aria-hidden
          className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
          style={{
            background: "#E8C97A",
            boxShadow: "0 0 6px rgba(232, 201, 122, 0.7)",
          }}
        />
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              setValue("");
            }
          }}
          placeholder={placeholder}
          className={`flex-1 bg-transparent outline-none ${
            compact ? "text-[13px]" : "text-[14px]"
          }`}
          style={{
            color: "#F0ECE4",
            fontFamily: "var(--font-manrope)",
            minWidth: compact ? 200 : 280,
          }}
        />
        <button
          type="submit"
          className="rounded-full px-3 py-1 text-[11px] tracking-wide shrink-0"
          style={{
            background: value.trim() ? "#D4A843" : "rgba(160, 124, 46, 0.3)",
            color: value.trim() ? "#050816" : "rgba(240, 236, 228, 0.4)",
            fontWeight: 500,
            fontFamily: "var(--font-manrope)",
            transition: "all 0.2s ease",
          }}
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setValue("");
          }}
          aria-label="Cancel"
          className="text-[14px] leading-none px-1 shrink-0"
          style={{ color: "rgba(240, 236, 228, 0.4)" }}
        >
          ×
        </button>
      </motion.form>
    </AnimatePresence>
  );
}
