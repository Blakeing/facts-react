import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { AtNeedContract } from "../types";

export const columns: ColumnDef<AtNeedContract>[] = [
	{
		accessorKey: "contractNumber",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Contract #
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<Link
					to="/contracts/at-need/$contractId"
					params={{ contractId: row.original.id }}
					className="text-blue-600 hover:underline"
				>
					{row.getValue("contractNumber")}
				</Link>
			);
		},
	},
	{
		accessorKey: "deceasedName",
		header: "Deceased Name",
		cell: ({ row }) => {
			return (
				<Link
					to="/contracts/at-need/$contractId"
					params={{ contractId: row.original.id }}
					className="text-blue-600 hover:underline"
				>
					{row.getValue("deceasedName")}
				</Link>
			);
		},
	},
	{
		accessorKey: "dateOfDeath",
		header: "Date of Death",
	},
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		accessorKey: "totalAmount",
		header: "Total Amount",
		cell: ({ row }) => {
			const amount = Number.parseFloat(row.getValue("totalAmount"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(amount);
			return formatted;
		},
	},
	{
		accessorKey: "createdAt",
		header: "Created At",
	},
];
