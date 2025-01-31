import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: DashboardPage,
});

function DashboardPage() {
	return (
		<div className="container py-6">
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
			</div>
			<div className="mt-6">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{/* Add your dashboard cards/widgets here */}
				</div>
			</div>
		</div>
	);
}
