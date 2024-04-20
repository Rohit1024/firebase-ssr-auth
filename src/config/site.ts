import { MainNavItem } from "@/types";

export const siteConfig = {
  name: "Firebase ssr auth demo",
  description:
    "Next.js Firebase Authentication for Edge and Node.js runtimes. Compatible with latest Next.js features.",
  url: "https://localhost:3000",
  ogImage: "/public/images/backdrop.jpg",
  links: {
    github: "",
  },
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          description: "Dashboard Details",
          items: [],
        },
        {
          title: "Posts",
          href: "/dashboard/posts",
          description: "Manage you posts",
          items: [],
        },
        {
          title: "Account",
          href: "/dashboard/account",
          description: "Manage your account settings",
          items: [],
        },
        {
          title: "Blog",
          href: "/blog",
          description: "Read our latest blog posts.",
          items: [],
        },
      ],
    },
  ] satisfies MainNavItem[],
};
