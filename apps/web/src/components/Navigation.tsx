"use client";

import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { useState, useEffect } from "react";
const navLinks = [
  { label: "About", href: "#about" },
  { label: "Programs", href: "#programs" },
  { label: "Summit", href: "#summit" },
  { label: "Community", href: "#community" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const navBg = useMotionValue("rgba(5, 8, 22, 0)");
  const navBorder = useMotionValue("rgba(212, 168, 67, 0)");

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (v) => {
      const progress = Math.min(v / 100, 1);
      navBg.set(`rgba(5, 8, 22, ${progress * 0.9})`);
      navBorder.set(`rgba(212, 168, 67, ${progress * 0.08})`);
    });
    return unsubscribe;
  }, [scrollY, navBg, navBorder]);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[100] px-8 md:px-12"
        style={{
          backgroundColor: navBg,
          borderBottom: `1px solid`,
          borderColor: navBorder,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-[72px] md:h-20">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/SEN_Logo.png"
              alt="SEN"
              width={34}
              height={34}
              className="rounded-full"
              loading="eager"
            />
            <span
              className="text-[12px] font-semibold tracking-[0.2em] uppercase"
              style={{
                fontFamily: "var(--font-syne)",
                color: "#f0ece4",
              }}
            >
              SEN
            </span>
          </motion.a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-[13px] tracking-wide transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-outfit)",
                  color: "rgba(240, 236, 228, 0.5)",
                }}
                whileHover={{ y: -1, color: "rgba(212, 168, 67, 0.8)" }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#join"
              className="text-[12px] px-5 py-2.5 rounded-full tracking-wide transition-all duration-300"
              style={{
                border: "1px solid rgba(212, 168, 67, 0.25)",
                color: "#d4a843",
              }}
              whileHover={{
                scale: 1.03,
                background: "rgba(212, 168, 67, 0.08)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              Join SEN
            </motion.a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-5 h-px"
              style={{ background: "#f0ece4" }}
              animate={mobileOpen ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="block w-5 h-px"
              style={{ background: "#f0ece4" }}
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span
              className="block w-5 h-px"
              style={{ background: "#f0ece4" }}
              animate={mobileOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <motion.div
        className="fixed inset-0 z-[99] flex flex-col items-center justify-center gap-10 md:hidden"
        style={{
          background: "rgba(5, 8, 22, 0.97)",
          backdropFilter: "blur(20px)",
        }}
        initial={false}
        animate={
          mobileOpen
            ? { opacity: 1, pointerEvents: "auto" as const }
            : { opacity: 0, pointerEvents: "none" as const }
        }
        transition={{ duration: 0.3 }}
      >
        {navLinks.map((link, i) => (
          <motion.a
            key={link.href}
            href={link.href}
            className="text-2xl font-medium transition-colors"
            style={{
              fontFamily: "var(--font-syne)",
              color: "rgba(240, 236, 228, 0.7)",
            }}
            onClick={() => setMobileOpen(false)}
            initial={{ y: 20, opacity: 0 }}
            animate={
              mobileOpen ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
            }
            transition={{ delay: i * 0.08 + 0.1 }}
          >
            {link.label}
          </motion.a>
        ))}
        <motion.a
          href="#join"
          className="text-lg px-8 py-3.5 rounded-full mt-4"
          style={{
            border: "1px solid rgba(212, 168, 67, 0.35)",
            color: "#d4a843",
          }}
          onClick={() => setMobileOpen(false)}
          initial={{ y: 20, opacity: 0 }}
          animate={mobileOpen ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ delay: 0.45 }}
        >
          Join SEN
        </motion.a>
      </motion.div>
    </>
  );
}
