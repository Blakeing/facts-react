import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import type { Contract } from "../../types";
import { DataTableColumnHeader } from "./components/column-header";

export const columns = (
	onEditContract: (id: string) => void,
): ColumnDef<Contract>[] => [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		id: "prePrintedContractNumber",
		accessorFn: (row) => row.formData.general?.prePrintedContractNumber,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Contract #" />
		),
		cell: ({ row }) => {
			const value = row.original.formData.general?.prePrintedContractNumber;
			return <div>{value ?? "N/A"}</div>;
		},
	},
	{
		id: "contractSignDate",
		accessorFn: (row) => row.formData.general?.contractSignDate,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Date" />
		),
		cell: ({ row }) => {
			const value = row.original.formData.general?.contractSignDate;
			return <div>{formatDate(value)}</div>;
		},
	},
	{
		id: "dateOfDeath",
		accessorFn: (row) => row.formData.buyer?.dates?.dateOfDeath,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Date of Death" />
		),
		cell: ({ row }) => {
			const value = row.original.formData.buyer?.dates?.dateOfDeath;
			return <div>{formatDate(value)}</div>;
		},
	},
	{
		id: "funeralDirector",
		accessorFn: (row) => row.formData.general?.funeralDirector,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Funeral Director" />
		),
		cell: ({ row }) => {
			const value = row.original.formData.general?.funeralDirector;
			return <div>{value ?? "N/A"}</div>;
		},
	},
	{
		id: "purchaser",
		accessorFn: (row) => {
			const name = row.formData.buyer?.name;
			return name ? `${name.first} ${name.last}` : "N/A";
		},
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Purchaser" />
		),
		cell: ({ row }) => {
			const buyerName = row.original.formData.buyer?.name;
			const purchaserName = buyerName
				? `${buyerName.first} ${buyerName.last}`
				: "N/A";
			return <div>{purchaserName}</div>;
		},
	},
	{
		id: "status",
		accessorKey: "contractState",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => {
			const status = row.original.contractState;
			return (
				<Badge
					variant={
						status === "finalized"
							? "default"
							: status === "void"
								? "destructive"
								: status === "executed"
									? "secondary"
									: "outline"
					}
					className={
						status === "finalized"
							? "bg-green-500 hover:bg-green-600"
							: status === "void"
								? "bg-red-500 hover:bg-red-600"
								: status === "executed"
									? "bg-blue-500 hover:bg-blue-600 text-white"
									: ""
					}
				>
					{status.toUpperCase()}
				</Badge>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const contract = row.original;
			return (
				<div className="text-right">
					<Button
						variant="ghost"
						onClick={() => onEditContract(contract.id)}
						disabled={["finalized", "void"].includes(contract.contractState)}
					>
						{["draft", "executed", "review"].includes(contract.contractState)
							? "Edit"
							: "View"}
					</Button>
				</div>
			);
		},
	},
];
