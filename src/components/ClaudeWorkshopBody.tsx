"use client";

import { motion } from "framer-motion";
import { WorkshopSignupForm } from "./WorkshopSignupForm";
import { CLIMATE_ACTION_LAB_URL } from "@/lib/workshop";

type Block = {
  index: string;
  title: string;
  body: string;
};

const blocks: Block[] = [
  {
    index: "01",
    title: "Claude, the model",
    body: "Prompting that actually works, plus tool use, vision, and the parts of the model you won't find on a marketing page.",
  },
  {
    index: "02",
    title: "Claude Code",
    body: "The terminal agent end to end, including setup, hooks, and MCP, and how it plugs into a real working environment.",
  },
  {
    index: "03",
    title: "Real workflows",
    body: "A live look at how the team uses Claude day to day on projects that ship, across marketing, finance, project management, and code.",
  },
  {
    index: "04",
    title: "Bring a project",
    body: "An open working session where you push something you actually care about forward, with the room ready to unblock you whenever you get stuck.",
  },
];

export function ClaudeWorkshopBody() {
  return (
    <>
      {/* Agenda */}
      <section
        id="agenda"
        className="relative py-16 md:py-32 px-5 sm:px-8 md:px-16 lg:px-24"
        style={{ background: "rgba(10, 14, 26, 0.45)" }}
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-20 items-start mb-10 md:mb-20">
            <div className="lg:col-span-5">
              <motion.span
                className="text-eyebrow block mb-6"
                style={{ color: "rgba(232, 201, 122, 0.65)" }}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
              >
                The hour
              </motion.span>
              <motion.h2
                className="font-display text-cream"
                style={{
                  fontSize: "clamp(34px, 4.5vw, 56px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.01em",
                  fontWeight: 500,
                }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
              >
                Four blocks of the
                <br />
                hour, no filler.
              </motion.h2>
            </div>
            <motion.p
              className="lg:col-span-7 text-[16px] md:text-[17px] leading-[1.7] max-w-2xl"
              style={{ color: "rgba(240, 236, 228, 0.6)" }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Most AI workshops show you the demo while this one hands you the
              keyboard, so we move fast through the model and the terminal
              agent and then spend the rest of the hour on your work instead
              of on slides.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {blocks.map((b, i) => (
              <motion.div
                key={b.index}
                className="rounded-2xl p-6 sm:p-7 md:p-8"
                style={{
                  background: "rgba(20, 27, 45, 0.55)",
                  border: "1px solid rgba(30, 42, 69, 1)",
                }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{
                  y: -3,
                  borderColor: "rgba(160, 124, 46, 0.45)",
                  transition: { duration: 0.2 },
                }}
              >
                <div className="flex items-start gap-5">
                  <span
                    className="font-display shrink-0"
                    style={{
                      fontSize: "22px",
                      color: "rgba(232, 201, 122, 0.7)",
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {b.index}
                  </span>
                  <div>
                    <h3
                      className="font-display text-cream mb-3"
                      style={{
                        fontSize: "22px",
                        lineHeight: 1.2,
                        fontWeight: 500,
                      }}
                    >
                      {b.title}
                    </h3>
                    <p
                      className="text-[15px] leading-[1.65]"
                      style={{ color: "rgba(240, 236, 228, 0.6)" }}
                    >
                      {b.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for + logistics */}
      <section className="relative py-16 md:py-32 px-5 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-12 gap-10 lg:gap-20">
          <div className="lg:col-span-7">
            <motion.span
              className="text-eyebrow block mb-6"
              style={{ color: "rgba(232, 201, 122, 0.65)" }}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              Who it&apos;s for
            </motion.span>
            <motion.h2
              className="font-display text-cream mb-8"
              style={{
                fontSize: "clamp(30px, 4vw, 48px)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                fontWeight: 500,
              }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              UCSD students first, and builders over spectators.
            </motion.h2>

            <ul className="space-y-5">
              {[
                "Students with a marketing plan, a model, a deck, or a side project that needs to move this week, not next quarter.",
                "Anyone who has poked at Claude or ChatGPT and wants to actually use it on the work that matters.",
                "Open to the surrounding founder community as space allows. UCSD students get the seats first.",
              ].map((line, i) => (
                <motion.li
                  key={line}
                  className="flex gap-4 items-start"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <span
                    aria-hidden
                    className="mt-2.5 inline-block w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      background: "#D4A843",
                      boxShadow: "0 0 8px rgba(212, 168, 67, 0.6)",
                    }}
                  />
                  <span
                    className="text-[15px] md:text-[16px] leading-[1.7]"
                    style={{ color: "rgba(240, 236, 228, 0.65)" }}
                  >
                    {line}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="rounded-2xl p-6 sm:p-7 md:p-8"
              style={{
                background: "rgba(20, 27, 45, 0.55)",
                border: "1px solid rgba(30, 42, 69, 1)",
              }}
            >
              <span
                className="text-eyebrow block mb-5"
                style={{ color: "rgba(232, 201, 122, 0.6)" }}
              >
                Logistics
              </span>
              <dl className="space-y-5">
                <Row label="Date" value="Tuesday, May 19th" />
                <Row label="Time" value="4:00 – 5:00 PM" />
                <Row
                  label="Location"
                  value="Climate Action Lab"
                  href={CLIMATE_ACTION_LAB_URL}
                />
                <Row label="Cost" value="Free for UCSD students" />
                <Row label="Bring" value="A laptop and one real project" />
              </dl>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA / signup */}
      <section
        id="signup-bottom"
        className="relative py-16 md:py-32 px-5 sm:px-8 md:px-16 lg:px-24"
      >
        <div className="max-w-[920px] mx-auto text-center mb-12 md:mb-14">
          <motion.span
            className="text-eyebrow block mb-6"
            style={{ color: "rgba(232, 201, 122, 0.65)" }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            Reserve your spot
          </motion.span>
          <motion.h2
            className="font-display text-cream"
            style={{
              fontSize: "clamp(34px, 4.8vw, 60px)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              fontWeight: 500,
            }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            One hour to move one of your projects forward.
          </motion.h2>
        </div>

        <motion.div
          className="max-w-[680px] mx-auto rounded-2xl p-6 sm:p-7 md:p-10"
          style={{
            background: "rgba(10, 14, 26, 0.78)",
            border: "1px solid rgba(160, 124, 46, 0.35)",
            boxShadow:
              "0 30px 80px -30px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,168,67,0.06), 0 0 60px -20px rgba(212,168,67,0.18)",
          }}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <WorkshopSignupForm workshopSlug="claude" />
        </motion.div>
      </section>
    </>
  );
}

function Row({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const valueStyle = {
    fontSize: "16px",
    lineHeight: 1.3,
    fontWeight: 500,
  } as const;
  return (
    <div className="flex items-baseline justify-between gap-5">
      <dt
        className="text-[12px] tracking-wide shrink-0"
        style={{ color: "rgba(240, 236, 228, 0.45)" }}
      >
        {label}
      </dt>
      <dd className="text-right">
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
          <span className="font-display text-cream" style={valueStyle}>
            {value}
          </span>
        )}
      </dd>
    </div>
  );
}
