"use client";

import { useActionState, useState } from "react";
import { motion } from "framer-motion";
import { loginAction } from "@/app/chapters/san-diego/admin/actions";
import { ADMIN_USER_LIST } from "@/lib/admin-auth";
import { BrandedSelect } from "./BrandedSelect";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);
  const [username, setUsername] = useState<string>("");

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="next" value={next ?? ""} />
      <input type="hidden" name="username" value={username} />

      <label className="block">
        <span
          className="text-[12px] tracking-wide block mb-2"
          style={{ color: "rgba(240, 236, 228, 0.55)" }}
        >
          Username
        </span>
        <BrandedSelect
          ariaLabel="Username"
          value={username}
          onChange={(v) => setUsername(v)}
          menuMinWidth={260}
          variant="ghost"
          options={[
            { value: "", label: "Select your name" },
            ...ADMIN_USER_LIST.map((u) => ({
              value: u,
              label: u,
              badge: u.charAt(0),
            })),
          ]}
          renderTrigger={(s) => (
            <span className="flex items-center gap-2 flex-1 min-w-0">
              {s?.badge && (
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px]"
                  style={{
                    background: "rgba(212, 168, 67, 0.18)",
                    color: "#E8C97A",
                    fontFamily: "var(--font-newsreader)",
                    fontWeight: 600,
                  }}
                >
                  {s.badge}
                </span>
              )}
              <span
                className="truncate"
                style={{
                  color: s?.value
                    ? "#F0ECE4"
                    : "rgba(240, 236, 228, 0.45)",
                }}
              >
                {s?.label ?? "Select your name"}
              </span>
            </span>
          )}
          triggerStyle={{
            width: "100%",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderRadius: 12,
            background: "rgba(20, 27, 45, 0.55)",
          }}
        />
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
        disabled={pending || !username}
        className="w-full rounded-full py-3.5 font-display text-[15px] tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "#D4A843",
          color: "#050816",
          fontWeight: 500,
        }}
        whileHover={
          !pending && username
            ? { scale: 1.02, boxShadow: "0 0 30px rgba(212,168,67,0.3)" }
            : undefined
        }
        whileTap={!pending && username ? { scale: 0.98 } : undefined}
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
