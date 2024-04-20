import { ProfileForm } from "@/components/profile-form";
import { Separator } from "@/components/ui/separator";
import { authConfig } from "@/config/server-config";
import { toUser } from "@/shared/user";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";

export default async function SettingsProfilePage() {
  const tokens = await getTokens(cookies(), authConfig);
  const user = tokens ? toUser(tokens) : null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}
