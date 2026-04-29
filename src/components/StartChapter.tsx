"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: 1,
    label: "Apply",
    text: "A short application about you and your campus.",
    active: true,
  },
  {
    n: 2,
    label: "Interview",
    text: "Two conversations with the founding team.",
    active: false,
  },
  {
    n: 3,
    label: "Charter",
    text: "Your chapter receives funding, training, and inaugural cohort support.",
    active: false,
  },
];

export function StartChapter() {
  return (
    <section
      id="start"
      className="relative py-36 md:py-52 px-8 md:px-12"
      style={{
        borderTop: "1px solid rgba(160, 124, 46, 0.14)",
        borderBottom: "1px solid rgba(160, 124, 46, 0.14)",
      }}
    >
      {/* Soft glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(212,168,67,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.span
          className="text-eyebrow block mb-7"
          style={{ color: "rgba(232, 201, 122, 0.6)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Start a Chapter
        </motion.span>
        <motion.h2
          className="font-display text-cream"
          style={{
            fontSize: "clamp(44px, 6vw, 80px)",
            lineHeight: 1.02,
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          Bring SEN to your campus.
        </motion.h2>
        <motion.p
          className="mt-8 text-[17px] md:text-lg leading-[1.7]"
          style={{ color: "rgba(240, 236, 228, 0.55)" }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          Looking for the kind of student who would have started this without
          waiting for permission. The application is short.
        </motion.p>

        {/* 3-step visual */}
        <motion.div
          className="mt-16 flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="flex md:flex-col items-center md:items-start gap-4 md:gap-5 md:flex-1 md:px-7 text-left"
            >
              <div className="flex md:flex-col items-center md:items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-display text-[15px]"
                  style={{
                    border: s.active
                      ? "1px solid rgba(232, 201, 122, 0.85)"
                      : "1px solid rgba(160, 124, 46, 0.45)",
                    color: s.active ? "#E8C97A" : "rgba(240,236,228,0.4)",
                    background: s.active
                      ? "rgba(212, 168, 67, 0.06)"
                      : "transparent",
                  }}
                >
                  {s.n}
                </div>
                {i < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden md:block h-px w-full mt-5"
                    style={{ background: "rgba(160, 124, 46, 0.25)" }}
                  />
                )}
              </div>
              <div className="md:mt-2">
                <p
                  className="text-eyebrow mb-2"
                  style={{
                    color: s.active
                      ? "rgba(232, 201, 122, 0.85)"
                      : "rgba(240, 236, 228, 0.4)",
                  }}
                >
                  {s.label}
                </p>
                <p
                  className="text-[14px] leading-[1.6] max-w-[26ch]"
                  style={{ color: "rgba(240, 236, 228, 0.5)" }}
                >
                  {s.text}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <motion.a
            href="/apply"
            className="rounded-full px-12 py-5 font-display text-[16px] tracking-wide"
            style={{
              background: "#D4A843",
              color: "#050816",
              fontWeight: 500,
            }}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 50px rgba(212,168,67,0.45)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Start the Application
          </motion.a>
          <p
            className="text-eyebrow"
            style={{ color: "rgba(240, 236, 228, 0.32)" }}
          >
            Reviewed Weekly · Reply within Seven Days
          </p>
        </motion.div>
      </div>
    </section>
  );
}
