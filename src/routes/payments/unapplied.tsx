import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/payments/unapplied")({
	component: PaymentsUnappliedPage,
});

function PaymentsUnappliedPage() {
	return (
		<div>
			<h1>Unapplied Payments</h1>
		</div>
	);
}
