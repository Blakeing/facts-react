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
		accessorKey: "prePrintedContractNumber",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Pre-Printed Contract #
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "date",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Date
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = new Date(row.getValue("date"));
			return date.toLocaleDateString();
		},
	},
	{
		accessorKey: "deceased",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Deceased
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
					{row.getValue("deceased")}
				</Link>
			);
		},
	},
	{
		accessorKey: "dateOfDeath",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Date of Death
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = new Date(row.getValue("dateOfDeath"));
			return date.toLocaleDateString();
		},
	},
	{
		accessorKey: "purchaser",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Purchaser
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "funeralDirector",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Funeral Director
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Status
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const status = row.getValue("status") as string;
			return (
				<div className={`font-medium ${getStatusColor(status)}`}>{status}</div>
			);
		},
	},
];

function getStatusColor(status: string) {
	switch (status) {
		case "Active":
			return "text-green-600";
		case "Pending":
			return "text-yellow-600";
		case "Completed":
			return "text-blue-600";
		case "Cancelled":
			return "text-red-600";
		default:
			return "";
	}
}
