import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/payments/batches")({
	component: PaymentsBatchesPage,
});

function PaymentsBatchesPage() {
	return (
		<div>
			<h1>Payment Batches</h1>
		</div>
	);
}
