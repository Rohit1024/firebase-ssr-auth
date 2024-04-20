"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { UserCredential } from "firebase/auth";
import { getFirebaseAuth } from "@/auth/firebase";
import { useRedirectAfterLogin } from "@/shared/useRedirectAfterLogin";
import { loginWithCredential } from "@/api";
import {
  getGitHubProvider,
  getGoogleProvider,
  loginWithProvider,
} from "@/lib/firebase";

type providers = "google" | "github";

const oauthProviders = [
  { name: "Google", provider: "google", icon: "google" },
  { name: "Github", provider: "github", icon: "gitHub" },
] satisfies {
  name: string;
  icon: keyof typeof Icons;
  provider: providers;
}[];

export function OAuthSignIn() {
  const [isLoading, setIsLoading] = React.useState<providers | null>(null);
  const redirectAfterLogin = useRedirectAfterLogin();

  async function handleLogin(credential: UserCredential) {
    await loginWithCredential(credential);
    toast.success("Signed in successfully");
    redirectAfterLogin();
  }

  async function oauthSignIn(value: providers) {
    const auth = getFirebaseAuth();
    try {
      setIsLoading(value);
      if (value === "google") {
        await handleLogin(
          await loginWithProvider(auth, getGoogleProvider(auth))
        );
      } else if (value === "github") {
        await handleLogin(
          await loginWithProvider(auth, getGitHubProvider(auth))
        );
      }
    } catch (error: any) {
      toast.error(error.code);
      console.log(error);
    } finally {
      setIsLoading(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
      {oauthProviders.map((provider) => {
        const Icon = Icons[provider.icon];

        return (
          <Button
            aria-label={`Sign in with ${provider.name}`}
            key={provider.provider}
            variant="outline"
            className="w-full bg-background sm:w-auto"
            onClick={() => void oauthSignIn(provider.provider)}
            disabled={isLoading !== null}
          >
            {isLoading === provider.provider ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : (
              <Icon className="mr-2 size-4" aria-hidden="true" />
            )}
            {provider.name}
          </Button>
        );
      })}
    </div>
  );
}
