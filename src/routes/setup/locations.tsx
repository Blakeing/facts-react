import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setup/locations")({
	component: SetupLocationsPage,
});

function SetupLocationsPage() {
	return (
		<div>
			<h1>Setup - Locations</h1>
		</div>
	);
}
