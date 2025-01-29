import { Link, useMatches } from '@tanstack/react-router'
import { SidebarIcon } from 'lucide-react'
import React from 'react'

import { SearchForm } from './SearchForm'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useSidebar } from '@/components/ui/sidebar'

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const matches = useMatches()

  // Create breadcrumbs from route matches
  const breadcrumbs = matches
    .filter((match) => match.routeId !== '/' && match.routeId !== '__root__')
    .map((match) => {
      // Handle post ID display
      if (match.routeId === '/posts/$postId') {
        return {
          label: `Post ${match.params.postId}`,
          to: match.pathname,
        }
      }
      // Handle other routes
      return {
        label: match.routeId.split('/').pop()?.replace(/[.$]/g, '') || '',
        to: match.pathname,
      }
    })

  const showHome = matches.length > 1 // Only show Home in breadcrumbs if we're not on the home page

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />

        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            {showHome && (
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.to}>
                {showHome && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage className="capitalize">{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={crumb.to} className="capitalize">
                        {crumb.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
      </div>
    </header>
  )
}
