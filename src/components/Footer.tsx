"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <footer
      className="relative pt-28 md:pt-36 pb-12 px-8 md:px-12"
      style={{
        background: "#050816",
        borderTop: "1px solid rgba(212, 168, 67, 0.08)",
      }}
    >
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/SEN_Logo_cropped.png"
              alt="SEN"
              className="h-10 w-10 object-cover rounded-full"
            />
            <span
              className="font-display text-2xl tracking-[0.22em] text-cream"
              style={{ fontWeight: 500 }}
            >
              SEN
            </span>
          </div>
          <p
            className="font-display italic text-[15px] mb-4"
            style={{ color: "rgba(240, 236, 228, 0.4)" }}
          >
            Per Ardua Ad Astra.
          </p>
          <p
            className="text-eyebrow"
            style={{ color: "rgba(240, 236, 228, 0.35)" }}
          >
            Founding Chapter / San Diego, CA
          </p>
        </div>

        <div className="md:col-span-2">
          <h4
            className="text-eyebrow mb-7"
            style={{ color: "rgba(240, 236, 228, 0.85)" }}
          >
            Network
          </h4>
          <nav className="flex flex-col gap-4">
            {[
              { l: "Vision", h: "#vision" },
              { l: "Chapters", h: "#network" },
              { l: "Programs", h: "#programs" },
              { l: "Apply", h: "#start" },
            ].map((x) => (
              <a
                key={x.l}
                href={x.h}
                className="font-display text-[14px] tracking-wide transition-colors"
                style={{ color: "rgba(240, 236, 228, 0.4)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#D4A843")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(240,236,228,0.4)")
                }
              >
                {x.l}
              </a>
            ))}
          </nav>
        </div>

        <div className="md:col-span-2">
          <h4
            className="text-eyebrow mb-7"
            style={{ color: "rgba(240, 236, 228, 0.85)" }}
          >
            More
          </h4>
          <nav className="flex flex-col gap-4">
            {[
              { l: "Press", h: "#" },
              { l: "Privacy", h: "#" },
              { l: "Instagram", h: "https://instagram.com/senucsd" },
              { l: "LinkedIn", h: "#" },
            ].map((x) => (
              <a
                key={x.l}
                href={x.h}
                target={x.h.startsWith("http") ? "_blank" : undefined}
                rel={x.h.startsWith("http") ? "noopener noreferrer" : undefined}
                className="font-display text-[14px] tracking-wide transition-colors"
                style={{ color: "rgba(240, 236, 228, 0.4)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#D4A843")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(240,236,228,0.4)")
                }
              >
                {x.l}
              </a>
            ))}
          </nav>
        </div>

        <div className="md:col-span-4">
          <h4
            className="text-eyebrow mb-5"
            style={{ color: "rgba(240, 236, 228, 0.85)" }}
          >
            Updates from the Network
          </h4>
          <p
            className="text-[13px] leading-[1.6] mb-6 max-w-sm"
            style={{ color: "rgba(240, 236, 228, 0.4)" }}
          >
            One short note a month on what is shipping across chapters and
            where the next ones are opening.
          </p>
          <form
            className="relative"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              if (!email.includes("@")) return;
              const { error: err } = await supabase
                .from("newsletter_signups")
                .insert({ email: email.trim().toLowerCase(), source: "footer" });
              // Treat unique-violation (already subscribed) as success
              if (err && !err.message.toLowerCase().includes("duplicate")) {
                setError("Try again in a moment.");
                return;
              }
              setSubmitted(true);
              setEmail("");
              setTimeout(() => setSubmitted(false), 4000);
            }}
          >
            <input
              type="email"
              required
              placeholder="your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-[14px] py-3 pr-10 outline-none transition-colors"
              style={{
                color: "#F0ECE4",
                borderBottom: "1px solid rgba(30, 42, 69, 1)",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderBottomColor =
                  "rgba(212, 168, 67, 0.55)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderBottomColor = "rgba(30, 42, 69, 1)")
              }
            />
            <motion.button
              type="submit"
              aria-label="Subscribe"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[18px]"
              style={{ color: "rgba(232, 201, 122, 0.7)" }}
              whileHover={{ x: 3, color: "#E8C97A" }}
            >
              →
            </motion.button>
          </form>
          {submitted && (
            <p
              className="mt-3 text-[12px]"
              style={{ color: "rgba(232, 201, 122, 0.7)" }}
            >
              You are on the list.
            </p>
          )}
          {error && (
            <p
              className="mt-3 text-[12px]"
              style={{ color: "#E8A35E" }}
            >
              {error}
            </p>
          )}
        </div>
      </div>

      <div
        className="max-w-[1240px] mx-auto mt-24 pt-8 flex flex-col md:flex-row justify-between items-center gap-5"
        style={{ borderTop: "1px solid rgba(30, 42, 69, 1)" }}
      >
        <p
          className="text-[12px] tracking-wide"
          style={{ color: "rgba(240, 236, 228, 0.3)" }}
        >
          © {new Date().getFullYear()} Student Entrepreneurs Network. A global
          network, built one chapter at a time.
        </p>
        <p
          className="text-eyebrow"
          style={{ color: "rgba(240, 236, 228, 0.2)" }}
        >
          San Diego · Founding Chapter
        </p>
      </div>
    </footer>
  );
}
