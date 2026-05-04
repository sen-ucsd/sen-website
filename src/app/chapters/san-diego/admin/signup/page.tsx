import { SignupForm } from "@/components/admin/SignupForm";
import { AuthShell } from "@/components/admin/AuthShell";

export const metadata = {
  title: "Create account · San Diego Admin · SEN",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Join the board."
      description="Create an account so the rest of the board can assign you tasks and see your work."
    >
      <SignupForm />
    </AuthShell>
  );
}
