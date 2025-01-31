import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setup/sales-tax")({
	component: SetupSalesTaxPage,
});

function SetupSalesTaxPage() {
	return (
		<div>
			<h1>Setup - Sales Tax</h1>
		</div>
	);
}
