import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contracts/pre-need")({
	component: PreNeedContractsPage,
});

function PreNeedContractsPage() {
	return (
		<div>
			<h1>Pre-Need Contracts</h1>
		</div>
	);
}
