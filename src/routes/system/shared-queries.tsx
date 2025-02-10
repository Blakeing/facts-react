import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/system/shared-queries")({
	component: SystemSharedQueriesPage,
});

function SystemSharedQueriesPage() {
	return (
		<div>
			<h1>System - Shared Queries</h1>
		</div>
	);
}
