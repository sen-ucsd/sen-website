"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { loginAction } from "@/app/chapters/san-diego/admin/actions";
import { ADMIN_USER_LIST } from "@/lib/admin-auth";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="next" value={next ?? ""} />

      <label className="block">
        <span
          className="text-[12px] tracking-wide block mb-2"
          style={{ color: "rgba(240, 236, 228, 0.55)" }}
        >
          Username
        </span>
        <select
          name="username"
          required
          defaultValue=""
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
        >
          <option value="" disabled style={{ background: "#0A0E1A" }}>
            Select your name
          </option>
          {ADMIN_USER_LIST.map((u) => (
            <option key={u} value={u} style={{ background: "#0A0E1A" }}>
              {u}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span
          className="text-[12px] tracking-wide block mb-2"
          style={{ color: "rgba(240, 236, 228, 0.55)" }}
        >
          Password
        </span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg px-4 py-3 outline-none transition-colors text-base"
          style={{
            background: "rgba(20, 27, 45, 0.55)",
            border: "1px solid rgba(30, 42, 69, 1)",
            color: "#F0ECE4",
            fontFamily: "var(--font-manrope)",
          }}
        />
      </label>

      {state?.error && (
        <p className="text-[14px]" style={{ color: "#E8A35E" }} role="alert">
          {state.error}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={pending}
        className="w-full rounded-full py-3.5 font-display text-[15px] tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "#D4A843",
          color: "#050816",
          fontWeight: 500,
        }}
        whileHover={
          !pending ? { scale: 1.02, boxShadow: "0 0 30px rgba(212,168,67,0.3)" } : undefined
        }
        whileTap={!pending ? { scale: 0.98 } : undefined}
      >
        {pending ? "Signing in…" : "Sign In"}
      </motion.button>

      <p
        className="text-[11px] text-center pt-2"
        style={{ color: "rgba(240, 236, 228, 0.3)" }}
      >
        Hardcoded credentials for now. Real auth coming soon.
      </p>
    </form>
  );
}
