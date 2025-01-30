import { TooltipProvider } from "@/components/ui/tooltip";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRoute<RouterContext>({
	component: RootLayout,
});

function RootLayout() {
	return (
		<TooltipProvider>
			<div className="min-h-screen bg-background">
				<main className="container py-6">
					<Outlet />
				</main>
			</div>
		</TooltipProvider>
	);
}
