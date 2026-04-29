"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HeroMap } from "./HeroMap";
import { MapExplorer } from "./MapExplorer";

export function Hero() {
  const [explorerOpen, setExplorerOpen] = useState(false);

  return (
    <>
      <section
        id="hero"
        className="relative min-h-[100dvh] overflow-hidden"
      >
        {/* Map (clickable to open explorer) */}
        <button
          type="button"
          onClick={() => setExplorerOpen(true)}
          aria-label="Open the network map"
          className="absolute inset-0 z-0 block w-full h-full group cursor-pointer"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty(
              "--x",
              `${e.clientX - r.left}px`
            );
            e.currentTarget.style.setProperty(
              "--y",
              `${e.clientY - r.top}px`
            );
          }}
        >
          <HeroMap />
          {/* Hover spotlight that follows the cursor */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle 220px at var(--x, 70%) var(--y, 50%), rgba(212,168,67,0.12) 0%, transparent 100%)",
            }}
          />
          {/* "Click to explore" floating label that follows the cursor on hover */}
          <div
            aria-hidden
            className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              left: "var(--x, 0)",
              top: "var(--y, 0)",
              transform: "translate(20px, -50%)",
            }}
          >
            <div
              className="rounded-full px-4 py-2 backdrop-blur-md whitespace-nowrap"
              style={{
                background: "rgba(20, 27, 45, 0.85)",
                border: "1px solid rgba(232, 201, 122, 0.45)",
                color: "#E8C97A",
                fontFamily: "var(--font-manrope)",
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Click to Explore the Network
            </div>
          </div>
        </button>

        {/* Left-side dimming so text reads cleanly over the map */}
        <div
          aria-hidden
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(5,8,22,0.92) 0%, rgba(5,8,22,0.78) 28%, rgba(5,8,22,0.45) 50%, rgba(5,8,22,0.18) 70%, transparent 100%)",
          }}
        />

        <div className="relative z-10 min-h-[100dvh] flex flex-col pointer-events-none">
          {/* Spacer for fixed nav */}
          <div className="h-20 md:h-24 shrink-0" />

          {/* Main content */}
          <div className="flex-1 flex items-center">
            <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 md:px-16 lg:px-24">
              <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                {/* Left column: text */}
                <div className="lg:col-span-7 pointer-events-auto">
                  <motion.span
                    className="text-eyebrow block mb-7"
                    style={{ color: "rgba(232, 201, 122, 0.85)" }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1.0 }}
                  >
                    Born in San Diego
                  </motion.span>

                  <motion.h1
                    className="font-display text-cream"
                    style={{
                      fontSize: "clamp(48px, 6.5vw, 96px)",
                      lineHeight: 0.98,
                      letterSpacing: "-0.02em",
                      fontWeight: 500,
                    }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
                  >
                    A global network
                    <br />
                    of student builders.
                  </motion.h1>

                  <motion.p
                    className="mt-9 max-w-xl text-[17px] md:text-lg leading-[1.7]"
                    style={{ color: "rgba(240, 236, 228, 0.62)" }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1.55 }}
                  >
                    College students who want to actually build things, gathered into one
                    network. The San Diego chapter started it. New chapters are joining
                    every quarter.
                  </motion.p>

                  <motion.div
                    className="mt-12 flex flex-row items-center gap-3 sm:gap-7 flex-wrap"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1.85 }}
                  >
                    <motion.a
                      href="/apply"
                      className="rounded-full px-5 sm:px-8 py-3 sm:py-4 font-display text-[13px] sm:text-[15px] tracking-wide whitespace-nowrap"
                      style={{ background: "#D4A843", color: "#050816", fontWeight: 500 }}
                      whileHover={{
                        scale: 1.04,
                        boxShadow: "0 0 38px rgba(212,168,67,0.42)",
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Start a Chapter
                    </motion.a>
                    <button
                      type="button"
                      onClick={() => setExplorerOpen(true)}
                      className="font-display text-[13px] sm:text-[15px] tracking-wide group inline-flex items-center gap-2 sm:gap-3 whitespace-nowrap"
                      style={{ color: "rgba(240, 236, 228, 0.62)" }}
                    >
                      <span className="border-b border-transparent group-hover:border-[rgba(232,201,122,0.5)] transition-colors duration-300">
                        Explore the Network
                      </span>
                      <span
                        aria-hidden
                        className="text-[rgba(232,201,122,0.7)] transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </button>
                  </motion.div>
                </div>

                {/* Right column: large logo emblem (static) — explicit z-index keeps it above the map */}
                <div className="lg:col-span-5 flex justify-center pointer-events-auto py-8 relative z-20">
                  <LogoEmblem />
                </div>
              </div>
            </div>
          </div>

          {/* Floating map-explore CTA — only on desktop where there's room. On mobile,
              the inline "Explore the Network" link does the same job without colliding
              with the stacked logo emblem. */}
          <motion.button
            type="button"
            onClick={() => setExplorerOpen(true)}
            className="hidden md:inline-flex pointer-events-auto absolute bottom-12 right-12 items-center gap-3 rounded-full pl-5 pr-3 py-2.5 backdrop-blur-md group"
            style={{
              background: "rgba(212, 168, 67, 0.95)",
              color: "#050816",
              boxShadow: "0 0 0 1px rgba(232,201,122,0.6), 0 0 30px rgba(212,168,67,0.25)",
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{
              opacity: 1,
              y: 0,
              boxShadow: [
                "0 0 0 1px rgba(232,201,122,0.6), 0 0 30px rgba(212,168,67,0.25)",
                "0 0 0 1px rgba(232,201,122,0.8), 0 0 50px rgba(212,168,67,0.5)",
                "0 0 0 1px rgba(232,201,122,0.6), 0 0 30px rgba(212,168,67,0.25)",
              ],
            }}
            transition={{
              opacity: { duration: 0.7, delay: 2.2 },
              y: { duration: 0.7, delay: 2.2 },
              boxShadow: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <CursorIcon />
            <span
              className="font-display text-[14px] tracking-wide"
              style={{ fontWeight: 500 }}
            >
              Open the Map
            </span>
            <span
              aria-hidden
              className="ml-1 inline-flex items-center justify-center w-7 h-7 rounded-full"
              style={{
                background: "#050816",
                color: "#E8C97A",
              }}
            >
              <span
                className="font-display text-[14px] transition-transform duration-300 group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </motion.button>
        </div>
      </section>

      <MapExplorer
        open={explorerOpen}
        onClose={() => setExplorerOpen(false)}
      />
    </>
  );
}

function CursorIcon() {
  // Click cursor with a small ripple to telegraph "tap me"
  return (
    <span
      aria-hidden
      className="relative inline-flex items-center justify-center"
      style={{ width: 18, height: 18 }}
    >
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ border: "1.5px solid #050816" }}
        animate={{ scale: [1, 1.6, 1.6], opacity: [0.7, 0, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
      />
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M5.5 3.5l13 5.6-5.4 1.9-1.9 5.4-5.7-13z" />
      </svg>
    </span>
  );
}

function LogoEmblem() {
  // Total visual extent (logo + halo) must stay within the hero's available height
  // so the section's overflow-hidden never clips it. Container size + halo inset are
  // tuned together so the halo never reaches the section's edge.
  return (
    <div
      className="relative"
      style={{
        width: "min(480px, 86vw)",
        aspectRatio: "1 / 1",
      }}
    >
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Solid backdrop: a navy disc slightly larger than the logo that masks any
            map mesh lines passing under the logo, so the network reads as background. */}
        <div
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: "-6%",
            background:
              "radial-gradient(circle at 50% 50%, #050816 60%, rgba(5,8,22,0.85) 78%, rgba(5,8,22,0) 100%)",
          }}
        />

        {/* Halo: kept tight enough that even the largest pulse stays inside the hero box */}
        <motion.div
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: "-18%",
            background:
              "radial-gradient(circle at 50% 50%, rgba(232,201,122,0.30) 0%, rgba(212,168,67,0.10) 40%, transparent 65%)",
            filter: "blur(22px)",
          }}
          animate={{ opacity: [0.55, 0.92, 0.55], scale: [1, 1.03, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Concentric pulse rings — capped at scale 1.14 so they never extend more than 7% beyond the disc */}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border: "1px solid rgba(212, 168, 67, 0.18)" }}
          animate={{ scale: [1, 1.14, 1.14], opacity: [0.5, 0, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border: "1px solid rgba(212, 168, 67, 0.14)" }}
          animate={{ scale: [1, 1.22, 1.22], opacity: [0.35, 0, 0] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeOut",
            delay: 1.5,
          }}
        />

        {/* Static logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/SEN_Logo_cropped.png"
            alt="SEN emblem"
            className="w-full h-full object-cover rounded-full"
            style={{
              boxShadow:
                "0 0 24px rgba(212, 168, 67, 0.22), 0 0 50px rgba(212, 168, 67, 0.08)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
