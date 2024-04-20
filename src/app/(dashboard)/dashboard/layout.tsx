import { MainNav } from "@/components/layouts/main-nav";
import { ModeToggle } from "@/components/layouts/mode-toggle";
import { SidebarNav } from "@/components/layouts/sidebar-nav";
import { UserAccountNav } from "@/components/layouts/user-account-nav";
import { dashboardConfig } from "@/config/dashboard";
import { authConfig } from "@/config/server-config";
import { toUser } from "@/shared/user";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: React.PropsWithChildren) {
  const tokens = await getTokens(cookies(), authConfig);
  if (!tokens) {
    redirect("/signin");
  }
  const user = toUser(tokens);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav} />
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <UserAccountNav user={user} />
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 p-4 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <SidebarNav items={dashboardConfig.sidebarNav} />
        </aside>
        <main className="flex w-full flex-col p-4 overflow-hidden">
          {children}
        </main>
      </div>
      {/* <SiteFooter className="border-t" /> */}
    </div>
  );
}
