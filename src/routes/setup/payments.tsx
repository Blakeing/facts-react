import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setup/payments")({
	component: SetupPaymentsPage,
});

function SetupPaymentsPage() {
	return (
		<div>
			<h1>Setup - Payments</h1>
		</div>
	);
}
