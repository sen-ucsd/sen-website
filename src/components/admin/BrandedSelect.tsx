"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export interface SelectOption<V extends string = string> {
  value: V;
  label: string;
  /** Optional dot/swatch color shown next to the option */
  dot?: string;
  /** Optional secondary line shown beneath the label */
  hint?: string;
  /** Optional monogram-style badge content (e.g. "A" for Aryan) */
  badge?: string;
}

interface Props<V extends string> {
  value: V;
  options: SelectOption<V>[];
  onChange: (v: V) => void;
  /** Trigger appearance variants */
  variant?: "pill" | "filter" | "ghost";
  /** Optional render override for the trigger label */
  renderTrigger?: (selected: SelectOption<V> | undefined) => React.ReactNode;
  /** Force a specific min-width on the menu */
  menuMinWidth?: number;
  /** A11y label */
  ariaLabel?: string;
  className?: string;
  triggerStyle?: React.CSSProperties;
  disabled?: boolean;
}

/**
 * Branded dropdown. Replaces native <select> across the admin so we control
 * styling, behavior, and animations. Anchors a popover to the trigger using
 * a portal so it floats above siblings without being clipped by overflow.
 */
export function BrandedSelect<V extends string>({
  value,
  options,
  onChange,
  variant = "pill",
  renderTrigger,
  menuMinWidth,
  ariaLabel,
  className,
  triggerStyle,
  disabled,
}: Props<V>) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const selected = options.find((o) => o.value === value);

  // Position the menu under the trigger
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const w = Math.max(menuMinWidth ?? 0, r.width);
    const desiredLeft = r.left;
    const maxLeft = window.innerWidth - w - 8;
    setMenuPos({
      top: r.bottom + 6 + window.scrollY,
      left: Math.max(8, Math.min(desiredLeft, maxLeft)),
      width: w,
    });
  }, [open, menuMinWidth]);

  // Click outside / Escape to close
  useEffect(() => {
    if (!open) return;
    function onDocPointer(e: MouseEvent | TouchEvent) {
      const t = e.target as Node;
      if (
        triggerRef.current?.contains(t) ||
        menuRef.current?.contains(t)
      )
        return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onResize() {
      if (!triggerRef.current) return;
      const r = triggerRef.current.getBoundingClientRect();
      const w = Math.max(menuMinWidth ?? 0, r.width);
      setMenuPos({
        top: r.bottom + 6 + window.scrollY,
        left: r.left,
        width: w,
      });
    }
    document.addEventListener("pointerdown", onDocPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      document.removeEventListener("pointerdown", onDocPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open, menuMinWidth]);

  const triggerBase: React.CSSProperties = {
    fontFamily: "var(--font-manrope)",
    color: "rgba(240, 236, 228, 0.7)",
    border: "1px solid rgba(30, 42, 69, 1)",
    background: "rgba(20, 27, 45, 0.55)",
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 ${
          variant === "ghost" ? "px-2 py-1" : "px-3 py-1.5"
        } rounded-full text-[12px] tracking-wide outline-none transition-colors ${
          className ?? ""
        }`}
        style={{
          ...triggerBase,
          ...triggerStyle,
        }}
      >
        {renderTrigger ? (
          renderTrigger(selected)
        ) : (
          <>
            {selected?.dot && (
              <span
                aria-hidden
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: selected.dot }}
              />
            )}
            {selected?.badge && (
              <span
                aria-hidden
                className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px]"
                style={{
                  background: "rgba(212, 168, 67, 0.18)",
                  color: "#E8C97A",
                  fontFamily: "var(--font-newsreader)",
                  fontWeight: 600,
                }}
              >
                {selected.badge}
              </span>
            )}
            <span className="truncate">{selected?.label ?? "—"}</span>
          </>
        )}
        <span
          aria-hidden
          className="ml-1 text-[8px] leading-none transition-transform"
          style={{
            color: "rgba(212, 168, 67, 0.7)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▾
        </span>
      </button>

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && menuPos && (
              <motion.div
                id={menuId}
                ref={menuRef}
                role="listbox"
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -2, scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="fixed z-[120] rounded-xl overflow-hidden p-1"
                style={{
                  top: menuPos.top,
                  left: menuPos.left,
                  minWidth: menuPos.width,
                  maxHeight: "min(60vh, 360px)",
                  overflowY: "auto",
                  background: "rgba(10, 14, 26, 0.96)",
                  border: "1px solid rgba(212, 168, 67, 0.25)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  boxShadow:
                    "0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(212,168,67,0.05) inset",
                }}
              >
                {options.map((opt) => {
                  const active = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        onChange(opt.value);
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors"
                      style={{
                        color: active ? "#E8C97A" : "rgba(240, 236, 228, 0.85)",
                        background: active
                          ? "rgba(212, 168, 67, 0.1)"
                          : "transparent",
                        fontFamily: "var(--font-manrope)",
                      }}
                      onMouseEnter={(e) => {
                        if (!active)
                          e.currentTarget.style.background =
                            "rgba(212, 168, 67, 0.06)";
                      }}
                      onMouseLeave={(e) => {
                        if (!active) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {opt.dot && (
                        <span
                          aria-hidden
                          className="inline-block w-2 h-2 rounded-full shrink-0"
                          style={{ background: opt.dot }}
                        />
                      )}
                      {opt.badge && (
                        <span
                          aria-hidden
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] shrink-0"
                          style={{
                            background: "rgba(212, 168, 67, 0.18)",
                            color: "#E8C97A",
                            fontFamily: "var(--font-newsreader)",
                            fontWeight: 600,
                          }}
                        >
                          {opt.badge}
                        </span>
                      )}
                      <span className="flex-1 min-w-0">
                        <span className="block truncate">{opt.label}</span>
                        {opt.hint && (
                          <span
                            className="block text-[10px] tracking-wide truncate"
                            style={{
                              color: "rgba(240, 236, 228, 0.4)",
                              marginTop: 1,
                            }}
                          >
                            {opt.hint}
                          </span>
                        )}
                      </span>
                      {active && (
                        <span
                          aria-hidden
                          className="text-[10px] shrink-0"
                          style={{ color: "#E8C97A" }}
                        >
                          ●
                        </span>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
