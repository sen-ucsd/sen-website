"use client";

import { motion } from "framer-motion";

type Sub = { label: string; items: string[] };
type Section = {
  number: number;
  label: string;
  items: string[];
  sub?: Sub;
};

// SEN's lean canvas, transcribed from the whiteboard. Edit here to update the
// admin display. (Future iteration: persist + edit inline from the admin UI.)
const PROBLEM: Section = {
  number: 1,
  label: "Problem",
  items: [
    "Lack of a centralized hub for founders & talent",
    "Need for an accountability network for founders",
  ],
  sub: {
    label: "Existing alternatives",
    items: ["4C", "SIC", "AIG-Z"],
  },
};

const CUSTOMER_SEGMENTS: Section = {
  number: 2,
  label: "Customer Segments",
  items: ["Existing & high-potential founders"],
  sub: {
    label: "High value add",
    items: [
      "Clear year [?]",
      "Workout",
      "Network",
      "Find partners",
      "Talk about business",
    ],
  },
};

const UVP: Section = {
  number: 3,
  label: "Unique Value Proposition",
  items: [
    "Skool",
    "Member credits",
    "Alumni network",
    "National breadth",
    "Internal connections when convenient",
    "Connect to outside [?]",
  ],
};

const SOLUTION: Section = {
  number: 4,
  label: "Solution",
  items: ["Centralized web of potential curriculum & development"],
};

const CHANNELS: Section = {
  number: 5,
  label: "Channels",
  items: [
    "Business Club",
    "Black Business Association",
    "Business Council",
    "UC Entrepreneur Network [?]",
    "Product Management at UCSD",
    "Asians at UCSD",
    "Liquid Death [?]",
    "Women in Business",
    "Minority Business Association",
    "Associated Students",
    "+ other campus organizations",
  ],
};

const FUNDING: Section = {
  number: 6,
  label: "Funding & Budgeting",
  items: [
    "Tim",
    "Associate Chancellor",
    "A.S.",
    "[?]",
  ],
};

const COST: Section = {
  // Cost is folded into Funding above — left here as a placeholder if you
  // ever want to split the bottom row into Cost vs Revenue cleanly.
  number: 7,
  label: "Cost Structure",
  items: [],
};

const KEY_METRICS: Section = {
  number: 8,
  label: "Key Metrics",
  items: ["Interactions (Skool)", "Attendance"],
};

const UNFAIR_ADVANTAGE: Section = {
  number: 9,
  label: "Unfair Advantage",
  items: [
    "Proof of concept by proxy",
    "Experience",
    "Comprehensive network",
  ],
};

const PARTNERS: Section = {
  number: 10,
  label: "Partners",
  items: ["The Basement", "Sullivan Center [?]"],
};

void COST;

// Lean Canvas grid — 5 cols x 3 rows on desktop, single column stack on mobile.
//   row 1: PROBLEM  | SOLUTION | UVP    | UNFAIR  | CUSTOMERS
//   row 2: PROBLEM  | METRICS  | UVP    | CHANNELS| CUSTOMERS    (Problem, UVP, Customers span both rows)
//   row 3: FUNDING (cols 1-3)            | PARTNERS (cols 4-5)
//
// Problem, UVP, and Customer Segments are tall cards that hold a sub-section
// in their lower half (existing alts / high-level concept / early adopters
// in classic Lean Canvas; SEN's variant only fills two of those subs).
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

        {/* Desktop: lean canvas grid. Mobile: vertical stack. */}
        <div className="mt-6 md:mt-8 hidden lg:grid lg:gap-2 lg:grid-cols-5 lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,auto)]">
          {/* Row 1 + 2 */}
          <Card
            section={PROBLEM}
            className="lg:col-start-1 lg:row-span-2"
          />
          <Card section={SOLUTION} className="lg:col-start-2 lg:row-start-1" />
          <Card section={UVP} className="lg:col-start-3 lg:row-span-2" />
          <Card
            section={UNFAIR_ADVANTAGE}
            className="lg:col-start-4 lg:row-start-1"
          />
          <Card
            section={CUSTOMER_SEGMENTS}
            className="lg:col-start-5 lg:row-span-2"
          />
          <Card section={KEY_METRICS} className="lg:col-start-2 lg:row-start-2" />
          <Card section={CHANNELS} className="lg:col-start-4 lg:row-start-2" />
          {/* Row 3 */}
          <Card
            section={FUNDING}
            className="lg:col-start-1 lg:col-span-3 lg:row-start-3"
          />
          <Card
            section={PARTNERS}
            className="lg:col-start-4 lg:col-span-2 lg:row-start-3"
          />
        </div>

        <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2 lg:hidden">
          <Card section={PROBLEM} />
          <Card section={SOLUTION} />
          <Card section={UVP} />
          <Card section={UNFAIR_ADVANTAGE} />
          <Card section={CUSTOMER_SEGMENTS} />
          <Card section={KEY_METRICS} />
          <Card section={CHANNELS} />
          <Card section={FUNDING} />
          <Card section={PARTNERS} />
        </div>
      </div>
    </motion.div>
  );
}

function Card({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-lg p-3.5 md:p-4 flex flex-col gap-3 ${
        className ?? ""
      }`}
      style={{
        background: "rgba(5, 8, 22, 0.45)",
        border: "1px solid rgba(30, 42, 69, 1)",
        minHeight: 160,
      }}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] shrink-0"
          style={{
            background: "rgba(212, 168, 67, 0.14)",
            color: "#E8C97A",
            fontFamily: "var(--font-newsreader)",
            fontWeight: 600,
            fontStyle: "italic",
          }}
        >
          {section.number}
        </span>
        <span
          className="text-eyebrow"
          style={{ color: "rgba(232, 201, 122, 0.78)" }}
        >
          {section.label}
        </span>
      </div>

      <ItemList items={section.items} />

      {section.sub && (
        <div
          className="mt-auto pt-3"
          style={{
            borderTop: "1px dashed rgba(212, 168, 67, 0.2)",
          }}
        >
          <div
            className="text-[10px] tracking-[0.18em] uppercase mb-2"
            style={{ color: "rgba(232, 201, 122, 0.55)" }}
          >
            {section.sub.label}
          </div>
          <ItemList items={section.sub.items} muted />
        </div>
      )}
    </div>
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
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-2 text-[12.5px] md:text-[13px] leading-[1.45]"
          style={{
            color: muted
              ? "rgba(240, 236, 228, 0.55)"
              : "rgba(240, 236, 228, 0.82)",
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
              background: "rgba(212, 168, 67, 0.55)",
            }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
