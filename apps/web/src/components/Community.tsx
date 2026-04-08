"use client";

import { motion } from "framer-motion";

const partners = [
  "Sullivan Center",
  "The Basement",
  "Nucleate",
  "Women in Business",
  "Rady School",
  "Jacobs School",
  "EvoNexus",
  "Techstars",
];

const testimonials = [
  {
    quote:
      "SEN gave me the network and the confidence to actually start building. The people I met here became my co-founders.",
    name: "Fall 2025 Member",
  },
  {
    quote:
      "The panels are different. Real operators talking about what actually happened, not what looks good on a slide deck.",
    name: "Blueprint Summit Attendee",
  },
];

export default function Community() {
  return (
    <section id="community" className="relative py-40 md:py-56 px-8 md:px-12">
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 0% 100%, rgba(212, 168, 67, 0.03) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
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
            Community
          </span>
        </motion.div>

        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-20 max-w-md leading-tight"
          style={{ fontFamily: "var(--font-syne)", color: "#f0ece4" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Built by the people in it
        </motion.h2>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-6 mb-28">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={i}
              className="rounded-2xl p-9 md:p-11"
              style={{
                background: "rgba(20, 27, 45, 0.25)",
                border: "1px solid rgba(240, 236, 228, 0.04)",
              }}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <p
                className="text-[15px] md:text-base leading-[1.8] mb-8 italic"
                style={{ color: "rgba(240, 236, 228, 0.5)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <p
                className="text-[10px] tracking-[0.2em] uppercase"
                style={{ color: "rgba(212, 168, 67, 0.35)" }}
              >
                {t.name}
              </p>
            </motion.blockquote>
          ))}
        </div>

        {/* Partners */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p
            className="text-[10px] tracking-[0.25em] uppercase mb-10"
            style={{ color: "rgba(212, 168, 67, 0.4)" }}
          >
            Our Ecosystem
          </p>
          <div className="flex flex-wrap gap-x-10 gap-y-5">
            {partners.map((partner, i) => (
              <motion.span
                key={partner}
                className="text-sm cursor-default transition-colors duration-500"
                style={{
                  fontFamily: "var(--font-syne)",
                  color: "rgba(240, 236, 228, 0.18)",
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.06 }}
                whileHover={{ color: "rgba(240, 236, 228, 0.5)" }}
              >
                {partner}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
