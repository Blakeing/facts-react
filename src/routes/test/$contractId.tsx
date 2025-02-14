import { Spinner } from "@/components/ui/Spinner";
import { api } from "@/features/test/api";
import FuneralServiceForm from "@/features/test/components/FuneralServiceForm";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams, useRouter } from "@tanstack/react-router";
import { useContractMutations } from "@/features/test/hooks/useContractMutations";

export const Route = createFileRoute("/test/$contractId")({
	component: ContractFormComponent,
});

function ContractFormComponent() {
	const { contractId } = useParams({ from: "/test/$contractId" });
	const router = useRouter();
	const isNewContract = contractId === "new";

	const { createMutation, updateMutation } = useContractMutations();
	const isSaving = createMutation.isPending || updateMutation.isPending;
	const isTransitioning = router.state.status === "pending";

	const {
		data: contract,
		isLoading: isContractLoading,
		isFetching: isContractFetching,
	} = useQuery({
		queryKey: ["contract", contractId],
		queryFn: () => api.fetch(contractId),
		enabled: !isNewContract,
		staleTime: 0, // Always fetch fresh data
		gcTime: 0, // Don't keep the data in cache
	});

	// Show loading for any loading state
	const shouldShowLoading = isNewContract
		? isSaving
		: isSaving || isTransitioning || isContractLoading || isContractFetching;

	if (isContractLoading && !isNewContract) {
		return (
			<div className="flex h-[50vh] flex-col items-center justify-center gap-4">
				<Spinner size="lg" />
				<p className="text-muted-foreground">Loading contract details...</p>
			</div>
		);
	}

	return (
		<>
			{shouldShowLoading && (
				<div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
					<div className="flex h-screen w-full items-center justify-center">
						<div className="flex flex-col items-center gap-4">
							<Spinner size="lg" />
							<p className="text-muted-foreground">
								{isSaving ? "Saving changes..." : "Loading..."}
							</p>
						</div>
					</div>
				</div>
			)}
			<div className="container py-6">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">
						{contract ? `Edit Contract - ${contractId}` : "New Contract"}
					</h2>
				</div>
				<div className="mt-6">
					<FuneralServiceForm initialData={contract ?? undefined} />
				</div>
			</div>
		</>
	);
}
