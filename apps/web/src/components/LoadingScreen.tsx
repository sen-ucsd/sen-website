"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

// Seeded random for consistent SSR/client rendering
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<"logo" | "launch" | "done">("logo");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        size: seededRandom(i * 7 + 1) * 2 + 0.5,
        left: seededRandom(i * 13 + 3) * 100,
        top: seededRandom(i * 17 + 5) * 100,
        isGold: seededRandom(i * 23 + 11) > 0.8,
        duration: seededRandom(i * 29 + 7) * 3 + 1.5,
        delay: seededRandom(i * 31 + 13) * 2,
      })),
    []
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        size: seededRandom(i * 41 + 17) * 4 + 1,
        isGold: seededRandom(i * 43 + 19) > 0.5,
        x: (seededRandom(i * 47 + 23) - 0.5) * 400,
        y: seededRandom(i * 53 + 29) * 300 + 50,
        duration: seededRandom(i * 59 + 31) * 1 + 0.5,
        delay: seededRandom(i * 61 + 37) * 0.4,
      })),
    []
  );

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("launch"), 1800);
    const t2 = setTimeout(() => setPhase("done"), 3200);
    const t3 = setTimeout(onComplete, 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          style={{ background: "#050816" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Background stars - only render client-side to avoid hydration mismatch */}
          <div className="absolute inset-0 overflow-hidden">
            {mounted && stars.map((star, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: star.size,
                  height: star.size,
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  background: star.isGold
                    ? "rgba(212, 168, 67, 0.6)"
                    : "rgba(240, 236, 228, 0.5)",
                }}
                animate={{ opacity: [0.1, 0.7, 0.1] }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  delay: star.delay,
                }}
              />
            ))}
          </div>

          {/* Central logo assembly */}
          <div className="relative flex items-center justify-center">
            {/* Gold ring */}
            <motion.div
              className="relative flex items-center justify-center"
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                border: "2px solid rgba(212, 168, 67, 0.7)",
              }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={
                phase === "launch"
                  ? { scale: 1.3, opacity: 0, borderColor: "rgba(212, 168, 67, 0)" }
                  : { scale: 1, opacity: 1 }
              }
              transition={
                phase === "launch"
                  ? { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                  : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
              }
            >
              {/* Inner dark fill */}
              <div
                className="absolute inset-3 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(5, 8, 22, 0.95) 50%, rgba(20, 27, 45, 0.4) 100%)",
                }}
              />

              {/* Rocket */}
              <motion.div
                className="relative z-10"
                initial={{ y: 10, opacity: 0 }}
                animate={
                  phase === "launch"
                    ? { y: -300, opacity: 0, scale: 0.5 }
                    : { y: 0, opacity: 1, scale: 1 }
                }
                transition={
                  phase === "launch"
                    ? { duration: 1.2, ease: [0.45, 0, 0.55, 1] }
                    : { duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }
                }
              >
                <svg viewBox="0 0 64 80" width="80" height="100" fill="none">
                  {/* Rocket body */}
                  <path
                    d="M32 4C32 4 20 18 20 38V48L27 43V38C27 27 32 12 32 12C32 12 37 27 37 38V43L44 48V38C44 18 32 4 32 4Z"
                    fill="#f0ece4"
                  />
                  {/* Nose cone accent */}
                  <path
                    d="M32 4C32 4 28 12 26 22L32 12L38 22C36 12 32 4 32 4Z"
                    fill="rgba(212, 168, 67, 0.15)"
                  />
                  {/* Window */}
                  <circle cx="32" cy="28" r="4.5" fill="#0a0e1a" />
                  <circle cx="32" cy="28" r="2.5" fill="#1e2a45" />
                  <circle
                    cx="31"
                    cy="27"
                    r="1"
                    fill="rgba(212, 168, 67, 0.3)"
                  />
                  {/* Fins */}
                  <path d="M20 38L15 48L20 48Z" fill="#d4a843" opacity="0.8" />
                  <path d="M44 38L49 48L44 48Z" fill="#d4a843" opacity="0.8" />
                  {/* Flame */}
                  <motion.g
                    animate={{
                      scaleY: [1, 1.15, 0.95, 1.1, 1],
                      scaleX: [1, 0.9, 1.05, 0.95, 1],
                    }}
                    transition={{
                      duration: 0.4,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }}
                    style={{ transformOrigin: "32px 48px" }}
                  >
                    <path d="M24 48L32 72L40 48" fill="#d4a843" />
                    <path d="M28 48L32 66L36 48" fill="#e8c97a" />
                    <path
                      d="M30 48L32 60L34 48"
                      fill="#f0ece4"
                      opacity="0.5"
                    />
                  </motion.g>
                </svg>
              </motion.div>
            </motion.div>

            {/* Motto text */}
            <motion.p
              className="absolute whitespace-nowrap text-xs tracking-[0.4em] uppercase"
              style={{
                fontFamily: "var(--font-syne)",
                color: "rgba(212, 168, 67, 0.5)",
                top: "calc(50% + 130px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "logo" ? 1 : 0 }}
              transition={{ duration: 0.5, delay: phase === "logo" ? 0.8 : 0 }}
            >
              Per Ardua Ad Astra
            </motion.p>
          </div>

          {/* Launch particles */}
          {phase === "launch" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {particles.map((p, i) => (
                <motion.div
                  key={`p-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: p.size,
                    height: p.size,
                    background: p.isGold ? "#d4a843" : "#e8c97a",
                  }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
