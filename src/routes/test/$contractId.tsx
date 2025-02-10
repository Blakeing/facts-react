import { Spinner } from "@/components/ui/Spinner";
import { api } from "@/features/test/api";
import FuneralServiceForm from "@/features/test/components/FuneralServiceForm";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/test/$contractId")({
	component: ContractFormComponent,
});

function ContractFormComponent() {
	const { contractId } = useParams({ from: "/test/$contractId" });

	const { data: contract, isLoading } = useQuery({
		queryKey: ["contract", contractId],
		queryFn: () => api.fetch(contractId),
		enabled: contractId !== "new",
		staleTime: 0, // Always fetch fresh data
		gcTime: 0, // Don't keep the data in cache
	});

	if (isLoading && contractId !== "new") {
		return (
			<div className="flex h-[50vh] flex-col items-center justify-center gap-4">
				<Spinner size="lg" />
				<p className="text-muted-foreground">Loading contract details...</p>
			</div>
		);
	}

	return (
		<div className="container py-6">
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">
					{contract ? "Edit Contract" : "New Contract"}
				</h2>
			</div>
			<div className="mt-6">
				<FuneralServiceForm initialData={contract ?? undefined} />
			</div>
		</div>
	);
}
