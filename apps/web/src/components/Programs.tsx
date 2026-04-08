"use client";

import { motion } from "framer-motion";

const programs = [
  {
    title: "Lean Lectures",
    description:
      "Intimate workshops with the Sullivan Center breaking down real business models, growth strategies, and operational thinking.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M12 12L20 7.5M12 12V21M12 12L4 7.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    title: "Speaker Panels",
    description:
      "Founders, VCs, and operators share what they actually did to build, scale, and fund their companies. No motivational fluff.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M3 9H21" stroke="currentColor" strokeWidth="1.2" />
        <path d="M9 9V21" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    title: "Startup Weekend",
    description:
      "48 hours. Build a product, validate an idea, pitch to judges. The fastest way to learn if you can actually ship.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Founder Socials",
    description:
      "Beach hangouts, hikes, and dinners where you meet the people who will become your co-founders, early hires, and lifelong collaborators.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="1.2" />
        <path d="M3 21C3 17.134 5.686 14 9 14C10.326 14 11.558 14.474 12.572 15.281" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M17 14C20.314 14 23 17.134 23 21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Programs() {
  return (
    <section id="programs" className="relative py-40 md:py-56 px-8 md:px-12">
      {/* Ambient light */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 100% 0%, rgba(212, 168, 67, 0.03) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Section label */}
        <motion.div
          className="flex items-center gap-5 mb-8"
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
            What We Do
          </span>
        </motion.div>

        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-20 max-w-lg leading-tight"
          style={{ fontFamily: "var(--font-syne)", color: "#f0ece4" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Programs that move you forward
        </motion.h2>

        {/* Cards grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-5 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {programs.map((program) => (
            <motion.div
              key={program.title}
              className="group rounded-2xl p-8 md:p-10 transition-all duration-500 cursor-default"
              style={{
                background: "rgba(20, 27, 45, 0.3)",
                border: "1px solid rgba(240, 236, 228, 0.04)",
              }}
              variants={itemVariants}
              whileHover={{
                background: "rgba(20, 27, 45, 0.5)",
                borderColor: "rgba(212, 168, 67, 0.12)",
              }}
            >
              <div
                className="mb-6 transition-colors duration-300"
                style={{ color: "rgba(212, 168, 67, 0.45)" }}
              >
                {program.icon}
              </div>
              <h3
                className="text-lg md:text-xl font-semibold mb-4"
                style={{
                  fontFamily: "var(--font-syne)",
                  color: "#f0ece4",
                }}
              >
                {program.title}
              </h3>
              <p
                className="text-[14px] leading-[1.8]"
                style={{
                  fontFamily: "var(--font-outfit)",
                  color: "rgba(240, 236, 228, 0.35)",
                }}
              >
                {program.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
