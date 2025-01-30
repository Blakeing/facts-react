import { Link } from "@tanstack/react-router";
import { FileText, Home, Info } from "lucide-react";

import type { LucideIcon } from "lucide-react";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type RouteUrl = "/" | "/posts" | "/about";

interface SubNavItem {
	title: string;
	url: string;
}

interface NavItem {
	title: string;
	url: RouteUrl;
	icon: LucideIcon;
	isActive?: boolean;
	items?: SubNavItem[];
}

interface NavMainProps {
	items?: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
	const defaultNavItems: NavItem[] = [
		{
			title: "Home",
			url: "/",
			icon: Home,
		},
		{
			title: "Posts",
			url: "/posts",
			icon: FileText,
		},
		{
			title: "About",
			url: "/about",
			icon: Info,
		},
	];

	const navItems = items || defaultNavItems;

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Navigation</SidebarGroupLabel>
			<SidebarMenu>
				{navItems.map((item) => (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton asChild>
							<Link
								to={item.url}
								className="flex items-center gap-2"
								activeProps={{
									className: "font-bold",
								}}
								activeOptions={{ exact: item.url === "/" }}
							>
								<item.icon className="h-4 w-4" />
								<span>{item.title}</span>
							</Link>
						</SidebarMenuButton>
						{item.items && (
							<SidebarMenuSub>
								{item.items.map((subItem) => (
									<SidebarMenuSubItem key={subItem.title}>
										<SidebarMenuSubButton asChild>
											<Link
												to={subItem.url as RouteUrl}
												activeProps={{
													className: "font-bold",
												}}
											>
												{subItem.title}
											</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								))}
							</SidebarMenuSub>
						)}
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
