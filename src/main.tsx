import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./router";

import "./styles/index.css";
import { Toaster } from "@/components/ui/sonner";
import { SheetProvider } from "./provider/SheetProvider";
import { QueryProvider } from "./providers/query-provider";

await router.load();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
if (!rootElement.innerHTML) {
	const root = createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryProvider>
				<RouterProvider router={router} />
				<SheetProvider />
				<Toaster />
			</QueryProvider>
		</StrictMode>,
	);
}
