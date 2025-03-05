import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/layouts/root/components/AppSidebar";
import { SiteHeader } from "@/layouts/root/components/SiteHeader";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
	component: RootLayout,
});

function RootLayout() {
	return (
		<>
			<div className="[--header-height:calc(--spacing(14))]">
				<SidebarProvider className="flex flex-col">
					<SiteHeader />
					<div className="flex flex-1">
						<AppSidebar />
						<SidebarInset>
							<div className="bg-background dev:outline">
								<main className="container py-6 dev:bg-debug">
									<Outlet />
								</main>
							</div>
						</SidebarInset>
					</div>
				</SidebarProvider>
			</div>
			<ReactQueryDevtools buttonPosition="top-right" />
			<TanStackRouterDevtools position="bottom-right" />
		</>
	);
}
