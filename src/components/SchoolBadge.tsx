"use client";

import type { School } from "@/data/chapters";

/**
 * Renders a school's mark + name. The standard for every chapter on the site:
 * - If school.mark === "ucsd", we use the UCSD trident shield (the founding chapter's mark).
 * - Otherwise we render a clean monogram of the abbreviation in a small circle.
 *
 * Use SchoolStack to render multiple schools side by side (cards) or stacked (chapter pages).
 */

interface Props {
  school: School;
  size?: "sm" | "md";
  // When false, only the mark is rendered (no text). Useful in tight card headers.
  showName?: boolean;
}

export function SchoolBadge({ school, size = "md", showName = true }: Props) {
  const dim = size === "sm" ? 28 : 36;
  return (
    <div className="inline-flex items-center gap-3">
      <div
        className="relative shrink-0 rounded-full flex items-center justify-center overflow-hidden"
        style={{
          width: dim,
          height: dim,
          background: "rgba(20, 27, 45, 0.95)",
          border: "1px solid rgba(212, 168, 67, 0.35)",
        }}
        title={school.name}
      >
        {school.mark === "ucsd" ? (
          <UCSDTrident size={dim} />
        ) : (
          <Monogram text={school.abbreviation} size={size} />
        )}
      </div>
      {showName && (
        <span
          className="text-[13px] tracking-wide"
          style={{
            fontFamily: "var(--font-manrope)",
            color: "rgba(240, 236, 228, 0.65)",
          }}
        >
          {school.name}
        </span>
      )}
    </div>
  );
}

export function SchoolStack({
  schools,
  size = "md",
  showNames = true,
}: {
  schools: School[];
  size?: "sm" | "md";
  showNames?: boolean;
}) {
  if (showNames) {
    return (
      <div className="flex flex-col gap-2">
        {schools.map((s) => (
          <SchoolBadge key={s.abbreviation} school={s} size={size} />
        ))}
      </div>
    );
  }
  // Logos only — overlap them slightly so multiple universities feel like a cohort
  return (
    <div className="flex items-center">
      {schools.map((s, i) => (
        <div
          key={s.abbreviation}
          style={{ marginLeft: i === 0 ? 0 : -8, zIndex: schools.length - i }}
        >
          <SchoolBadge school={s} size={size} showName={false} />
        </div>
      ))}
    </div>
  );
}

/* The UCSD trident shield — three vertical bars rising out of a base, the founding chapter's mark. */
function UCSDTrident({ size }: { size: number }) {
  // The svg viewBox is 24x24. We render at slightly smaller than the container (centered).
  const inner = size - 6;
  return (
    <svg
      viewBox="0 0 24 24"
      width={inner}
      height={inner}
      fill="none"
      aria-hidden
    >
      {/* Three prongs — center taller, sides slightly shorter, all flared with small rounded caps */}
      <g fill="#E8C97A">
        <rect x="4.6" y="6" width="2" height="11" rx="0.4" />
        <rect x="11" y="3.5" width="2" height="13.5" rx="0.4" />
        <rect x="17.4" y="6" width="2" height="11" rx="0.4" />
        {/* Tiny prong caps for that "trident tip" feel */}
        <path d="M3.8 6 H7.4 L7.4 5.2 L5.6 4 L3.8 5.2 Z" />
        <path d="M10.2 3.5 H13.8 L13.8 2.7 L12 1.5 L10.2 2.7 Z" />
        <path d="M16.6 6 H20.2 L20.2 5.2 L18.4 4 L16.6 5.2 Z" />
      </g>
      {/* Base / handle */}
      <rect x="3.5" y="17" width="17" height="2.2" rx="0.5" fill="#D4A843" />
      <rect x="9.5" y="19.2" width="5" height="2.4" rx="0.4" fill="#D4A843" />
    </svg>
  );
}

/* Monogram fallback — abbreviation in display serif inside the circle. */
function Monogram({ text, size }: { text: string; size: "sm" | "md" }) {
  // Auto-shrink long abbreviations so they always fit
  const len = text.length;
  const fontPx =
    size === "sm"
      ? len <= 2
        ? 11
        : len <= 3
          ? 10
          : 8.5
      : len <= 2
        ? 13
        : len <= 3
          ? 11
          : 9.5;
  return (
    <span
      className="font-display"
      style={{
        color: "#E8C97A",
        fontSize: fontPx,
        fontWeight: 600,
        letterSpacing: "0.02em",
        lineHeight: 1,
      }}
    >
      {text}
    </span>
  );
}
