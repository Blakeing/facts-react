import { Link } from '@tanstack/react-router'
import { BookOpen, Bot, Command } from 'lucide-react'
import * as React from 'react'

import { NavMain } from './NavMain'
import { NavUser } from './NavUser'

import type { NavItem, ProjectItem, RouteUrl, SecondaryNavItem } from '@/types/nav'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Home',
      url: '/' as RouteUrl,
      icon: Command,
    },
    {
      title: 'Posts',
      url: '/posts' as RouteUrl,
      icon: BookOpen,
    },
    {
      title: 'About',
      url: '/about' as RouteUrl,
      icon: Bot,
    },
    {
      title: 'Layout A',
      url: '/layout-a' as RouteUrl,
      icon: Bot,
    },
  ] satisfies NavItem[],
  navSecondary: [
    // {
    //   title: 'Support',
    //   url: '/' as RouteUrl,
    //   icon: LifeBuoy,
    // },
    // {
    //   title: 'Feedback',
    //   url: '/about' as RouteUrl,
    //   icon: Send,
    // },
  ] satisfies SecondaryNavItem[],
  projects: [
    // {
    //   name: 'Design Engineering',
    //   url: '/' as RouteUrl,
    //   icon: Frame,
    // },
    // {
    //   name: 'Sales & Marketing',
    //   url: '/posts' as RouteUrl,
    //   icon: PieChart,
    // },
    // {
    //   name: 'Travel',
    //   url: '/about' as RouteUrl,
    //   icon: Map,
    // },
  ] satisfies ProjectItem[],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-(--header-height))]" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
                  <Command className="h-4 w-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
