import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contracts/layout")({
	component: ContractsLayout,
});

function ContractsLayout() {
	return (
		<div className="container py-6">
			<Outlet />
		</div>
	);
}
