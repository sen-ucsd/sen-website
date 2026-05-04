import Link from "next/link";
import { AuthShell } from "@/components/admin/AuthShell";

export const metadata = {
  title: "Closed · San Diego Admin · SEN",
};

const ADMIN_BASE = "/chapters/san-diego/admin";

// Signups are also disabled at the Supabase Auth layer
// (config.auth.disable_signup = true). This page is the visible counterpart so
// anyone who hits /signup directly sees a clear message instead of a form
// that would just error.
export default function SignupPage() {
  return (
    <AuthShell
      title="By invite only."
      description="The board portal is locked to existing exec members. If you should have access, ask an exec to add you directly."
    >
      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(20, 27, 45, 0.55)",
          border: "1px solid rgba(30, 42, 69, 1)",
        }}
      >
        <p
          className="text-[14px] leading-[1.7]"
          style={{ color: "rgba(240, 236, 228, 0.65)" }}
        >
          New accounts can&apos;t be created from this page. Sign in if you
          already have one, or reach an exec on Slack to be added.
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3 text-[13px]">
        <Link
          href={`${ADMIN_BASE}/login`}
          className="rounded-full px-5 py-2.5 tracking-wide font-display"
          style={{
            background: "#D4A843",
            color: "#050816",
            fontWeight: 500,
          }}
        >
          Sign in
        </Link>
        <Link
          href={`${ADMIN_BASE}/forgot`}
          className="underline-offset-4 hover:underline"
          style={{ color: "rgba(232, 201, 122, 0.7)" }}
        >
          Forgot password?
        </Link>
      </div>
    </AuthShell>
  );
}
