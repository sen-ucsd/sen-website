"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

const ADMIN_BASE = "/chapters/san-diego/admin";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const supabase = getSupabaseBrowser();
    const { error: e2 } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (e2) {
      setError(
        e2.message.toLowerCase().includes("invalid")
          ? "That email and password didn't match."
          : e2.message
      );
      setPending(false);
      return;
    }
    const target =
      next && next.startsWith(ADMIN_BASE) ? next : ADMIN_BASE;
    router.replace(target);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Email">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          style={inputStyle}
          placeholder="you@school.edu"
        />
      </Field>

      <Field
        label="Password"
        accessory={
          <Link
            href={`${ADMIN_BASE}/forgot`}
            className="text-[12px] underline-offset-4 hover:underline"
            style={{ color: "rgba(232, 201, 122, 0.7)" }}
          >
            Forgot?
          </Link>
        }
      >
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
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
        disabled={pending || !email || !password}
        className="w-full rounded-full py-3.5 font-display text-[15px] tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "#D4A843",
          color: "#050816",
          fontWeight: 500,
        }}
        whileHover={
          !pending && email && password
            ? { scale: 1.02, boxShadow: "0 0 30px rgba(212,168,67,0.3)" }
            : undefined
        }
        whileTap={!pending && email && password ? { scale: 0.98 } : undefined}
      >
        {pending ? "Signing in…" : "Sign In"}
      </motion.button>

      <p
        className="text-[13px] text-center pt-2"
        style={{ color: "rgba(240, 236, 228, 0.5)" }}
      >
        New to the board?{" "}
        <Link
          href={`${ADMIN_BASE}/signup`}
          className="underline-offset-4 hover:underline"
          style={{ color: "#E8C97A" }}
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  accessory,
  children,
}: {
  label: string;
  accessory?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-2">
        <span
          className="text-[12px] tracking-wide"
          style={{ color: "rgba(240, 236, 228, 0.55)" }}
        >
          {label}
        </span>
        {accessory}
      </div>
      {children}
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
