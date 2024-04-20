import * as z from "zod";

export const email_link_schema = z.object({
  email: z
    .string({
      required_error: "Email is Required",
    })
    .email({
      message: "Please enter a valid email address",
    }),
});

export type EmailLinkType = z.infer<typeof email_link_schema>;
