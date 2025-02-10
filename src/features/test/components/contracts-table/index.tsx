import { useContracts } from "../../hooks/useContracts";
import { ContractsTableSkeleton } from "../ContractsTableSkeleton";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface ContractsTableProps {
	onEditContract: (id: string) => void;
}

const ContractsTable = ({ onEditContract }: ContractsTableProps) => {
	const { data: contracts = [], isLoading, error } = useContracts();

	if (isLoading) return <ContractsTableSkeleton />;
	if (error) {
		return (
			<div className="rounded-md border p-6 text-center text-muted-foreground">
				Error loading contracts. Please try again later.
			</div>
		);
	}

	return <DataTable columns={columns(onEditContract)} data={contracts} />;
};

ContractsTable.displayName = "ContractsTable";

export default ContractsTable;
