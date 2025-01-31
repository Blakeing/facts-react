import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setup/trust")({
	component: SetupTrustPage,
});

function SetupTrustPage() {
	return (
		<div>
			<h1>Setup - Trust</h1>
		</div>
	);
}
