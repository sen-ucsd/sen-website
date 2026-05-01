import Link from "next/link";
import { getCurrentAdmin, logoutAction } from "./actions";
import { TaskBoard } from "@/components/admin/TaskBoard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Board Portal · San Diego · SEN" };

export default async function AdminDashboard() {
  const user = await getCurrentAdmin();
  const initial = (user ?? "?").charAt(0).toUpperCase();

  return (
    <main className="min-h-screen pb-24 md:pb-32" style={{ background: "#050816" }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-30 px-4 sm:px-6 md:px-10 py-3 md:py-4 flex items-center justify-between gap-3"
        style={{
          background: "rgba(5, 8, 22, 0.85)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(30, 42, 69, 1)",
        }}
      >
        <Link
          href="/chapters/san-diego"
          aria-label="Back to chapter"
          className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors"
          style={{
            border: "1px solid rgba(30, 42, 69, 1)",
            color: "rgba(240, 236, 228, 0.6)",
          }}
        >
          <span aria-hidden className="text-[14px] leading-none">←</span>
        </Link>
        <p
          className="text-eyebrow truncate text-center sm:text-left flex-1 sm:flex-none"
          style={{ color: "rgba(232, 201, 122, 0.6)" }}
        >
          <span className="hidden sm:inline">San Diego · Board Portal</span>
          <span className="sm:hidden">Board Portal</span>
        </p>
        <div className="ml-auto flex items-center gap-2">
          {/* Avatar pill on mobile, full text on desktop */}
          <span
            className="hidden md:inline text-[12px]"
            style={{ color: "rgba(240, 236, 228, 0.55)" }}
          >
            Signed in as{" "}
            <strong style={{ color: "#E8C97A", fontWeight: 500 }}>{user}</strong>
          </span>
          <span
            className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-full text-[12px]"
            style={{
              background: "rgba(212, 168, 67, 0.12)",
              border: "1px solid rgba(212, 168, 67, 0.4)",
              color: "#E8C97A",
              fontFamily: "var(--font-newsreader)",
              fontWeight: 600,
            }}
            aria-label={`Signed in as ${user}`}
          >
            {initial}
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-[11px] sm:text-[12px] tracking-wide rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors"
              style={{
                border: "1px solid rgba(160, 124, 46, 0.35)",
                color: "rgba(240, 236, 228, 0.7)",
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-10 pt-8 md:pt-14">
        <div className="mb-8 md:mb-14">
          <h1
            className="font-display text-cream"
            style={{
              fontSize: "clamp(28px, 5vw, 64px)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              fontWeight: 500,
            }}
          >
            Work Breakdown
          </h1>
          <p
            className="mt-3 md:mt-4 text-[14px] md:text-base leading-[1.65] md:leading-[1.7] max-w-2xl"
            style={{ color: "rgba(240, 236, 228, 0.55)" }}
          >
            Every task the board is shipping this quarter. Break work down into
            children, assign it, set a due date, and walk it across the status
            line.
          </p>
        </div>

        <TaskBoard currentUser={user ?? "Unknown"} />
      </div>
    </main>
  );
}
