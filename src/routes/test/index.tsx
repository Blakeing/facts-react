import ContractsTable from "@/features/test/components/contracts-table";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

export const Route = createFileRoute("/test/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();

	const handleEditContract = useCallback(
		(id: string) => {
			navigate({ to: "/test/$contractId", params: { contractId: id } });
		},
		[navigate],
	);

	const handleCreateNewContract = useCallback(() => {
		navigate({ to: "/test/$contractId", params: { contractId: "new" } });
	}, [navigate]);

	return (
		<div className="container py-6">
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">Contracts</h2>
				<Button onClick={handleCreateNewContract}>Create New Contract</Button>
			</div>
			<div className="mt-6 space-y-6">
				<ContractsTable onEditContract={handleEditContract} />
			</div>
		</div>
	);
}
