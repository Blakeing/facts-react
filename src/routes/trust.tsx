import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trust")({
	component: TrustPage,
});

function TrustPage() {
	return (
		<div>
			<h1>Trust</h1>
		</div>
	);
}
