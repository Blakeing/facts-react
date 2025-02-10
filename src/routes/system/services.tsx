import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/system/services")({
	component: SystemServicesPage,
});

function SystemServicesPage() {
	return (
		<div>
			<h1>System - Services</h1>
		</div>
	);
}
