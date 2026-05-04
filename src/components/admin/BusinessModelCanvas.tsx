"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type Sub = { label: string; items: string[] };
type Section = {
  number: string;
  label: string;
  items: string[];
  sub?: Sub;
};

// SEN's lean canvas, transcribed from the whiteboard. Edit here to update the
// admin display. (Future iteration: persist + edit inline from the admin UI.)
const PROBLEM: Section = {
  number: "01",
  label: "Problem",
  items: [
    "Lack of a centralized hub for founders & talent",
    "Need for an accountability network for founders",
  ],
  sub: {
    label: "Existing alternatives",
    items: ["YC", "SIC", "AIG-Z"],
  },
};

const CUSTOMER_SEGMENTS: Section = {
  number: "02",
  label: "Customer Segments",
  items: ["Existing & high-potential founders"],
  sub: {
    label: "Hike value add",
    items: [
      "Clear your mind",
      "Workout",
      "Network",
      "Find partners",
      "Talk about business",
    ],
  },
};

const UVP: Section = {
  number: "03",
  label: "Unique Value Proposition",
  items: [
    "Skool",
    "Member credits",
    "Alumni network",
    "National breadth",
    "Internal connections when convenient",
    "Connect to outside events",
  ],
};

const SOLUTION: Section = {
  number: "04",
  label: "Solution",
  items: ["Centralized web of potential curation & development"],
};

const CHANNELS: Section = {
  number: "05",
  label: "Channels",
  items: [
    "Business Club",
    "Black Business Association",
    "Business Council",
    "UC Entrepreneur Network",
    "Product Management at UCSD",
    "Ascent at UCSD",
    "Redbull",
    "Liquid Death",
    "Triton Consulting Group (TCG)",
    "Women in Business",
    "Minority Business Association",
    "Associated Students",
    "+ other campus organizations",
  ],
};

const FUNDING: Section = {
  number: "06",
  label: "Funding & Budgeting",
  items: ["Tim", "Associate Chancellor", "A.S.", "BRAIN funding"],
};

const KEY_METRICS: Section = {
  number: "08",
  label: "Key Metrics",
  items: ["Interactions (Skool)", "Attendance"],
};

const UNFAIR_ADVANTAGE: Section = {
  number: "09",
  label: "Unfair Advantage",
  items: [
    "Proof of concept by proxy of leadership experience",
    "Comprehensive network",
  ],
};

const PARTNERS: Section = {
  number: "10",
  label: "Partners",
  items: ["The Basement", "Sullivan Center (at Rady)"],
};

// Strategy canvas — 3 x 3 grid on desktop, stacked on mobile. Standard Lean
// Canvas uses an L-shape with row-spans; that breaks down hard when one
// section (Channels here, with 13 partners) is much denser than its
// neighbours, so we use a uniform grid and let the long lists flow into
// CSS columns inside their own card. Sub-sections (existing alternatives,
// hike value add) ride along inside their parent card.
//
//   row 1: PROBLEM   | SOLUTION  | UVP
//   row 2: CUSTOMERS | CHANNELS  | UNFAIR ADVANTAGE
//   row 3: METRICS   | FUNDING   | PARTNERS
const SECTIONS: Section[] = [
  PROBLEM,
  SOLUTION,
  UVP,
  CUSTOMER_SEGMENTS,
  CHANNELS,
  UNFAIR_ADVANTAGE,
  KEY_METRICS,
  FUNDING,
  PARTNERS,
];
const HIGHLIGHT_INDEX = 2; // UVP

