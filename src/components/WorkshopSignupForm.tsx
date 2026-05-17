"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface FormState {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  notes: "",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7;
}

export function WorkshopSignupForm({
  workshopSlug,
  compact = false,
}: {
  workshopSlug: string;
  compact?: boolean;
}) {
  const [data, setData] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!data.name.trim()) return setErr("Your name is required.");
    if (!isValidEmail(data.email))
      return setErr("Please enter a valid email address.");
    if (!isValidPhone(data.phone))
      return setErr("Please enter a real phone number.");

    setSubmitting(true);
    const { error } = await supabase.from("workshop_signups").insert({
      workshop_slug: workshopSlug,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      notes: data.notes.trim() || null,
    });
    setSubmitting(false);

    if (error) {
      setErr(
        "Something went wrong on our side. Try again in a moment, or email sen@ucsd.edu directly."
      );
      console.error(error);
      return;
    }
    setDone(true);
    setData(INITIAL);
  }

  if (done) {
    return (
      <motion.div
        className="rounded-2xl p-8 md:p-10 text-center"
        style={{
          background: "rgba(20, 27, 45, 0.65)",
          border: "1px solid rgba(212, 168, 67, 0.4)",
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          aria-hidden
          className="inline-block w-2 h-2 rounded-full mb-5"
          style={{
            background: "#E8C97A",
            boxShadow: "0 0 14px rgba(232, 201, 122, 0.85)",
          }}
        />
        <h3
          className="font-display text-cream mb-3"
          style={{
            fontSize: compact
              ? "clamp(22px, 2.6vw, 30px)"
              : "clamp(26px, 3.2vw, 38px)",
            fontWeight: 500,
            lineHeight: 1.1,
          }}
        >
          You&apos;re on the list.
        </h3>
        <p
          className="max-w-md mx-auto text-[14px] md:text-[15px] leading-[1.7]"
          style={{ color: "rgba(240, 236, 228, 0.6)" }}
        >
          Confirmation and reminders go to the email you provided, so bring a
          laptop and a project worth advancing on Tuesday.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className={compact ? "grid sm:grid-cols-2 gap-4" : "grid sm:grid-cols-2 gap-5"}>
        <Field
          label="Name"
          name="name"
          value={data.name}
          onChange={(v) => update("name", v)}
          placeholder="Your name"
          required
        />
        <Field
          label="Email"
          type="email"
          name="email"
          value={data.email}
          onChange={(v) => update("email", v)}
          placeholder="you@ucsd.edu"
          required
        />
      </div>
      <Field
        label="Phone"
        type="tel"
        name="phone"
        value={data.phone}
        onChange={(v) => update("phone", v)}
        placeholder="(555) 555-5555"
        required
      />
      {!compact && (
        <Field
          label="Anything you want to work on? (optional)"
          name="notes"
          value={data.notes}
          onChange={(v) => update("notes", v)}
          placeholder="Project, question, area of focus…"
        />
      )}

      {err && (
        <p
          className="text-[13px]"
          style={{ color: "#E8A35E" }}
          role="alert"
        >
          {err}
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
        <motion.button
          type="submit"
          disabled={submitting}
          className="rounded-full px-7 py-3.5 font-display text-[14px] md:text-[15px] tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "#D4A843", color: "#050816", fontWeight: 500 }}
          whileHover={
            !submitting
              ? {
                  scale: 1.03,
                  boxShadow: "0 0 38px rgba(212,168,67,0.42)",
                }
              : undefined
          }
          whileTap={!submitting ? { scale: 0.97 } : undefined}
        >
          {submitting ? "Reserving…" : "Reserve your spot"}
        </motion.button>
        <p
          className="text-eyebrow"
          style={{ color: "rgba(240, 236, 228, 0.35)" }}
        >
          Seats are limited · UCSD priority
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span
        className="text-[12px] tracking-wide block mb-2"
        style={{ color: "rgba(240, 236, 228, 0.55)" }}
      >
        {label}
        {required ? (
          <span style={{ color: "rgba(232, 201, 122, 0.5)" }}> · required</span>
        ) : null}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg px-4 py-3 outline-none transition-colors text-base"
        style={{
          background: "rgba(20, 27, 45, 0.65)",
          border: "1px solid rgba(30, 42, 69, 1)",
          color: "#F0ECE4",
          fontFamily: "var(--font-manrope)",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = "rgba(212, 168, 67, 0.55)")
        }
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "rgba(30, 42, 69, 1)")
        }
      />
    </label>
  );
}
