import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({ to: "/contracts" });
	},
});

function DashboardPage() {
	return (
		<div>
			<h1>Dashboard</h1>
		</div>
	);
}
