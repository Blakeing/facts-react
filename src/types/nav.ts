import type { LucideIcon } from 'lucide-react'

export type RouteUrl = '/' | '/posts' | '/about'

export interface SubNavItem {
  title: string
  url: RouteUrl
}

export interface NavItem {
  title: string
  url: RouteUrl
  icon: LucideIcon
  isActive?: boolean
  items?: SubNavItem[]
}

export interface ProjectItem {
  name: string
  url: RouteUrl
  icon: LucideIcon
}

export interface SecondaryNavItem {
  title: string
  url: RouteUrl
  icon: LucideIcon
}
