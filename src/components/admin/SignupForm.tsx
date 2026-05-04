"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

const ADMIN_BASE = "/chapters/san-diego/admin";

type Stage = "form" | "verify";

export function SignupForm() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [otp, setOtp] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleStartSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setPending(true);
    const supabase = getSupabaseBrowser();
    const { error: e2 } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: displayName.trim() },
      },
    });
    setPending(false);
    if (e2) {
      setError(e2.message);
      return;
    }
    setStage("verify");
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const supabase = getSupabaseBrowser();
    const { error: e2 } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: "signup",
    });
    if (e2) {
      setError("That code didn't match. Try again, or request a new one.");
      setPending(false);
      return;
    }
    router.replace(ADMIN_BASE);
    router.refresh();
  }

  async function handleResend() {
    setError(null);
    setInfo(null);
    setPending(true);
    const supabase = getSupabaseBrowser();
    const { error: e2 } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
    });
    setPending(false);
    if (e2) setError(e2.message);
    else setInfo("New code sent. Check your inbox.");
  }

  return (
    <AnimatePresence mode="wait">
      {stage === "form" ? (
        <motion.form
          key="form"
          onSubmit={handleStartSignup}
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Field label="Display name" hint="How you'll show up in tasks. Pick what your board calls you.">
            <input
              type="text"
              required
              autoFocus
              minLength={2}
              maxLength={32}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="First name or how the board calls you"
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="you@school.edu"
            />
          </Field>

          <Field label="Password" hint="At least 8 characters.">
            <input
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </Field>

          {error && (
            <p className="text-[14px]" style={{ color: "#E8A35E" }} role="alert">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={
              pending || !email || !password || !displayName.trim()
            }
            className="w-full rounded-full py-3.5 font-display text-[15px] tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "#D4A843", color: "#050816", fontWeight: 500 }}
            whileHover={
              !pending && email && password && displayName
                ? { scale: 1.02, boxShadow: "0 0 30px rgba(212,168,67,0.3)" }
                : undefined
            }
            whileTap={
              !pending && email && password && displayName
                ? { scale: 0.98 }
                : undefined
            }
          >
            {pending ? "Sending code…" : "Send Verification Code"}
          </motion.button>

          <p
            className="text-[13px] text-center pt-2"
            style={{ color: "rgba(240, 236, 228, 0.5)" }}
          >
            Already have an account?{" "}
            <Link
              href={`${ADMIN_BASE}/login`}
              className="underline-offset-4 hover:underline"
              style={{ color: "#E8C97A" }}
            >
              Sign in
            </Link>
          </p>
        </motion.form>
      ) : (
        <motion.form
          key="verify"
          onSubmit={handleVerify}
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <p
            className="text-[14px] leading-[1.65]"
            style={{ color: "rgba(240, 236, 228, 0.7)" }}
          >
            We sent a 6-digit code to{" "}
            <strong style={{ color: "#F0ECE4" }}>{email}</strong>. Enter it
            below to finish setting up your account.
          </p>

          <Field label="Verification code">
            <input
              type="text"
              required
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\\d{6}"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className={`${inputClass} text-center tracking-[0.4em]`}
              style={{
                ...inputStyle,
                fontFamily: "var(--font-newsreader)",
                fontSize: 24,
              }}
              placeholder="000000"
            />
          </Field>

          {info && (
            <p className="text-[13px]" style={{ color: "#7AC892" }} role="status">
              {info}
            </p>
          )}
          {error && (
            <p className="text-[14px]" style={{ color: "#E8A35E" }} role="alert">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={pending || otp.length !== 6}
            className="w-full rounded-full py-3.5 font-display text-[15px] tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "#D4A843", color: "#050816", fontWeight: 500 }}
            whileHover={
              !pending && otp.length === 6
                ? { scale: 1.02, boxShadow: "0 0 30px rgba(212,168,67,0.3)" }
                : undefined
            }
            whileTap={!pending && otp.length === 6 ? { scale: 0.98 } : undefined}
          >
            {pending ? "Verifying…" : "Verify & Continue"}
          </motion.button>

          <div className="flex items-center justify-between text-[13px] pt-2">
            <button
              type="button"
              onClick={() => {
                setStage("form");
                setOtp("");
                setError(null);
                setInfo(null);
              }}
              className="underline-offset-4 hover:underline"
              style={{ color: "rgba(240, 236, 228, 0.5)" }}
            >
              ← Use a different email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={pending}
              className="underline-offset-4 hover:underline disabled:opacity-50"
              style={{ color: "rgba(232, 201, 122, 0.7)" }}
            >
              Resend code
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="text-[12px] tracking-wide block mb-2"
        style={{ color: "rgba(240, 236, 228, 0.55)" }}
      >
        {label}
      </span>
      {children}
      {hint && (
        <span
          className="text-[11px] block mt-2"
          style={{ color: "rgba(240, 236, 228, 0.35)" }}
        >
          {hint}
        </span>
      )}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg px-4 py-3 outline-none transition-colors text-base focus:border-[rgba(212,168,67,0.45)]";

const inputStyle: React.CSSProperties = {
  background: "rgba(20, 27, 45, 0.55)",
  border: "1px solid rgba(30, 42, 69, 1)",
  color: "#F0ECE4",
  fontFamily: "var(--font-manrope)",
};
