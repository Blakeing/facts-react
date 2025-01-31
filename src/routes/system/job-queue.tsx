import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/system/job-queue")({
	component: SystemJobQueuePage,
});

function SystemJobQueuePage() {
	return (
		<div>
			<h1>System - Job Queue</h1>
		</div>
	);
}
