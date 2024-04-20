import { EmailLinkConfirmSignInForm } from "../_components/email-link-confirm-signin";
import { Shell } from "@/components/shells/shell";

export default function ConfirmSignInPage() {
  return (
    <Shell className="max-w-lg">
      <EmailLinkConfirmSignInForm />
    </Shell>
  );
}
