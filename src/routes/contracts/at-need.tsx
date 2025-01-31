import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contracts/at-need")({
	component: AtNeedContractsPage,
});

function AtNeedContractsPage() {
	return (
		<div>
			<h1>At-Need Contracts</h1>
		</div>
	);
}
