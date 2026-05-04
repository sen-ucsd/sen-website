import { LoginForm } from "@/components/admin/LoginForm";
import { AuthShell } from "@/components/admin/AuthShell";

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
    <AuthShell
      title="Board Portal"
      description="Sign in to track tasks for the San Diego exec board."
    >
      <LoginForm next={sp.from} />
    </AuthShell>
  );
}
