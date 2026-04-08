"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const tracks = [
  "Defense & Dual-Use Tech",
  "Precision Medicine",
  "AI & Cognitive Science",
  "Climate Tech",
  "Fintech & Deep Capital",
  "Genomics & Life Sciences",
];

export default function Summit() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineWidth = useTransform(scrollYProgress, [0.15, 0.4], ["0%", "100%"]);

  return (
    <section
      id="summit"
      ref={sectionRef}
      className="relative py-40 md:py-56 px-8 md:px-12 overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 25%, rgba(212, 168, 67, 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Section label */}
        <motion.div
          className="flex items-center gap-5 mb-8"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-10 h-px" style={{ background: "rgba(212, 168, 67, 0.35)" }} />
          <span
            className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase"
            style={{
              fontFamily: "var(--font-syne)",
              color: "rgba(212, 168, 67, 0.5)",
            }}
          >
            Flagship Event
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            <span style={{ color: "#f0ece4" }}>Blueprint</span>
            <br />
            <span
              style={{
                color: "#d4a843",
                textShadow: "0 0 80px rgba(212, 168, 67, 0.15)",
              }}
            >
              Summit 2026
            </span>
          </h2>

          {/* Animated line */}
          <motion.div
            className="h-px mb-10"
            style={{
              width: lineWidth,
              background: "rgba(212, 168, 67, 0.25)",
            }}
          />

          <p
            className="text-base md:text-lg max-w-xl leading-[1.8]"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "rgba(240, 236, 228, 0.4)",
            }}
          >
            A full-day conference bridging academia, industry, and
            entrepreneurship. 400+ attendees. Keynotes, panels, workshops, and
            the conversations that happen between them.
          </p>
        </motion.div>

        {/* Details */}
        <div className="grid md:grid-cols-3 gap-16 md:gap-20 mb-24">
          {[
            {
              label: "Format",
              text: "Keynote. Six simultaneous panel tracks. Hands-on workshops. Structured networking. All in one day.",
            },
            {
              label: "Who Shows Up",
              text: "Student founders, researchers, operators. VCs and angels from Tech Coast Angels, Section 32, Qualcomm Ventures. Founders who have built and shipped.",
            },
            {
              label: "The Point",
              text: "Leave with frameworks you can use, people you should know, and a sharper sense of where you fit in the ecosystem.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.12 }}
            >
              <p
                className="text-[10px] tracking-[0.25em] uppercase mb-4"
                style={{ color: "rgba(212, 168, 67, 0.4)" }}
              >
                {item.label}
              </p>
              <p
                className="text-[14px] leading-[1.8]"
                style={{
                  fontFamily: "var(--font-outfit)",
                  color: "rgba(240, 236, 228, 0.55)",
                }}
              >
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tracks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p
            className="text-[10px] tracking-[0.25em] uppercase mb-8"
            style={{ color: "rgba(212, 168, 67, 0.4)" }}
          >
            Panel Tracks
          </p>
          <div className="flex flex-wrap gap-3">
            {tracks.map((track, i) => (
              <motion.span
                key={track}
                className="px-5 py-2.5 text-[12px] rounded-full cursor-default transition-all duration-300"
                style={{
                  border: "1px solid rgba(240, 236, 228, 0.06)",
                  color: "rgba(240, 236, 228, 0.35)",
                  fontFamily: "var(--font-outfit)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.07 }}
                whileHover={{
                  borderColor: "rgba(212, 168, 67, 0.2)",
                  color: "rgba(240, 236, 228, 0.6)",
                }}
              >
                {track}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.a
            href="mailto:sen@ucsd.edu"
            className="inline-flex items-center gap-3 px-7 py-4 rounded-full text-[13px] tracking-wide transition-all duration-300"
            style={{
              fontFamily: "var(--font-syne)",
              border: "1px solid rgba(212, 168, 67, 0.2)",
              color: "#d4a843",
            }}
            whileHover={{
              scale: 1.03,
              x: 4,
              background: "rgba(212, 168, 67, 0.05)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Get Tickets
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
