"use client";

import { motion } from "framer-motion";

export default function Join() {
  return (
    <section id="join" className="relative py-44 md:py-60 px-8 md:px-12">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(212, 168, 67, 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative">
        <motion.p
          className="text-[10px] md:text-[11px] tracking-[0.5em] uppercase mb-8"
          style={{
            fontFamily: "var(--font-syne)",
            color: "rgba(212, 168, 67, 0.45)",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Get Involved
        </motion.p>

        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1] mb-10"
          style={{ fontFamily: "var(--font-syne)" }}
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span style={{ color: "#f0ece4" }}>Ready to</span>
          <br />
          <span
            style={{
              color: "#d4a843",
              textShadow: "0 0 60px rgba(212, 168, 67, 0.15)",
            }}
          >
            build something?
          </span>
        </motion.h2>

        <motion.p
          className="text-[15px] md:text-base max-w-sm mx-auto leading-[1.8] mb-14"
          style={{
            fontFamily: "var(--font-outfit)",
            color: "rgba(240, 236, 228, 0.4)",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          We recruit every fall and spring. Applications open at the start of
          each quarter. Follow us to know when.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
        >
          <motion.a
            href="mailto:sen@ucsd.edu"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-semibold tracking-wide"
            style={{
              fontFamily: "var(--font-syne)",
              background: "#d4a843",
              color: "#0a0e1a",
            }}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 30px rgba(212, 168, 67, 0.3)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Reach Out
          </motion.a>
          <motion.a
            href="https://www.instagram.com/senucsd/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm tracking-wide"
            style={{
              border: "1px solid rgba(240, 236, 228, 0.12)",
              color: "rgba(240, 236, 228, 0.5)",
            }}
            whileHover={{
              scale: 1.03,
              borderColor: "rgba(240, 236, 228, 0.25)",
              color: "rgba(240, 236, 228, 0.8)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Follow @senucsd
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
