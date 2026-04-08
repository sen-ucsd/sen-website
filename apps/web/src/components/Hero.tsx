"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ position: "relative" }}
    >
      {/* Layered nebula background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 40%, rgba(212, 168, 67, 0.06) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 75% 20%, rgba(30, 42, 69, 0.5) 0%, transparent 50%),
              radial-gradient(ellipse 50% 60% at 50% 80%, rgba(160, 124, 46, 0.03) 0%, transparent 40%)
            `,
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 45%, transparent 0%, #050816 100%)",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 text-center px-8 max-w-5xl mx-auto"
        style={{ y, opacity }}
      >
        {/* Eyebrow */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span
            className="inline-block text-[11px] md:text-xs tracking-[0.5em] uppercase"
            style={{
              fontFamily: "var(--font-syne)",
              color: "rgba(212, 168, 67, 0.55)",
            }}
          >
            UC San Diego
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="text-[3.2rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1] tracking-[-0.02em] mb-10"
          style={{ fontFamily: "var(--font-syne)" }}
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className="block text-[#f0ece4]">Student</span>
          <span className="block text-[#f0ece4]">Entrepreneurs</span>
          <span
            className="block"
            style={{
              color: "#d4a843",
              textShadow: "0 0 60px rgba(212, 168, 67, 0.2)",
            }}
          >
            Network
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-[15px] md:text-lg max-w-md mx-auto leading-relaxed mb-14"
          style={{
            fontFamily: "var(--font-outfit)",
            color: "rgba(240, 236, 228, 0.4)",
          }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          Where builders, operators, and future founders
          <br className="hidden sm:block" /> get serious about what comes next.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
          <motion.a
            href="#join"
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
            Get Involved
          </motion.a>
          <motion.a
            href="#about"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm tracking-wide"
            style={{
              fontFamily: "var(--font-outfit)",
              border: "1px solid rgba(240, 236, 228, 0.12)",
              color: "rgba(240, 236, 228, 0.6)",
            }}
            whileHover={{
              scale: 1.03,
              borderColor: "rgba(240, 236, 228, 0.25)",
              color: "rgba(240, 236, 228, 0.9)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Learn More
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-[22px] h-[34px] rounded-full flex items-start justify-center pt-2" style={{ border: "1px solid rgba(240, 236, 228, 0.15)" }}>
            <motion.div
              className="w-[3px] h-[6px] rounded-full"
              style={{ background: "rgba(212, 168, 67, 0.5)" }}
              animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
