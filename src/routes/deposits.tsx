import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/deposits")({
	component: DepositsPage,
});

function DepositsPage() {
	return (
		<div>
			<h1>Deposits</h1>
		</div>
	);
}
