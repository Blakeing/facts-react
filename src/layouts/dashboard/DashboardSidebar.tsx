import { SidebarItem } from "./components/SidebarItem";

const navigationItems = [
	{ name: "Overview", path: "/" },
	{ name: "Users", path: "/users" },
	{ name: "Analytics", path: "/analytics" },
	{ name: "Settings", path: "/settings" },
];

export const DashboardSidebar = () => {
	return (
		<aside className="w-64 border-r bg-white px-4 py-6">
			<nav className="space-y-1">
				{navigationItems.map((item) => (
					<SidebarItem key={item.path} {...item} />
				))}
			</nav>
		</aside>
	);
};
