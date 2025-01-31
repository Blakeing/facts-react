import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { preNeedContractApi } from "@/features/contracts/pre-need/api/preNeedContractApi";
import type { PreNeedContract } from "@/features/contracts/pre-need/types";
import { formatDate } from "@/utils/formatDate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/contracts/pre-need/$contractId")({
	component: PreNeedContractDetailPage,
});

function PreNeedContractDetailPage() {
	const { contractId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const {
		data: contract,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["pre-need-contract", contractId],
		queryFn: () => preNeedContractApi.getPreNeedContract(contractId),
	});

	const signMutation = useMutation({
		mutationFn: () => preNeedContractApi.signPreNeedContract(contractId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["pre-need-contract", contractId],
			});
			queryClient.invalidateQueries({ queryKey: ["pre-need-contracts"] });
		},
	});

	const cancelMutation = useMutation({
		mutationFn: () =>
			preNeedContractApi.cancelPreNeedContract(contractId, "Cancelled by user"),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["pre-need-contract", contractId],
			});
			queryClient.invalidateQueries({ queryKey: ["pre-need-contracts"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: () => preNeedContractApi.deletePreNeedContract(contractId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pre-need-contracts"] });
			navigate({ to: "/contracts/pre-need" });
		},
	});

	const handleSignContract = async () => {
		try {
			await signMutation.mutateAsync();
		} catch (error) {
			console.error("Failed to sign contract:", error);
		}
	};

	const handleCancelContract = async () => {
		try {
			await cancelMutation.mutateAsync();
		} catch (error) {
			console.error("Failed to cancel contract:", error);
		}
	};

	const handleDeleteContract = async () => {
		try {
			await deleteMutation.mutateAsync();
		} catch (error) {
			console.error("Failed to delete contract:", error);
		}
	};

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
				<Button onClick={() => navigate({ to: "/contracts/pre-need" })}>
					Back to Pre-Need Contracts
				</Button>
			</div>
		);
	}

	const statusColors: Record<PreNeedContract["status"], string> = {
		draft: "bg-gray-100 text-gray-800",
		active: "bg-green-100 text-green-800",
		completed: "bg-blue-100 text-blue-800",
		cancelled: "bg-red-100 text-red-800",
	};

	return (
		<div className="mx-auto max-w-4xl space-y-8">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-bold">
						Pre-Need Contract #{contract.contractNumber}
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
							Created {formatDate(contract.createdAt)}
						</span>
					</div>
				</div>
				<div className="flex gap-2">
					{contract.status === "draft" && (
						<>
							<Button
								onClick={handleSignContract}
								disabled={signMutation.isPending}
							>
								{signMutation.isPending ? "Signing..." : "Sign Contract"}
							</Button>
							<Button
								variant="destructive"
								onClick={handleDeleteContract}
								disabled={deleteMutation.isPending}
							>
								{deleteMutation.isPending ? "Deleting..." : "Delete"}
							</Button>
						</>
					)}
					{contract.status === "active" && (
						<Button
							variant="destructive"
							onClick={handleCancelContract}
							disabled={cancelMutation.isPending}
						>
							{cancelMutation.isPending ? "Cancelling..." : "Cancel Contract"}
						</Button>
					)}
				</div>
			</div>

			<div className="rounded-lg border bg-card p-6">
				<h2 className="text-lg font-semibold">Customer Information</h2>
				<div className="mt-4 space-y-4">
					<div className="flex items-center justify-between rounded-md border bg-background p-4">
						<div className="space-y-1">
							<div className="font-medium">{contract.customerName}</div>
						</div>
					</div>
				</div>
			</div>

			<div className="rounded-lg border bg-card p-6">
				<h2 className="text-lg font-semibold">Contract Details</h2>
				<div className="mt-4 space-y-4">
					<div className="flex items-center justify-between rounded-md border bg-background p-4">
						<div className="space-y-1">
							<div className="font-medium">Total Amount</div>
							<div className="text-sm text-muted-foreground">
								{new Intl.NumberFormat("en-US", {
									style: "currency",
									currency: "USD",
								}).format(contract.totalAmount)}
							</div>
						</div>
					</div>
					<div className="flex items-center justify-between rounded-md border bg-background p-4">
						<div className="space-y-1">
							<div className="font-medium">Monthly Payment</div>
							<div className="text-sm text-muted-foreground">
								{new Intl.NumberFormat("en-US", {
									style: "currency",
									currency: "USD",
								}).format(contract.monthlyPayment)}
							</div>
						</div>
					</div>
					<div className="flex items-center justify-between rounded-md border bg-background p-4">
						<div className="space-y-1">
							<div className="font-medium">Next Payment Date</div>
							<div className="text-sm text-muted-foreground">
								{formatDate(contract.nextPaymentDate)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
