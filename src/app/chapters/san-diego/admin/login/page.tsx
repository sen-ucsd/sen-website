import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Sign in · San Diego Admin · SEN",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const sp = await searchParams;
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

        <div className="mb-10">
          <span
            className="text-eyebrow block mb-5"
            style={{ color: "rgba(232, 201, 122, 0.6)" }}
          >
            San Diego Chapter · Admin
          </span>
          <h1
            className="font-display text-cream"
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              fontWeight: 500,
            }}
          >
            Board Portal
          </h1>
          <p
            className="mt-5 text-[15px] leading-[1.7]"
            style={{ color: "rgba(240, 236, 228, 0.55)" }}
          >
            Sign in to track tasks for the San Diego exec board.
          </p>
        </div>

        <LoginForm next={sp.from} />
      </div>
    </main>
  );
}
