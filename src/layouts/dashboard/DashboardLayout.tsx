import { Outlet } from '@tanstack/react-router'

import { DashboardSidebar } from './DashboardSidebar'

export const DashboardLayout = () => {
  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
