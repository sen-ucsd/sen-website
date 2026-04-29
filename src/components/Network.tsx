"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

type Status = "founding" | "launching" | "applying";

interface ChapterCard {
  id: string;
  city: string;
  status: Status;
  statusLabel: string;
  region: string;
  quote?: string;
}

const cards: ChapterCard[] = [
  {
    id: "san-diego",
    city: "San Diego",
    status: "founding",
    statusLabel: "Founding Chapter",
    region: "California",
    quote:
      "The energy here is different. We are welding the future, not talking about it.",
  },
  {
    id: "boston",
    city: "Boston",
    status: "launching",
    statusLabel: "Launching Q3",
    region: "New England",
  },
  {
    id: "nyc",
    city: "New York",
    status: "launching",
    statusLabel: "Launching Q3",
    region: "Atlantic",
  },
  {
    id: "london",
    city: "London",
    status: "launching",
    statusLabel: "Launching Q3",
    region: "Europe",
  },
  {
    id: "tokyo",
    city: "Tokyo",
    status: "launching",
    statusLabel: "Applications open",
    region: "Asia",
  },
  {
    id: "singapore",
    city: "Singapore",
    status: "launching",
    statusLabel: "Applications open",
    region: "Asia",
  },
  {
    id: "sao-paulo",
    city: "São Paulo",
    status: "applying",
    statusLabel: "Applications open",
    region: "South America",
  },
  {
    id: "bangalore",
    city: "Bangalore",
    status: "applying",
    statusLabel: "Applications open",
    region: "South Asia",
  },
];

export function Network() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Convert vertical wheel scroll to horizontal scroll inside the chapter strip
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // Only intercept when there's actually horizontal content to scroll
      if (el.scrollWidth <= el.clientWidth) return;
      // Prefer the dominant axis the user moved; if it's vertical, redirect
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        // Don't hijack if the user is at the start (scrolling up) or end (scrolling down)
        const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
        const atEnd =
          el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 && e.deltaY > 0;
        if (atStart || atEnd) return;
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section
      id="network"
      className="relative py-32 md:py-44"
      style={{ background: "rgba(20, 27, 45, 0.32)" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12">
        <div className="flex items-end justify-between mb-12 md:mb-20 gap-6">
          <div className="max-w-xl">
            <span
              className="text-eyebrow block mb-5"
              style={{ color: "rgba(232, 201, 122, 0.65)" }}
            >
              Chapters
            </span>
            <h2
              className="font-display text-section text-cream"
              style={{ fontWeight: 500 }}
            >
              A constellation of nodes.
            </h2>
          </div>
          <div className="flex items-center gap-3 text-eyebrow shrink-0" style={{ color: "rgba(240,236,228,0.35)" }}>
            <span className="hidden sm:inline">Scroll</span>
            <span className="sm:hidden">Swipe</span>
            <span aria-hidden>→</span>
          </div>
        </div>

        <div className="relative -mx-6 sm:-mx-8 md:-mx-12">
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 no-scrollbar px-6 sm:px-8 md:px-12 scroll-smooth"
            style={{ scrollSnapType: "x proximity" }}
          >
            {cards.map((c, i) => (
              <ChapterCardEl key={c.city} card={c} index={i} />
            ))}
            {/* Trailing spacer so last card breathes */}
            <div className="shrink-0 w-2" />
          </div>
          {/* Right-edge fade indicator — telegraphs "more content scrolls past" */}
          <div
            aria-hidden
            className="hidden md:block pointer-events-none absolute top-0 right-0 bottom-8 w-32"
            style={{
              background:
                "linear-gradient(to left, rgba(20,27,45,0.95) 0%, rgba(20,27,45,0) 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

function ChapterCardEl({ card, index }: { card: ChapterCard; index: number }) {
  const isFounding = card.status === "founding";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
      whileHover={{ y: -4 }}
      className="shrink-0 w-[280px] sm:w-[340px] md:w-[400px]"
      style={{ scrollSnapAlign: "start" }}
    >
    <Link
      href={`/chapters/${card.id}`}
      className="block w-full h-full rounded-2xl p-7 sm:p-8 md:p-10 flex flex-col transition-colors duration-300"
      style={{
        background: "rgba(20, 27, 45, 0.55)",
        border: isFounding
          ? "1px solid rgba(212, 168, 67, 0.45)"
          : "1px solid rgba(30, 42, 69, 1)",
        boxShadow: isFounding
          ? "0 0 0 1px rgba(212,168,67,0.18) inset, 0 0 60px rgba(212,168,67,0.06)"
          : undefined,
      }}
    >
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3
            className="font-display text-[26px] mb-2"
            style={{
              color: isFounding ? "#E8C97A" : "#F0ECE4",
              fontWeight: 500,
            }}
          >
            {card.city}
          </h3>
          <p
            className="text-eyebrow"
            style={{ color: "rgba(240, 236, 228, 0.4)" }}
          >
            {card.region}
          </p>
        </div>

        {/* Pulsing chapter dot */}
        <div
          className="relative w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: isFounding
              ? "rgba(212, 168, 67, 0.08)"
              : "rgba(30, 42, 69, 0.6)",
            border: isFounding
              ? "1px solid rgba(212, 168, 67, 0.35)"
              : "1px solid rgba(30, 42, 69, 1)",
          }}
        >
          <span
            aria-hidden
            className="block rounded-full"
            style={{
              width: isFounding ? 9 : 6,
              height: isFounding ? 9 : 6,
              background: isFounding ? "#FFE7A8" : "#D4A843",
              boxShadow: isFounding
                ? "0 0 14px rgba(232, 201, 122, 0.85)"
                : "0 0 8px rgba(212, 168, 67, 0.5)",
              animation: `dot-pulse ${
                isFounding ? 2.2 : 3 + (index % 3) * 0.4
              }s ease-in-out infinite`,
            }}
          />
        </div>
      </div>

      {card.quote ? (
        <p
          className="font-display text-[19px] leading-[1.55] mb-10"
          style={{ color: "rgba(240, 236, 228, 0.78)", fontWeight: 400 }}
        >
          {`“${card.quote}”`}
        </p>
      ) : (
        <p
          className="text-[14px] leading-[1.7] mb-10 max-w-[28ch]"
          style={{ color: "rgba(240, 236, 228, 0.4)" }}
        >
          {chapterDescription(card)}
        </p>
      )}

      <div
        className="mt-auto pt-7 border-t flex items-center justify-end"
        style={{ borderColor: "rgba(30, 42, 69, 1)" }}
      >
        <span
          className="text-eyebrow"
          style={{
            color: isFounding ? "#E8C97A" : "rgba(232, 201, 122, 0.6)",
          }}
        >
          {card.statusLabel}
        </span>
      </div>
    </Link>
    </motion.div>
  );
}

function chapterDescription(c: ChapterCard) {
  if (c.status === "launching") {
    return `Charter team forming this quarter. Inaugural cohort opens on the standard rolling timeline.`;
  }
  return `Student leads currently submitting charter applications from the surrounding ${c.region} region.`;
}
