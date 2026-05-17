"use client";

import { motion } from "framer-motion";
import { WorkshopSignupForm } from "./WorkshopSignupForm";
import { CLIMATE_ACTION_LAB_URL } from "@/lib/workshop";

export function ClaudeWorkshopHero() {
  return (
    <section
      id="workshop-hero"
      className="relative overflow-hidden pt-24 md:pt-36 pb-16 md:pb-28 px-5 sm:px-8 md:px-16 lg:px-24"
    >
      <BackgroundArt />

      <div className="relative z-10 max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-start">
          {/* Left: title + meta */}
          <div className="lg:col-span-7">
            <motion.span
              className="text-eyebrow block mb-7"
              style={{ color: "rgba(232, 201, 122, 0.78)" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              SEN · UCSD · One-hour workshop
            </motion.span>

            <motion.h1
              className="font-display text-cream"
              style={{
                fontSize: "clamp(44px, 6.5vw, 96px)",
                lineHeight: 0.98,
                letterSpacing: "-0.02em",
                fontWeight: 500,
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Build with{" "}
              <span style={{ color: "#E8C97A" }}>Claude</span>.
            </motion.h1>

            <motion.p
              className="mt-7 max-w-xl text-[17px] md:text-lg leading-[1.7]"
              style={{ color: "rgba(240, 236, 228, 0.65)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              An hour with Claude and the terminal agent on a project you
              actually want to move forward, whether that is marketing, finance,
              project management, or whatever is sitting open on your laptop
              right now.
            </motion.p>

            <motion.div
              className="mt-8 md:mt-10 grid grid-cols-3 gap-3 md:gap-5 max-w-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <Detail label="Date" value="Tue, May 19" />
              <Detail label="Time" value="4 – 5 PM" />
              <Detail
                label="Location"
                value="Climate Action Lab"
                href={CLIMATE_ACTION_LAB_URL}
              />
            </motion.div>

            <motion.div
              className="mt-8 md:mt-10 flex flex-wrap items-center gap-x-4 gap-y-3 lg:hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
            >
              <a
                href="#signup"
                className="rounded-full px-6 sm:px-7 py-3 sm:py-3.5 font-display text-[14px] tracking-wide whitespace-nowrap"
                style={{ background: "#D4A843", color: "#050816", fontWeight: 500 }}
              >
                Reserve your spot
              </a>
              <span
                className="text-eyebrow whitespace-nowrap"
                style={{ color: "rgba(240, 236, 228, 0.35)" }}
              >
                Seats limited
              </span>
            </motion.div>
          </div>

          {/* Right: signup card, visible above the fold on desktop */}
          <motion.div
            id="signup"
            className="lg:col-span-5 lg:sticky lg:top-32 scroll-mt-28"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="rounded-2xl p-6 sm:p-7 md:p-8"
              style={{
                background: "rgba(10, 14, 26, 0.78)",
                border: "1px solid rgba(160, 124, 46, 0.35)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow:
                  "0 30px 80px -30px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,168,67,0.06), 0 0 60px -20px rgba(212,168,67,0.18)",
              }}
            >
              <div className="mb-6">
                <span
                  className="text-eyebrow block mb-3"
                  style={{ color: "rgba(232, 201, 122, 0.6)" }}
                >
                  Reserve your spot
                </span>
                <h2
                  className="font-display text-cream"
                  style={{
                    fontSize: "clamp(22px, 2.6vw, 30px)",
                    fontWeight: 500,
                    lineHeight: 1.1,
                  }}
                >
                  Three fields, about sixty seconds.
                </h2>
              </div>
              <WorkshopSignupForm workshopSlug="claude" compact />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Detail({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const valueStyle = {
    fontSize: "clamp(13px, 3.6vw, 17px)",
    lineHeight: 1.25,
    fontWeight: 500,
  } as const;
  return (
    <div className="min-w-0">
      <p
        className="text-eyebrow mb-2"
        style={{ color: "rgba(240, 236, 228, 0.4)" }}
      >
        {label}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display text-cream underline decoration-1 underline-offset-[5px] transition-colors duration-200 hover:text-[#E8C97A]"
          style={{
            ...valueStyle,
            textDecorationColor: "rgba(212, 168, 67, 0.5)",
          }}
        >
          {value}
        </a>
      ) : (
        <p className="font-display text-cream" style={valueStyle}>
          {value}
        </p>
      )}
    </div>
  );
}

function BackgroundArt() {
  // Subtle starfield + gold corner glow that hints at the rocket/launch motif
  // without leaning on stock imagery. Cheap and on-brand.
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 85% 0%, rgba(212,168,67,0.10) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 10% 100%, rgba(232,201,122,0.06) 0%, transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(232,201,122,0.4) 0.5px, transparent 1px), radial-gradient(circle at 75% 60%, rgba(232,201,122,0.3) 0.5px, transparent 1px), radial-gradient(circle at 45% 80%, rgba(232,201,122,0.35) 0.5px, transparent 1px), radial-gradient(circle at 88% 18%, rgba(232,201,122,0.25) 0.5px, transparent 1px), radial-gradient(circle at 12% 75%, rgba(232,201,122,0.3) 0.5px, transparent 1px)",
          backgroundSize: "100% 100%",
        }}
      />
    </>
  );
}
