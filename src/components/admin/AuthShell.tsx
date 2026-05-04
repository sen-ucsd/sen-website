import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  /** Optional links shown below the form (e.g. "Already have an account? Sign in") */
  footer?: ReactNode;
}

/** Shared visual shell for the admin auth pages — sign-in, sign-up, forgot, reset. */
export function AuthShell({
  eyebrow = "San Diego Chapter · Admin",
  title,
  description,
  children,
  footer,
}: Props) {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ background: "#050816" }}
    >
      <div className="w-full max-w-md">
        <Link
          href="/chapters/san-diego"
          className="inline-flex items-center gap-2 text-eyebrow mb-10 transition-colors"
          style={{ color: "rgba(240, 236, 228, 0.45)" }}
        >
          <span aria-hidden>←</span>
          <span>Back to San Diego</span>
        </Link>

        <div className="mb-8">
          <span
            className="text-eyebrow block mb-5"
            style={{ color: "rgba(232, 201, 122, 0.6)" }}
          >
            {eyebrow}
          </span>
          <h1
            className="font-display text-cream"
            style={{
              fontSize: "clamp(32px, 4.6vw, 52px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 500,
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              className="mt-5 text-[15px] leading-[1.7]"
              style={{ color: "rgba(240, 236, 228, 0.55)" }}
            >
              {description}
            </p>
          )}
        </div>

        {children}

        {footer && (
          <div
            className="mt-8 pt-6 text-[13px] leading-relaxed"
            style={{
              borderTop: "1px solid rgba(30, 42, 69, 1)",
              color: "rgba(240, 236, 228, 0.5)",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </main>
  );
}
