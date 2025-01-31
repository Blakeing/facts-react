import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setup/items")({
	component: SetupItemsPage,
});

function SetupItemsPage() {
	return (
		<div>
			<h1>Setup - Items</h1>
		</div>
	);
}
