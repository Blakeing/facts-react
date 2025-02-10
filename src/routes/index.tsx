import { createFileRoute } from "@tanstack/react-router";
import FuneralServiceForm from "@/features/test/components/FuneralServiceForm";
import ContractsTable from "@/features/test/components/contracts-table";

import { useCallback } from "react";

export const Route = createFileRoute("/")({
	component: DashboardPage,
});

function DashboardPage() {
	const handleEditContract = useCallback((id: string) => {
		// TODO: Implement edit contract functionality
		console.log("Editing contract:", id);
	}, []);

	return (
		<div className="container py-6">
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
			</div>
			<div>
				<h3 className="mt-6 text-xl font-semibold mb-4">New Contract</h3>
				<FuneralServiceForm />
			</div>
			<div className="mt-6 space-y-6">
				<div>
					<h3 className="text-xl font-semibold mb-4">Contracts</h3>
					<ContractsTable onEditContract={handleEditContract} />
				</div>
			</div>
		</div>
	);
}
