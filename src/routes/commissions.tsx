import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/commissions")({
	component: CommissionsPage,
});

function CommissionsPage() {
	return (
		<div>
			<h1>Commissions</h1>
		</div>
	);
}
