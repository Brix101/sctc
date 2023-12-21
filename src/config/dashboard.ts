import { type SidebarNavItem } from "@/types"

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[]
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Courses",
      href: "/dashboard/courses",
      icon: "library",
      items: [],
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: "users",
      items: [],
    },
  ],
}
