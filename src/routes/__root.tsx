import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Link, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import type { QueryClient } from "@tanstack/react-query";

import RootLayout from "@/layouts/root/RootLayout";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	component: RootComponent,
	notFoundComponent: () => {
		return (
			<div className="p-2">
				<h3>Page Not Found</h3>
				<p>Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
				<Link to="/">Go Home</Link>
			</div>
		);
	},
});

function RootComponent() {
	return (
		<>
			<RootLayout />
			<ReactQueryDevtools buttonPosition="top-right" />
			<TanStackRouterDevtools position="bottom-right" />
		</>
	);
}
