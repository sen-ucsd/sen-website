"use client";

import { useEffect, useRef } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  /** Length of the code; defaults to 6. */
  length?: number;
  /** Pull focus to the first empty box when the component mounts. */
  autoFocus?: boolean;
  ariaLabel?: string;
  /** Called when the user types the final digit, useful for auto-submitting. */
  onComplete?: (value: string) => void;
}

/**
 * Six-box OTP input.
 *
 * Each box owns one digit. Typing advances focus, Backspace retreats,
 * arrow keys navigate, and pasting a longer string fills as many boxes as
 * fit. The composite value is reported up via onChange so the parent can
 * still treat it like a single string.
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  autoFocus,
  ariaLabel = "Verification code",
  onComplete,
}: Props) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (autoFocus) {
      const firstEmpty = Math.min(value.length, length - 1);
      refs.current[firstEmpty]?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setDigit(idx: number, digit: string) {
    const cleaned = digit.replace(/\D/g, "").slice(0, 1);
    const chars = value.split("");
    while (chars.length < length) chars.push("");
    chars[idx] = cleaned;
    const next = chars.join("").slice(0, length);
    onChange(next);
    if (cleaned && idx < length - 1) {
      refs.current[idx + 1]?.focus();
    }
    if (next.length === length && next.replace(/\D/g, "").length === length) {
      onComplete?.(next);
    }
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    const chars = value.split("");
    if (e.key === "Backspace") {
      if (chars[idx]) {
        // Just clear the current box
        chars[idx] = "";
        onChange(chars.join(""));
        return;
      }
      // Empty: hop back and clear the previous box
      if (idx > 0) {
        chars[idx - 1] = "";
        onChange(chars.join(""));
        refs.current[idx - 1]?.focus();
        e.preventDefault();
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      refs.current[idx - 1]?.focus();
      e.preventDefault();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      refs.current[idx + 1]?.focus();
      e.preventDefault();
    } else if (e.key === "Enter") {
      // Let the form submit naturally; nothing to do here.
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.slice(0, length);
    onChange(next);
    const focusIdx = Math.min(next.length, length - 1);
    refs.current[focusIdx]?.focus();
    if (next.length === length) onComplete?.(next);
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex items-center justify-between gap-1.5 sm:gap-2"
    >
      {Array.from({ length }).map((_, i) => {
        const ch = value[i] ?? "";
        return (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={ch}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.currentTarget.select()}
            aria-label={`${ariaLabel}, digit ${i + 1}`}
            className="flex-1 min-w-0 text-center rounded-lg outline-none transition-[border-color,box-shadow] focus:border-[rgba(212,168,67,0.55)] focus:shadow-[0_0_0_3px_rgba(212,168,67,0.12)]"
            style={{
              background: "rgba(20, 27, 45, 0.6)",
              border: `1px solid ${ch ? "rgba(212, 168, 67, 0.32)" : "rgba(30, 42, 69, 1)"}`,
              color: "#F0ECE4",
              fontFamily: "var(--font-newsreader)",
              fontWeight: 500,
              fontSize: 28,
              height: 56,
              caretColor: "#E8C97A",
            }}
          />
        );
      })}
    </div>
  );
}
