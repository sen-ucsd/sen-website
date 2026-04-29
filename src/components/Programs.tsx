"use client";

import { motion } from "framer-motion";

type Program = {
  title: string;
  body: string;
  size: "lg" | "sm";
  icon: React.ReactNode;
};

// Hand-drawn line icons (no Material Symbols dependency)
const Icon = {
  Build: () => (
    <svg viewBox="0 0 32 32" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.25">
      <circle cx="16" cy="10" r="2.5" />
      <path d="M16 12.5v6" />
      <path d="M10 22l6-3.5L22 22" />
      <path d="M6 28h20" strokeOpacity="0.5" />
      <path d="M3 18l3-2 3 2 3-2" strokeOpacity="0.4" />
    </svg>
  ),
  Conversation: () => (
    <svg viewBox="0 0 32 32" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M5 9h14a3 3 0 013 3v6a3 3 0 01-3 3h-9l-5 4v-4H5z" />
      <path d="M27 14h-3" strokeOpacity="0.5" />
      <path d="M27 18h-2" strokeOpacity="0.5" />
    </svg>
  ),
  Exchange: () => (
    <svg viewBox="0 0 32 32" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M5 12l4-4 4 4" />
      <path d="M9 8v16" />
      <path d="M27 20l-4 4-4-4" />
      <path d="M23 24V8" />
    </svg>
  ),
  Capital: () => (
    <svg viewBox="0 0 32 32" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.25">
      <circle cx="16" cy="16" r="11" />
      <path d="M16 7v18" />
      <path d="M11.5 11.5h6.25a2.75 2.75 0 010 5.5H13a2.75 2.75 0 000 5.5h7.5" />
    </svg>
  ),
};

const programs: Program[] = [
  {
    title: "Build Nights",
    body:
      "Distraction-free working sessions every week where members ship side projects together and unblock each other in real time.",
    size: "lg",
    icon: <Icon.Build />,
  },
  {
    title: "Founder Conversations",
    body:
      "Off-the-record talks with operators and investors who answer the questions you would never ask on a public stage.",
    size: "sm",
    icon: <Icon.Conversation />,
  },
  {
    title: "Inter-Chapter Exchange",
    body:
      "Members spend a week working out of another chapter's city. Crash with the local team. Build alongside them.",
    size: "sm",
    icon: <Icon.Exchange />,
  },
  {
    title: "Capital Connections",
    body:
      "Warm intros to the angels, funds, and accelerators in each chapter's region for projects that show real traction.",
    size: "lg",
    icon: <Icon.Capital />,
  },
];

export function Programs() {
  return (
    <section id="programs" className="relative py-32 md:py-44 px-8 md:px-12">
      <div className="max-w-[1240px] mx-auto">
        <motion.div
          className="mb-16 md:mb-20"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span
            className="text-eyebrow block mb-5"
            style={{ color: "rgba(232, 201, 122, 0.6)" }}
          >
            Programs
          </span>
          <h2
            className="font-display text-section text-cream max-w-2xl"
            style={{ fontWeight: 500 }}
          >
            The infrastructure for impact.
          </h2>
          <p
            className="mt-7 max-w-xl text-[16px] leading-[1.7]"
            style={{ color: "rgba(240, 236, 228, 0.5)" }}
          >
            Every chapter runs the same four programs, designed to compound the
            work members do on their own products and on each other&apos;s.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {programs.map((p, i) => (
            <motion.div
              key={p.title}
              className={`${
                p.size === "lg" ? "md:col-span-2" : ""
              } rounded-2xl p-9 md:p-12 relative overflow-hidden group`}
              style={{
                background: "rgba(20, 27, 45, 0.55)",
                border: "1px solid rgba(30, 42, 69, 1)",
              }}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              whileHover={{
                borderColor: "rgba(212, 168, 67, 0.25)",
              }}
            >
              {p.size === "lg" && (
                <div
                  aria-hidden
                  className="absolute top-0 right-0 w-1/2 h-full pointer-events-none transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(ellipse at 100% 50%, rgba(212,168,67,0.08) 0%, transparent 60%)",
                  }}
                />
              )}
              <div
                className="relative z-10"
                style={{ color: "rgba(232, 201, 122, 0.85)" }}
              >
                {p.icon}
              </div>
              <h3
                className="relative z-10 font-display text-2xl md:text-[28px] text-cream mt-7 mb-4"
                style={{ fontWeight: 500 }}
              >
                {p.title}
              </h3>
              <p
                className="relative z-10 text-[15px] leading-[1.7] max-w-md"
                style={{ color: "rgba(240, 236, 228, 0.55)" }}
              >
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
