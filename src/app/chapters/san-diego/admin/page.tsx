import Link from "next/link";
import { getCurrentAdmin, logoutAction } from "./actions";
import { TaskBoard } from "@/components/admin/TaskBoard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Board Portal · San Diego · SEN" };

export default async function AdminDashboard() {
  const user = await getCurrentAdmin();

  return (
    <main className="min-h-screen pb-32" style={{ background: "#050816" }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-30 px-6 md:px-10 py-4 flex items-center justify-between gap-4"
        style={{
          background: "rgba(5, 8, 22, 0.85)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(30, 42, 69, 1)",
        }}
      >
        <div className="flex items-center gap-4 md:gap-6 min-w-0">
          <Link
            href="/chapters/san-diego"
            className="inline-flex items-center gap-2 text-eyebrow shrink-0 transition-colors"
            style={{ color: "rgba(240, 236, 228, 0.45)" }}
          >
            <span aria-hidden>←</span>
            <span className="hidden sm:inline">Chapter</span>
          </Link>
          <div className="min-w-0">
            <p
              className="text-eyebrow truncate"
              style={{ color: "rgba(232, 201, 122, 0.6)" }}
            >
              San Diego · Board Portal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-5">
          <span
            className="text-[12px] hidden sm:inline"
            style={{ color: "rgba(240, 236, 228, 0.55)" }}
          >
            Signed in as <strong style={{ color: "#E8C97A", fontWeight: 500 }}>{user}</strong>
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-[12px] tracking-wide rounded-full px-4 py-2 transition-colors"
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

      <div className="max-w-[1240px] mx-auto px-6 md:px-10 pt-10 md:pt-14">
        <div className="mb-10 md:mb-14">
          <h1
            className="font-display text-cream"
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              fontWeight: 500,
            }}
          >
            Work Breakdown
          </h1>
          <p
            className="mt-4 text-[15px] md:text-base leading-[1.7] max-w-2xl"
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
