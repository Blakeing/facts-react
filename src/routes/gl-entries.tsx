import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/gl-entries")({
	component: GLEntriesPage,
});

function GLEntriesPage() {
	return (
		<div>
			<h1>GL Entries</h1>
		</div>
	);
}
