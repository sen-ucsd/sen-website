"use client";

import { motion } from "framer-motion";
// Using img tag to avoid Next.js Image warnings for a small decorative logo

export default function Footer() {
  return (
    <footer
      className="relative py-20 px-8 md:px-12"
      style={{ borderTop: "1px solid rgba(240, 236, 228, 0.04)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/SEN_Logo.png"
              alt="SEN"
              width={32}
              height={32}
              className="rounded-full"
              style={{ opacity: 0.5 }}
            />
            <div>
              <p
                className="text-[11px] font-semibold tracking-[0.15em] uppercase"
                style={{
                  fontFamily: "var(--font-syne)",
                  color: "rgba(240, 236, 228, 0.35)",
                }}
              >
                Student Entrepreneurs Network
              </p>
              <p
                className="text-[11px] mt-1"
                style={{ color: "rgba(240, 236, 228, 0.15)" }}
              >
                UC San Diego
              </p>
            </div>
          </div>

          <div className="flex items-center gap-10">
            {[
              { label: "sen@ucsd.edu", href: "mailto:sen@ucsd.edu" },
              {
                label: "Instagram",
                href: "https://www.instagram.com/senucsd/",
              },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/company/student-entrepreneurs-network/",
              },
            ].map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="text-[12px] transition-colors duration-300"
                style={{ color: "rgba(240, 236, 228, 0.25)" }}
                whileHover={{ y: -1, color: "rgba(212, 168, 67, 0.5)" }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </div>

        <div
          className="mt-16 pt-10 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(240, 236, 228, 0.04)" }}
        >
          <p className="text-[11px]" style={{ color: "rgba(240, 236, 228, 0.1)" }}>
            &copy; {new Date().getFullYear()} Student Entrepreneurs Network.
            All rights reserved.
          </p>
          <p
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: "var(--font-syne)",
              color: "rgba(240, 236, 228, 0.07)",
            }}
          >
            Per Ardua Ad Astra
          </p>
        </div>
      </div>
    </footer>
  );
}
