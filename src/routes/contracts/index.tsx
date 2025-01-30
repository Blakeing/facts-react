import { contractApi } from "@/api/contractApi";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ContractCard } from "@/features/contracts/ui/ContractCard";
import { ContractDataTable } from "@/features/contracts/ui/ContractDataTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";

type ContractStatus = "draft" | "active" | "completed" | "cancelled";

interface ContractsSearch {
	status?: ContractStatus;
}

interface SearchParams extends Record<string, unknown> {
	status?: string;
}

const validStatuses: ContractStatus[] = [
	"draft",
	"active",
	"completed",
	"cancelled",
];

export const Route = createFileRoute("/contracts/")({
	component: ContractsPage,
	validateSearch: (search: SearchParams): ContractsSearch => {
		const rawStatus = search.status;
		const status =
			typeof rawStatus === "string" ? (rawStatus as ContractStatus) : undefined;
		if (status && !validStatuses.includes(status)) {
			return {};
		}
		return status ? { status } : {};
	},
});

function ContractsPage() {
	const { status } = Route.useSearch();
	const [view, setView] = useState<"grid" | "list">("grid");
	const queryClient = useQueryClient();

	const {
		data: contracts = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["contracts"],
		queryFn: async () => {
			const response = await contractApi.getContracts();
			return response ?? [];
		},
	});

	const signMutation = useMutation({
		mutationFn: (id: string) => contractApi.signContract(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["contracts"] });
		},
	});

	const cancelMutation = useMutation({
		mutationFn: (id: string) =>
			contractApi.cancelContract(id, "Cancelled by user"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["contracts"] });
		},
	});

	const filteredContracts = status
		? contracts.filter((c) => c.status === status)
		: contracts;

	const handleSignContract = async (id: string) => {
		try {
			await signMutation.mutateAsync(id);
		} catch (error) {
			console.error("Failed to sign contract:", error);
		}
	};

	const handleCancelContract = async (id: string) => {
		try {
			await cancelMutation.mutateAsync(id);
		} catch (error) {
			console.error("Failed to cancel contract:", error);
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

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">
					{status
						? `${status.charAt(0).toUpperCase() + status.slice(1)} Contracts`
						: "All Contracts"}
				</h1>
				<div className="flex items-center gap-4">
					<ToggleGroup
						type="single"
						value={view}
						onValueChange={(value) => {
							if (value) setView(value as "grid" | "list");
						}}
					>
						<ToggleGroupItem value="grid" aria-label="Grid view">
							<LayoutGrid className="h-4 w-4" />
						</ToggleGroupItem>
						<ToggleGroupItem value="list" aria-label="List view">
							<List className="h-4 w-4" />
						</ToggleGroupItem>
					</ToggleGroup>
					<Link to="/contracts/new">
						<Button>New Contract</Button>
					</Link>
				</div>
			</div>

			{filteredContracts.length === 0 ? (
				<div className="flex h-[50vh] flex-col items-center justify-center gap-4">
					<p className="text-muted-foreground">
						{status ? `No ${status} contracts found` : "No contracts found"}
					</p>
					<Link to="/contracts/new">
						<Button>Create your first contract</Button>
					</Link>
				</div>
			) : view === "grid" ? (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{filteredContracts.map((contract) => (
						<ContractCard
							key={contract.id}
							contract={contract}
							onSign={handleSignContract}
							onCancel={handleCancelContract}
							disabled={{
								sign: signMutation.isPending,
								cancel: cancelMutation.isPending,
							}}
						/>
					))}
				</div>
			) : (
				<ContractDataTable
					contracts={filteredContracts}
					onSign={handleSignContract}
					onCancel={handleCancelContract}
				/>
			)}
		</div>
	);
}
