import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/system/reports")({
	component: SystemReportsPage,
});

function SystemReportsPage() {
	return (
		<div>
			<h1>System - Reports</h1>
		</div>
	);
}
