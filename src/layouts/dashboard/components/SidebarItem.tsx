import { Link } from '@tanstack/react-router'

interface SidebarItemProps {
  name: string
  path: string
}

export const SidebarItem = ({ name, path }: SidebarItemProps) => {
  return (
    <Link
      to={path}
      className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    >
      {name}
    </Link>
  )
}
