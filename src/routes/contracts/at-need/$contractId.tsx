import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { atNeedContractApi } from "@/features/contracts/at-need/api/atNeedContractApi";
import { ContractDetailLayout } from "@/features/contracts/at-need/layouts/ContractDetailLayout";
import { GeneralPage } from "@/features/contracts/at-need/pages/GeneralPage";
import type { AtNeedContract } from "@/features/contracts/at-need/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/contracts/at-need/$contractId")({
	component: AtNeedContractDetailPage,
	parseParams: (params) => ({
		contractId: params.contractId,
	}),
});

function AtNeedContractDetailPage() {
	const { contractId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const {
		data: contract,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["at-need-contract", contractId],
		queryFn: () => atNeedContractApi.getAtNeedContract(contractId),
	});

	const signMutation = useMutation({
		mutationFn: async () => {
			if (!contract) throw new Error("Contract not found");
			return atNeedContractApi.signAtNeedContract(contract.id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["at-need-contract", contractId],
			});
			queryClient.invalidateQueries({ queryKey: ["at-need-contracts"] });
		},
	});

	const cancelMutation = useMutation({
		mutationFn: async () => {
			if (!contract) throw new Error("Contract not found");
			return atNeedContractApi.cancelAtNeedContract(
				contract.id,
				"Cancelled by user",
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["at-need-contract", contractId],
			});
			queryClient.invalidateQueries({ queryKey: ["at-need-contracts"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async () => {
			if (!contract) throw new Error("Contract not found");
			return atNeedContractApi.deleteAtNeedContract(contract.id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["at-need-contracts"] });
			navigate({ to: "/contracts/at-need" });
		},
	});

	if (isLoading) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-[50vh] flex-col items-center justify-center gap-4">
				<p className="text-destructive">
					{error instanceof Error ? error.message : "An error occurred"}
				</p>
				<Button onClick={() => window.location.reload()}>Try Again</Button>
			</div>
		);
	}

	if (!contract) {
		return (
			<div className="flex h-[50vh] flex-col items-center justify-center gap-4">
				<p className="text-muted-foreground">Contract not found</p>
				<Button onClick={() => navigate({ to: "/contracts/at-need" })}>
					Back to At-Need Contracts
				</Button>
			</div>
		);
	}

	const statusColors: Record<AtNeedContract["status"], string> = {
		Active: "bg-green-100 text-green-800",
		Pending: "bg-yellow-100 text-yellow-800",
		Completed: "bg-blue-100 text-blue-800",
		Cancelled: "bg-red-100 text-red-800",
	};

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="border-b bg-background">
				<div className="container py-4">
					<div className="flex items-start justify-between">
						<div>
							<h1 className="text-2xl font-bold">
								At-Need Contract #{contract.contractNumber}
							</h1>
							<div className="mt-2 flex items-center gap-4">
								<span
									className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
										statusColors[contract.status]
									}`}
								>
									{contract.status}
								</span>
								<span className="text-sm text-muted-foreground">
									Created {new Date(contract.createdAt).toLocaleDateString()}
								</span>
							</div>
						</div>
						<div className="flex gap-2">
							{contract.status === "Pending" && (
								<>
									<Button
										onClick={() => signMutation.mutate()}
										disabled={signMutation.isPending}
									>
										{signMutation.isPending ? "Signing..." : "Sign Contract"}
									</Button>
									<Button
										variant="destructive"
										onClick={() => deleteMutation.mutate()}
										disabled={deleteMutation.isPending}
									>
										{deleteMutation.isPending ? "Deleting..." : "Delete"}
									</Button>
								</>
							)}
							{contract.status === "Active" && (
								<Button
									variant="destructive"
									onClick={() => cancelMutation.mutate()}
									disabled={cancelMutation.isPending}
								>
									{cancelMutation.isPending
										? "Cancelling..."
										: "Cancel Contract"}
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Content with Layout */}
			<div className="flex-1">
				<ContractDetailLayout
					contractNumber={contract.contractNumber}
					currentSection="general"
				>
					<GeneralPage contract={contract} />
				</ContractDetailLayout>
			</div>
		</div>
	);
}
