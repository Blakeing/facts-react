import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./router";
import { queryClient } from "./router";

import "./styles/index.css";
import { Toaster } from "@/components/ui/toaster";
import { SheetProvider } from "./provider/SheetProvider";

await router.load();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
if (!rootElement.innerHTML) {
	const root = createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				<SheetProvider />
				<Toaster />
			</QueryClientProvider>
		</StrictMode>,
	);
}
