import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workflow/tracking")({
	component: WorkflowTrackingPage,
});

function WorkflowTrackingPage() {
	return (
		<div>
			<h1>Workflow Tracking</h1>
		</div>
	);
}
