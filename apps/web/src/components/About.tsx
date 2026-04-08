"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "400+", label: "Students Engaged" },
  { value: "50+", label: "Events Hosted" },
  { value: "30+", label: "Industry Partners" },
];

export default function About() {
  return (
    <section id="about" className="relative py-40 md:py-56 px-8 md:px-12">
      {/* Subtle ambient light */}
      <div
        className="absolute top-20 left-0 w-[800px] h-[600px] pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 0% 30%, rgba(212, 168, 67, 0.04) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Section label */}
        <motion.div
          className="flex items-center gap-5 mb-20"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
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
            Who We Are
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] mb-10"
              style={{ fontFamily: "var(--font-syne)", color: "#f0ece4" }}
            >
              Real builders.
              <br />
              Real conversations.
              <br />
              <span style={{ color: "#d4a843" }}>Zero fluff.</span>
            </h2>
            <p
              className="text-base md:text-[17px] leading-[1.8] max-w-md"
              style={{
                fontFamily: "var(--font-outfit)",
                color: "rgba(240, 236, 228, 0.4)",
              }}
            >
              SEN is where UCSD students go from having ideas to actually
              executing on them. We connect founders, operators, and aspiring
              entrepreneurs with the people, frameworks, and opportunities that
              move things forward.
            </p>
          </motion.div>

          {/* Right column */}
          <div className="space-y-16">
            <motion.p
              className="text-[15px] leading-[1.8]"
              style={{
                fontFamily: "var(--font-outfit)",
                color: "rgba(240, 236, 228, 0.3)",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              We partner with the Sullivan Center, The Basement, Nucleate, and
              organizations across Southern California to bring operator-led
              panels, hands-on workshops, and networking that actually matters to
              campus. Whether you are building your first product or exploring
              what entrepreneurship even looks like, this is where you start.
            </motion.p>

            {/* Stats row */}
            <motion.div
              className="grid grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 + i * 0.1 }}
                >
                  <div
                    className="text-3xl md:text-4xl font-bold mb-2"
                    style={{
                      fontFamily: "var(--font-syne)",
                      color: "#d4a843",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: "rgba(240, 236, 228, 0.25)" }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Motto divider */}
            <motion.div
              className="pt-10"
              style={{ borderTop: "1px solid rgba(240, 236, 228, 0.05)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <p
                className="text-[10px] tracking-[0.4em] uppercase"
                style={{
                  fontFamily: "var(--font-syne)",
                  color: "rgba(212, 168, 67, 0.25)",
                }}
              >
                Per Ardua Ad Astra
              </p>
              <p
                className="text-[11px] mt-1.5"
                style={{ color: "rgba(240, 236, 228, 0.15)" }}
              >
                Through hardship to the stars
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
