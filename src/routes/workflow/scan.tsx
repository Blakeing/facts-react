import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workflow/scan")({
	component: WorkflowScanPage,
});

function WorkflowScanPage() {
	return (
		<div>
			<h1>Workflow Scan</h1>
		</div>
	);
}
