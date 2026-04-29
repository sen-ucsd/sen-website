"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    title: "Build",
    text:
      "Practical execution over theoretical frameworks. The proof of concept matters more than the pitch deck.",
  },
  {
    title: "Network",
    text:
      "A decentralized web of student founders. Access to a global collective of peers who are building the next decade.",
  },
  {
    title: "Ship",
    text:
      "The final and most crucial act. Real users on real products is the only true metric of success.",
  },
];

export function Vision() {
  return (
    <section id="vision" className="relative py-32 md:py-44 px-8 md:px-12 overflow-hidden">
      {/* Faint motto watermark */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <span
          className="font-display select-none whitespace-nowrap"
          style={{
            fontSize: "clamp(120px, 18vw, 280px)",
            color: "rgba(212, 168, 67, 0.04)",
            letterSpacing: "0.02em",
            fontWeight: 400,
          }}
        >
          PER ARDUA AD ASTRA
        </span>
      </div>

      <div className="relative max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-28 items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="text-eyebrow block mb-6"
            style={{ color: "rgba(232, 201, 122, 0.6)" }}
          >
            Vision
          </span>
          <h2
            className="font-display text-section text-cream"
            style={{ fontWeight: 500 }}
          >
            Every great company starts in a dorm room. The rooms should be
            connected.
          </h2>
          <p
            className="mt-9 text-[17px] leading-[1.75] max-w-md"
            style={{ color: "rgba(240, 236, 228, 0.6)" }}
          >
            Greatness rarely happens in isolation. It grows in the quiet hum of
            shared ambition and the friction of competing ideas. SEN is a return
            to the artisan builder, the student who treats their campus as a
            forge, and treats other campuses as the rest of the workshop.
          </p>
        </motion.div>

        <div className="space-y-12 md:pt-2">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              className="flex gap-5 items-start"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <span
                aria-hidden
                className="mt-3 inline-block w-2 h-2 rounded-full shrink-0"
                style={{
                  background: "#E8C97A",
                  boxShadow: "0 0 12px rgba(232, 201, 122, 0.7)",
                  animation: `dot-pulse ${
                    2.4 + i * 0.4
                  }s ease-in-out infinite`,
                }}
              />
              <div>
                <h3
                  className="font-display text-2xl md:text-[26px] text-cream mb-3"
                  style={{ fontWeight: 500 }}
                >
                  {p.title}
                </h3>
                <p
                  className="text-[15px] leading-[1.7] max-w-md"
                  style={{ color: "rgba(240, 236, 228, 0.42)" }}
                >
                  {p.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
