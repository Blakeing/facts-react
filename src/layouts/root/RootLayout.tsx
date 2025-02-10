import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/layouts/root/components/AppSidebar";
import { SiteHeader } from "@/layouts/root/components/SiteHeader";
import { Outlet } from "@tanstack/react-router";
import { GeistSans } from "geist/font/sans";

export default function Page() {
	return (
		<div
			className={`${GeistSans.className} [--header-height:calc(--spacing(14))]`}
		>
			<SidebarProvider className="flex flex-col">
				<SiteHeader />
				<div className="flex flex-1">
					<AppSidebar />
					<SidebarInset>
						<div className="min-h-screen bg-background dev:outline">
							<main className="@container py-6 dev:bg-debug">
								<Outlet />
							</main>
						</div>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</div>
	);
}
