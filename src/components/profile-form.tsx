"use client";

import { useAuth } from "@/auth/AuthContext";
import { getFirebaseStorage } from "@/auth/firebase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuth, updateProfile } from "firebase/auth";
import { ref } from "firebase/storage";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Icons } from "./icons";
import { ImageUpload } from "./image-upload";

const profileFormSchema = z.object({
  displayname: z
    .string({ required_error: "Display Name is required" })
    .min(3, {
      message: "Display Name must be at least 3 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { user } = useAuth();
  const [isPending, startTransition] = React.useTransition();
  const [uploadedImagePath, setUploadedImagePath] = useState(user?.photoURL);
  const imageRef = ref(getFirebaseStorage(), `profiles/${user?.uid}`);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayname: user?.displayName ?? "User",
    },
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    startTransition(async () => {
      try {
        await updateProfile(getAuth().currentUser!, {
          displayName: data.displayname,
          photoURL: uploadedImagePath,
        });
        toast.success("Profile Updated Sucessfully");
      } catch (error) {
        console.log(error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-normal items-stretch gap-x-6">
        <Image
          width={1000}
          height={1000}
          className=" shadow-md w-24 h-24 border rounded-md object-cover"
          src={uploadedImagePath ? uploadedImagePath : "/images/avatar.png"}
          alt="sample pfp"
          priority={false}
        />
        <div className=" space-y-2">
          <h1 className=" font-semibold">Profile Picture</h1>
          <div className=" text-gray-500 text-xs">
            We support PNGs, JPEGs under 10MB
          </div>
          <div className=" flex items-center justify-normal gap-x-3">
            <ImageUpload
              storageRef={imageRef}
              uploadedImagePath={uploadedImagePath}
              handleUploadedPath={setUploadedImagePath}
            />
            <Button size={"icon"} variant={"outline"}>
              <Icons.delete size="1.4em" />
            </Button>
          </div>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="displayname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="text" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or
                  a pseudonym.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}{" "}
            Update profile
          </Button>
        </form>
      </Form>
    </div>
  );
}
