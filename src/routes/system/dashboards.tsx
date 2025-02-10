import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/system/dashboards")({
	component: SystemDashboardsPage,
});

function SystemDashboardsPage() {
	return (
		<div>
			<h1>System - Dashboards</h1>
		</div>
	);
}
