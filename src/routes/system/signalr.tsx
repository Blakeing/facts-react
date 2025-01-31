import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/system/signalr")({
	component: SystemSignalRPage,
});

function SystemSignalRPage() {
	return (
		<div>
			<h1>System - SignalR</h1>
		</div>
	);
}