export function BusinessModelCanvas() {
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
      <div
        aria-hidden
        className="absolute top-6 right-6 w-2 h-2 rounded-full"
        style={{
          background: "#E8C97A",
          boxShadow: "0 0 14px rgba(232, 201, 122, 0.85)",
          animation: "dot-pulse 2.4s ease-in-out infinite",
        }}
      />

      <div className="p-5 sm:p-7 md:p-8">
        <div className="flex items-center gap-3 mb-1">
          <span
            aria-hidden
            className="inline-block w-1 h-4 md:h-5"
            style={{
              background:
                "linear-gradient(to bottom, #E8C97A 0%, rgba(160, 124, 46, 0.3) 100%)",
            }}
          />
          <span
            className="text-eyebrow"
            style={{ color: "rgba(232, 201, 122, 0.7)" }}
          >
            Strategy Canvas
          </span>
        </div>
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(22px, 3vw, 32px)",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            color: "#F0ECE4",
            fontWeight: 500,
            fontFamily: "var(--font-newsreader)",
          }}
        >
          The chapter, on one page.
        </h2>
        <p
          className="mt-2 text-[13px] md:text-[14px] leading-[1.6] max-w-3xl"
          style={{ color: "rgba(240, 236, 228, 0.5)" }}
        >
          Why we exist, who we serve, and how we win — distilled. The work
          below in the WBS ladders up to these nine boxes.
        </p>

        <div className="mt-6 md:mt-8 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((section, i) => (
            <Card
              key={section.number}
              section={section}
              index={i}
              highlight={i === HIGHLIGHT_INDEX}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Card({
  section,
  index,
  highlight,
  className,
}: {
  section: Section;
  index: number;
  highlight?: boolean;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);

  const baseBg = highlight
    ? "rgba(212, 168, 67, 0.06)"
    : "rgba(5, 8, 22, 0.55)";
  const baseBorder = highlight
    ? "rgba(212, 168, 67, 0.32)"
    : "rgba(30, 42, 69, 1)";
  const hoverBorder = "rgba(212, 168, 67, 0.55)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.06 * index + 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -2 }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={`relative rounded-xl flex flex-col h-full ${className ?? ""}`}
      style={{
        background: baseBg,
        border: `1px solid ${hovered ? hoverBorder : baseBorder}`,
        boxShadow: hovered
          ? "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,168,67,0.18) inset, 0 0 24px rgba(212,168,67,0.08)"
          : "0 0 0 1px rgba(212,168,67,0.04) inset",
        transition:
          "border-color 220ms ease, box-shadow 220ms ease, background 220ms ease",
      }}
    >
      {/* Numbered marginalia */}
      <span
        aria-hidden
        className="absolute top-3 right-3 text-[10px] tracking-[0.18em] tabular-nums"
        style={{
          color: hovered
            ? "rgba(232, 201, 122, 0.85)"
            : "rgba(232, 201, 122, 0.32)",
          fontFamily: "var(--font-newsreader)",
          fontStyle: "italic",
          transition: "color 220ms ease",
        }}
      >
        {section.number}
      </span>

      <div className="flex flex-col h-full p-4 md:p-[18px] gap-3">
        <div className="flex items-center gap-2 pr-8">
          <span
            aria-hidden
            className="inline-block w-1 h-3.5"
            style={{
              background:
                "linear-gradient(to bottom, rgba(232,201,122,0.85) 0%, rgba(160,124,46,0.25) 100%)",
            }}
          />
          <span
            className="text-eyebrow"
            style={{ color: "rgba(232, 201, 122, 0.82)" }}
          >
            {section.label}
          </span>
        </div>

        <ItemList items={section.items} />

        {section.sub && (
          <div
            className="mt-auto pt-3"
            style={{
              borderTop: "1px dashed rgba(212, 168, 67, 0.22)",
            }}
          >
            <div
              className="text-[10px] tracking-[0.18em] uppercase mb-2"
              style={{ color: "rgba(232, 201, 122, 0.6)" }}
            >
              {section.sub.label}
            </div>
            <ItemList items={section.sub.items} muted />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ItemList({ items, muted }: { items: string[]; muted?: boolean }) {
  if (items.length === 0) {
    return (
      <p
        className="text-[12px] italic"
        style={{ color: "rgba(240, 236, 228, 0.3)" }}
      >
        —
      </p>
    );
  }
  // Long lists (Channels: 13 partner orgs) read better as wrapping pills
  // than as a bullet column — they're discrete entities, not action items,
  // and the pill layout keeps the card from inflating its row.
  if (items.length > 6) {
    return (
      <ul className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-[11.5px] leading-[1.2] rounded-full px-2.5 py-[5px]"
            style={{
              background: "rgba(212, 168, 67, 0.07)",
              border: "1px solid rgba(212, 168, 67, 0.22)",
              color: muted
                ? "rgba(240, 236, 228, 0.65)"
                : "rgba(240, 236, 228, 0.88)",
              fontFamily: "var(--font-manrope)",
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-2 text-[12.5px] md:text-[13px] leading-[1.45]"
          style={{
            color: muted
              ? "rgba(240, 236, 228, 0.58)"
              : "rgba(240, 236, 228, 0.85)",
            fontFamily: "var(--font-manrope)",
          }}
        >
          <span
            aria-hidden
            className="shrink-0 mt-1.5"
            style={{
              width: 4,
              height: 4,
              borderRadius: 9999,
              background: "rgba(212, 168, 67, 0.6)",
            }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
