"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface FormState {
  full_name: string;
  email: string;
  university: string;
  country: string;
  year_in_school: string;
  portfolio_url: string;
  why_you: string;
  what_built: string;
  notes: string;
}

const INITIAL: FormState = {
  full_name: "",
  email: "",
  university: "",
  country: "",
  year_in_school: "",
  portfolio_url: "",
  why_you: "",
  what_built: "",
  notes: "",
};

export function ApplicationForm() {
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

    // Basic validation
    if (!data.full_name.trim()) return setErr("Your name is required.");
    if (!data.email.includes("@")) return setErr("A real email is required.");
    if (!data.university.trim()) return setErr("Your university is required.");
    if (data.why_you.trim().length < 60)
      return setErr(
        "The first long answer should be at least 60 characters. Real answers matter."
      );
    if (data.what_built.trim().length < 60)
      return setErr(
        "The second long answer should be at least 60 characters."
      );

    setSubmitting(true);
    const { error } = await supabase
      .from("chapter_applications")
      .insert({
        full_name: data.full_name.trim(),
        email: data.email.trim(),
        university: data.university.trim(),
        country: data.country.trim() || null,
        year_in_school: data.year_in_school.trim() || null,
        portfolio_url: data.portfolio_url.trim() || null,
        why_you: data.why_you.trim(),
        what_built: data.what_built.trim(),
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
        className="rounded-2xl p-12 text-center"
        style={{
          background: "rgba(20, 27, 45, 0.5)",
          border: "1px solid rgba(212, 168, 67, 0.35)",
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          aria-hidden
          className="inline-block w-2 h-2 rounded-full mb-6"
          style={{
            background: "#E8C97A",
            boxShadow: "0 0 14px rgba(232, 201, 122, 0.85)",
          }}
        />
        <h2
          className="font-display text-cream mb-4"
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 500,
            lineHeight: 1.05,
          }}
        >
          The application is in.
        </h2>
        <p
          className="max-w-md mx-auto text-[15px] leading-[1.7]"
          style={{ color: "rgba(240, 236, 228, 0.55)" }}
        >
          Reviewed within seven days. If we want to keep the conversation
          going, you will hear from us at the email you provided. In the
          meantime, the rest of the network is below.
        </p>
        <a
          href="/"
          className="inline-block mt-9 rounded-full px-7 py-3.5 font-display text-[14px] tracking-wide"
          style={{ background: "#D4A843", color: "#050816", fontWeight: 500 }}
        >
          Back to the Network
        </a>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-12"
      noValidate
    >
      <FieldSet legend="About you">
        <div className="grid sm:grid-cols-2 gap-6">
          <Field
            label="Full Name"
            name="full_name"
            value={data.full_name}
            onChange={(v) => update("full_name", v)}
            placeholder="Mina Hosseini"
            required
          />
          <Field
            label="Email"
            type="email"
            name="email"
            value={data.email}
            onChange={(v) => update("email", v)}
            placeholder="you@school.edu"
            required
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <Field
            label="University"
            name="university"
            value={data.university}
            onChange={(v) => update("university", v)}
            placeholder="UC San Diego"
            required
          />
          <Field
            label="Country"
            name="country"
            value={data.country}
            onChange={(v) => update("country", v)}
            placeholder="USA"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <SelectField
            label="Year in School"
            value={data.year_in_school}
            onChange={(v) => update("year_in_school", v)}
            options={[
              { v: "", label: "Select one" },
              { v: "freshman", label: "Freshman" },
              { v: "sophomore", label: "Sophomore" },
              { v: "junior", label: "Junior" },
              { v: "senior", label: "Senior" },
              { v: "graduate", label: "Graduate" },
              { v: "other", label: "Other" },
            ]}
          />
          <Field
            label="Portfolio or LinkedIn URL"
            name="portfolio_url"
            value={data.portfolio_url}
            onChange={(v) => update("portfolio_url", v)}
            placeholder="https://..."
          />
        </div>
      </FieldSet>

      <FieldSet legend="The actual application">
        <Textarea
          label="Why are you the person to start this chapter?"
          hint="2 to 4 sentences. Concrete reasons beat ambitious ones."
          name="why_you"
          value={data.why_you}
          onChange={(v) => update("why_you", v)}
          required
          minLength={60}
        />
        <Textarea
          label="What have you built or shipped?"
          hint="A startup, a side project, a club, a research output, a piece of writing. Links welcome."
          name="what_built"
          value={data.what_built}
          onChange={(v) => update("what_built", v)}
          required
          minLength={60}
        />
        <Textarea
          label="Anything else we should know?"
          hint="Optional. Skip if there isn't anything."
          name="notes"
          value={data.notes}
          onChange={(v) => update("notes", v)}
        />
      </FieldSet>

      {err && (
        <p
          className="text-[14px]"
          style={{ color: "#E8A35E" }}
          role="alert"
        >
          {err}
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-4">
        <motion.button
          type="submit"
          disabled={submitting}
          className="rounded-full px-9 py-4 font-display text-[15px] tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "#D4A843", color: "#050816", fontWeight: 500 }}
          whileHover={!submitting ? {
            scale: 1.03,
            boxShadow: "0 0 38px rgba(212,168,67,0.42)",
          } : undefined}
          whileTap={!submitting ? { scale: 0.97 } : undefined}
        >
          {submitting ? "Sending…" : "Submit Application"}
        </motion.button>
        <p
          className="text-eyebrow"
          style={{ color: "rgba(240, 236, 228, 0.35)" }}
        >
          Reviewed Weekly · Reply within Seven Days
        </p>
      </div>
    </form>
  );
}

function FieldSet({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-6">
      <legend
        className="text-eyebrow mb-2 block"
        style={{ color: "rgba(232, 201, 122, 0.55)" }}
      >
        {legend}
      </legend>
      <div className="space-y-6">{children}</div>
    </fieldset>
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
          background: "rgba(20, 27, 45, 0.55)",
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

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { v: string; label: string }[];
}) {
  return (
    <label className="block">
      <span
        className="text-[12px] tracking-wide block mb-2"
        style={{ color: "rgba(240, 236, 228, 0.55)" }}
      >
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg px-4 py-3 outline-none transition-colors text-base appearance-none"
        style={{
          background: "rgba(20, 27, 45, 0.55)",
          border: "1px solid rgba(30, 42, 69, 1)",
          color: "#F0ECE4",
          fontFamily: "var(--font-manrope)",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%23A07C2E' stroke-width='1.4' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 16px center",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = "rgba(212, 168, 67, 0.55)")
        }
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "rgba(30, 42, 69, 1)")
        }
      >
        {options.map((o) => (
          <option
            key={o.v}
            value={o.v}
            style={{ background: "#0A0E1A", color: "#F0ECE4" }}
          >
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea({
  label,
  hint,
  name,
  value,
  onChange,
  required,
  minLength,
}: {
  label: string;
  hint?: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
}) {
  const length = value.length;
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
      {hint && (
        <span
          className="text-[12px] block mb-3"
          style={{ color: "rgba(240, 236, 228, 0.35)" }}
        >
          {hint}
        </span>
      )}
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        required={required}
        minLength={minLength}
        className="w-full rounded-lg px-4 py-3 outline-none transition-colors text-base leading-[1.65] resize-y"
        style={{
          background: "rgba(20, 27, 45, 0.55)",
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
      {minLength && (
        <p
          className="mt-2 text-[11px]"
          style={{
            color:
              length >= minLength
                ? "rgba(232, 201, 122, 0.55)"
                : "rgba(240, 236, 228, 0.3)",
          }}
        >
          {length} / {minLength} minimum
        </p>
      )}
    </label>
  );
}
