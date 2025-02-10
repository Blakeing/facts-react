import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/system/tenants")({
	component: SystemTenantsPage,
});

function SystemTenantsPage() {
	return (
		<div>
			<h1>System - Tenants</h1>
		</div>
	);
}
