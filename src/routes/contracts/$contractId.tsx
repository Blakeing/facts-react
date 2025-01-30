import { contractApi } from "@/api/contractApi";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/contracts/$contractId")({
	component: ContractDetailPage,
});

function ContractDetailPage() {
	const { contractId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const {
		data: contract,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["contract", contractId],
		queryFn: () => contractApi.getContract(contractId),
	});

	const signMutation = useMutation({
		mutationFn: () => contractApi.signContract(contractId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["contract", contractId] });
			queryClient.invalidateQueries({ queryKey: ["contracts"] });
		},
	});

	const cancelMutation = useMutation({
		mutationFn: () =>
			contractApi.cancelContract(contractId, "Cancelled by user"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["contract", contractId] });
			queryClient.invalidateQueries({ queryKey: ["contracts"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: () => contractApi.deleteContract(contractId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["contracts"] });
			navigate({ to: "/contracts" });
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
				<Button onClick={() => navigate({ to: "/contracts" })}>
					Back to Contracts
				</Button>
			</div>
		);
	}

	const statusColors = {
		draft: "bg-gray-100 text-gray-800",
		active: "bg-green-100 text-green-800",
		completed: "bg-blue-100 text-blue-800",
		cancelled: "bg-red-100 text-red-800",
	};

	return (
		<div className="mx-auto max-w-4xl space-y-8">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-bold">{contract.title}</h1>
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

			{contract.description && (
				<div className="rounded-lg border bg-card p-6">
					<h2 className="text-lg font-semibold">Description</h2>
					<p className="mt-2 whitespace-pre-wrap text-muted-foreground">
						{contract.description}
					</p>
				</div>
			)}

			<div className="rounded-lg border bg-card p-6">
				<h2 className="text-lg font-semibold">Parties</h2>
				<div className="mt-4 space-y-4">
					{contract.parties.map((party) => (
						<div
							key={`${contract.id}-${party.id}`}
							className="flex items-center justify-between rounded-md border bg-background p-4"
						>
							<div className="space-y-1">
								<div className="font-medium">{party.name}</div>
								<div className="text-sm text-muted-foreground">
									{party.email}
								</div>
							</div>
							<div
								className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
									party.role === "owner"
										? "bg-blue-100 text-blue-800"
										: party.role === "signer"
											? "bg-yellow-100 text-yellow-800"
											: "bg-gray-100 text-gray-800"
								}`}
							>
								{party.role}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
