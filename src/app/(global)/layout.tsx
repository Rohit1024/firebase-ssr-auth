import Link from "next/link";

import { globalConfig } from "@/config/global-config";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/layouts/mode-toggle";
import { MainNav } from "@/components/layouts/main-nav";
import { UserAccountNav } from "@/components/layouts/user-account-nav";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";
import { toUser } from "@/shared/user";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function GlobalLayout({ children }: MarketingLayoutProps) {
  const tokens = await getTokens(cookies(), authConfig);
  const user = tokens ? toUser(tokens) : null;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={globalConfig.mainNav} />
          <nav>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              {user ? (
                <UserAccountNav user={user} />
              ) : (
                <Link
                  href="/signin"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "px-4"
                  )}
                >
                  Signin
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      {/* <SiteFooter /> */}
    </div>
  );
}
