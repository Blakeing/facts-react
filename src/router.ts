import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { RouteErrorBoundary } from "./components/RouteErrorBoundary";
import { RouteLoader } from "./components/RouteLoader";
import { routeTree } from "./routeTree.gen";

// Create a new query client instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000, // 5 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 0,
    },
  },
});

// Create the router instance
export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
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
