import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/exports")({
	component: ExportsPage,
});

function ExportsPage() {
	return (
		<div>
			<h1>Exports</h1>
		</div>
	);
}
