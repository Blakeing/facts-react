import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/system/exports")({
	component: SystemExportsPage,
});

function SystemExportsPage() {
	return (
		<div>
			<h1>System - Exports</h1>
		</div>
	);
}
