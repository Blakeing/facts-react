import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/search")({
	component: SearchPage,
});

function SearchPage() {
	return (
		<div>
			<h1>Search</h1>
		</div>
	);
}
