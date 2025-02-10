import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reports")({
	component: ReportsPage,
});

function ReportsPage() {
	return (
		<div>
			<h1>Reports</h1>
		</div>
	);
}
