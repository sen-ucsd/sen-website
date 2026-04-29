"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const links = [
  { label: "Vision", href: "/#vision" },
  { label: "Network", href: "/#network" },
  { label: "Programs", href: "/#programs" },
  { label: "Start a Chapter", href: "/#start" },
  { label: "Apply", href: "/apply" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled
          ? "rgba(5, 8, 22, 0.78)"
          : "rgba(5, 8, 22, 0.0)",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(160, 124, 46, 0.18)"
          : "1px solid rgba(160, 124, 46, 0)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 h-20 md:h-24 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/SEN_Logo_cropped.png"
            alt="SEN"
            className="h-9 w-9 md:h-10 md:w-10 object-cover rounded-full"
          />
          <span
            className="font-display text-xl md:text-2xl tracking-[0.22em] text-cream"
            style={{ fontWeight: 500 }}
          >
            SEN
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href + l.label}
              href={l.href}
              className="text-[13px] tracking-wide font-display transition-colors duration-300"
              style={{ color: "rgba(240, 236, 228, 0.55)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#D4A843")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(240, 236, 228, 0.55)")
              }
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/chapters/san-diego"
            className="hidden md:inline-flex items-center gap-2 text-[13px] font-display tracking-wide transition-colors duration-300"
            style={{ color: "rgba(240, 236, 228, 0.55)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#E8C97A")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(240,236,228,0.55)")
            }
          >
            <span
              aria-hidden
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{
                background: "#D4A843",
                boxShadow: "0 0 8px rgba(212, 168, 67, 0.7)",
                animation: "dot-pulse 2.4s ease-in-out infinite",
              }}
            />
            San Diego
          </Link>

          <motion.a
            href="/apply"
            className="rounded-full px-5 md:px-6 py-2.5 text-[13px] tracking-wide font-display"
            style={{
              background: "#D4A843",
              color: "#050816",
              fontWeight: 500,
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 24px rgba(212, 168, 67, 0.35)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Start a Chapter
          </motion.a>
        </div>
      </div>
    </header>
  );
}
