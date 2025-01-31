import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setup/forms")({
	component: SetupFormsPage,
});

function SetupFormsPage() {
	return (
		<div>
			<h1>Setup - Forms</h1>
		</div>
	);
}
