import {
	BarChart3,
	Building2,
	ClipboardList,
	Command,
	FileText,
	FolderOpen,
	LayoutDashboard,
	LifeBuoy,
	Search,
	Send,
	Settings2,
	Workflow,
} from "lucide-react";
import type * as React from "react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";
import { NavSecondary } from "./NavSecondary";
import { NavUser } from "./NavUser";
import { Link } from "@tanstack/react-router";

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Dashboard",
			url: "/",
			icon: LayoutDashboard,
		},
		{
			title: "Search",
			url: "/search",
			icon: Search,
		},
		{
			title: "Contracts",
			icon: FileText,
			items: [
				{
					title: "At-Need",
					url: "/contracts/at-need",
				},
				{
					title: "Pre-Need",
					url: "/contracts/pre-need",
				},
			],
		},
		{
			title: "Payments",
			icon: Building2,
			items: [
				{
					title: "Batches",
					url: "/payments/batches",
				},
				{
					title: "Unapplied",
					url: "/payments/unapplied",
				},
			],
		},
		{
			title: "Workflow",
			icon: Workflow,
			items: [
				{
					title: "Scan",
					url: "/workflow/scan",
				},
				{
					title: "Tracking",
					url: "/workflow/tracking",
				},
			],
		},
		{
			title: "Deposits",
			url: "/deposits",
			icon: Building2,
		},
		{
			title: "Commissions",
			url: "/commissions",
			icon: BarChart3,
		},
		{
			title: "GL Entries",
			url: "/gl-entries",
			icon: ClipboardList,
		},
		{
			title: "Trust",
			url: "/trust",
			icon: Building2,
		},
		{
			title: "Reports",
			url: "/reports",
			icon: FileText,
		},
		{
			title: "Exports",
			url: "/exports",
			icon: FolderOpen,
		},
		{
			title: "Setup",
			icon: Settings2,
			items: [
				{
					title: "Accounting",
					url: "/setup/accounting",
				},
				{
					title: "Commissions",
					url: "/setup/commissions",
				},
				{
					title: "Contracts",
					url: "/setup/contracts",
				},
				{
					title: "Employees",
					url: "/setup/employees",
				},
				{
					title: "Forms",
					url: "/setup/forms",
				},
				{
					title: "Items",
					url: "/setup/items",
				},
				{
					title: "Locations",
					url: "/setup/locations",
				},
				{
					title: "Payments",
					url: "/setup/payments",
				},
				{
					title: "Sales Tax",
					url: "/setup/sales-tax",
				},
				{
					title: "Trust",
					url: "/setup/trust",
				},
				{
					title: "Users",
					url: "/setup/users",
				},
			],
		},
		{
			title: "System",
			icon: Command,
			items: [
				{
					title: "Conversion",
					url: "/system/conversion",
					letter: "C",
				},
				{
					title: "Dashboards",
					url: "/system/dashboards",
					letter: "D",
				},
				{
					title: "Job Queue",
					url: "/system/job-queue",
					letter: "JQ",
				},
				{
					title: "Reports",
					url: "/system/reports",
					letter: "R",
				},
				{
					title: "Exports",
					url: "/system/exports",
					letter: "E",
				},
				{
					title: "Shared Queries",
					url: "/system/shared-queries",
					letter: "SQ",
				},
				{
					title: "Services",
					url: "/system/services",
					letter: "S",
				},
				{
					title: "SignalR",
					url: "/system/signalr",
					letter: "S",
				},
				{
					title: "Tenants",
					url: "/system/tenants",
					letter: "T",
				},
				{
					title: "User Activity",
					url: "/system/user-activity",
					letter: "UA",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Support",
			url: "#",
			icon: LifeBuoy,
		},
		{
			title: "Feedback",
			url: "#",
			icon: Send,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
			{...props}
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link to="/">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Command className="size-4" />
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
			<SidebarContent style={{ scrollbarGutter: "stable" }}>
				<NavMain items={data.navMain} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
