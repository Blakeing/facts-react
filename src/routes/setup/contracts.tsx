import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setup/contracts")({
	component: SetupContractsPage,
});

function SetupContractsPage() {
	return (
		<div>
			<h1>Setup - Contracts</h1>
		</div>
	);
}
