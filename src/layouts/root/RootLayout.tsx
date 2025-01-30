import { Outlet } from "@tanstack/react-router";

import { AppSidebar } from "./components/AppSidebar";
import { SiteHeader } from "./components/SiteHeader";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout() {
	return (
		<div className="[--header-height:theme(spacing.14)]">
			<SidebarProvider className="flex flex-col">
				<SiteHeader />
				<div className="flex flex-1">
					<AppSidebar />
					<SidebarInset>
						<Outlet />
					</SidebarInset>
				</div>
			</SidebarProvider>
		</div>
	);
}
