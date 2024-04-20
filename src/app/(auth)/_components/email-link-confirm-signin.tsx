"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  UserCredential,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { getFirebaseAuth } from "@/auth/firebase";
import { useRedirectAfterLogin } from "@/shared/useRedirectAfterLogin";
import { loginWithCredential } from "@/api";
import { Icons } from "@/components/icons";

export function EmailLinkConfirmSignInForm() {
  const [isPending, startTransition] = React.useTransition();
  const redirectAfterLogin = useRedirectAfterLogin();

  async function handleLogin(credential: UserCredential) {
    await loginWithCredential(credential);
    toast.success("Signed In Successfully");
    redirectAfterLogin();
  }

  function handleLoginWithEmailLinkCallback() {
    startTransition(async () => {
      const auth = getFirebaseAuth();
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        console.log("this is it");
        return;
      }

      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
      }

      if (!email) {
        return;
      }

      await handleLogin(
        await signInWithEmailLink(auth, email, window.location.href)
      );
      window.localStorage.removeItem("emailForSignIn");
    });
  }

  React.useEffect(() => {
    handleLoginWithEmailLinkCallback();
  }, []);

  return (
    <div
      role="status"
      aria-label="Loading"
      aria-describedby="loading-description"
      className="flex items-center justify-center"
    >
      <Icons.spinner className="size-16 animate-spin" aria-hidden="true" />
    </div>
  );
}
