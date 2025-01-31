import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/system/user-activity")({
	component: SystemUserActivityPage,
});

function SystemUserActivityPage() {
	return (
		<div>
			<h1>System - User Activity</h1>
		</div>
	);
}
