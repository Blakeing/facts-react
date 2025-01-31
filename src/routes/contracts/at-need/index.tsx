import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { atNeedContractService } from "@/features/contracts/at-need/services/atNeedContractService";
import { columns } from "@/features/contracts/at-need/tables/columns";
import { DataTable } from "@/features/contracts/at-need/tables/data-table";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/contracts/at-need/")({
	component: AtNeedContractsPage,
});

function AtNeedContractsPage() {
	const { data: contracts = [], isLoading } = useQuery({
		queryKey: ["at-need-contracts"],
		queryFn: () => atNeedContractService.getContracts(),
	});

	if (isLoading) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="container py-6">
			<div className="flex items-center justify-between space-y-2">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">
						At-Need Contracts
					</h2>
					<p className="text-muted-foreground">
						Manage your at-need contracts here.
					</p>
				</div>
				<div className="flex items-center space-x-2">
					<Button asChild>
						<Link to="/contracts/at-need/new">
							<Plus className="mr-2 h-4 w-4" />
							New Contract
						</Link>
					</Button>
				</div>
			</div>
			<div className="mt-6">
				<DataTable columns={columns} data={contracts} />
			</div>
		</div>
	);
}
