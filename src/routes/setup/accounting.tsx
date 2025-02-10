import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setup/accounting")({
	component: SetupAccountingPage,
});

function SetupAccountingPage() {
	return (
		<div>
			<h1>Setup - Accounting</h1>
		</div>
	);
}
