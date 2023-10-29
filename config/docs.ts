import { MainNavItem, SidebarNavItem } from "types/nav"

interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "All Widgets",
      href: "/w",
    },

    {
      title: "Documentation",
      href: "https://docs.terp.network",
    },
    {
      title: "GitHub",
      href: "https://github.com/terpnetwork/community-dashboard",
      external: true,
    },

  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
          items: [],
        },
        {
          title: "Wallet Setup",
          href: "/docs/wallet",
          items: [],
        },
      ],
    },
    {
      title: "Contributing",
      items: [
        {
          title: "Introduction",
          href: "/docs/dashboard/contribute",
          items: [],
        },
        {
          title: "Request For A New Feature",
          href: "/docs/dashboard/request",
          items: [],
        },
        {
          title: "Feedback",
          href: "/docs/dashboard/feedback",
          items: [],
        },
      ],
    },
    {
      title: "Smart Contracts",
      items: [
        {
          title: "Introductions",
          href: "/docs/cosmwasm",
          items: [],
        },
      ],
    },
  ],
}