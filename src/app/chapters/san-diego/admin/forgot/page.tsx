import { ForgotPasswordForm } from "@/components/admin/ForgotPasswordForm";
import { AuthShell } from "@/components/admin/AuthShell";

export const metadata = {
  title: "Reset password · San Diego Admin · SEN",
};

export default function ForgotPage() {
  return (
    <AuthShell
      title="Let's get you back in."
      description="Enter the email you used to sign up. We'll send a 6-digit code so you can pick a new password."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
