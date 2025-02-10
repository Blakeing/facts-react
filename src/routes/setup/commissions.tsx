import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setup/commissions")({
	component: SetupCommissionsPage,
});

function SetupCommissionsPage() {
	return (
		<div>
			<h1>Setup - Commissions</h1>
		</div>
	);
}
