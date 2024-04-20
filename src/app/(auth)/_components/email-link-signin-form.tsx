"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";

import { getFirebaseAuth } from "@/auth/firebase";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EmailLinkType, email_link_schema } from "@/lib/validations/auth";
import { sendSignInLinkToEmail } from "firebase/auth";
import { toast } from "sonner";

export function EmailLinkSignInForm() {
  const [isPending, startTransition] = React.useTransition();

  // react-hook-form
  const form = useForm<EmailLinkType>({
    resolver: zodResolver(email_link_schema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: EmailLinkType) {
    startTransition(async () => {
      try {
        const auth = getFirebaseAuth();

        window.localStorage.setItem("emailForSignIn", values.email);

        await sendSignInLinkToEmail(auth, values.email, {
          url: `${origin}/sso-callback`,
          handleCodeInApp: true,
        });
        toast.success("Check your Email", {
          description: "We have sent you the signin link for the further steps",
        });
      } catch (err: any) {
        toast.error(err.code);
        console.log(err);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="rodneymullen180@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending && (
            <Icons.spinner
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Sign in with Email
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form>
  );
}
