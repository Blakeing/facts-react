import { createRouter } from "@tanstack/react-router";
import { RouteErrorBoundary } from "./components/RouteErrorBoundary";
import { RouteLoader } from "./components/RouteLoader";
import { routeTree } from "./routeTree.gen";

// Create the router instance
export const router = createRouter({
	routeTree,
	// We'll provide the queryClient through context in the QueryProvider
	defaultPreload: "intent",
	// Since we're using React Query, we don't want loader calls to ever be stale
	// This will ensure that the loader is always called when the route is preloaded or visited
	defaultPreloadStaleTime: 0,
	defaultPendingComponent: RouteLoader,
	defaultErrorComponent: RouteErrorBoundary,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
