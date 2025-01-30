import type { Contract } from "@/api/contractApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/formatDate";
import { Link } from "@tanstack/react-router";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

interface ContractDataTableProps {
	contracts: Contract[];
	onSign?: (id: string) => void;
	onCancel?: (id: string) => void;
}

export function ContractDataTable({
	contracts,
	onSign,
	onCancel,
}: ContractDataTableProps) {
	const [globalFilter, setGlobalFilter] = useState("");

	const columns: ColumnDef<Contract>[] = [
		{
			accessorKey: "title",
			header: "Title",
			cell: ({ row }) => {
				const contract = row.original;
				return (
					<div>
						<Link
							to="/contracts/$contractId"
							params={{ contractId: contract.id }}
							className="font-medium hover:underline"
						>
							{contract.title}
						</Link>
						{contract.description && (
							<p className="mt-1 text-xs text-muted-foreground">
								{contract.description}
							</p>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const status = row.getValue("status") as Contract["status"];
				const statusColors = {
					draft: "bg-gray-100 text-gray-800",
					active: "bg-green-100 text-green-800",
					completed: "bg-blue-100 text-blue-800",
					cancelled: "bg-red-100 text-red-800",
				};

				return (
					<span
						className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[status]}`}
					>
						{status}
					</span>
				);
			},
		},
		{
			accessorKey: "createdAt",
			header: "Created",
			cell: ({ row }) => formatDate(row.getValue("createdAt")),
		},
		{
			accessorKey: "parties",
			header: "Parties",
			cell: ({ row }) => {
				const parties = row.original.parties || [];
				return (
					<div className="flex space-x-2">
						{parties.map((party, index) => (
							<div
								key={`${row.original.id}-${party.id || index}`}
								className="relative h-8 w-8 rounded-full bg-primary text-primary-foreground"
								title={`${party.name || party.email} (${party.role})`}
							>
								<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium">
									{party.name
										? party.name
												.split(" ")
												.map((n) => n[0])
												.join("")
										: party.email?.[0]?.toUpperCase() || "?"}
								</span>
							</div>
						))}
					</div>
				);
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const contract = row.original;
				return (
					<div className="flex space-x-2">
						{onSign && contract.status === "draft" && (
							<Button size="sm" onClick={() => onSign(contract.id)}>
								Sign
							</Button>
						)}
						{onCancel && contract.status === "active" && (
							<Button
								size="sm"
								variant="destructive"
								onClick={() => onCancel(contract.id)}
							>
								Cancel
							</Button>
						)}
					</div>
				);
			},
		},
	];

	const table = useReactTable({
		data: contracts,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			globalFilter,
		},
		onGlobalFilterChange: setGlobalFilter,
		initialState: {
			pagination: {
				pageSize: 5,
			},
		},
	});

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Input
					placeholder="Filter contracts..."
					value={globalFilter}
					onChange={(e) => setGlobalFilter(e.target.value)}
					className="max-w-sm"
				/>
				<div className="flex items-center space-x-2">
					<p className="text-sm text-muted-foreground">Rows per page</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[5, 10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No contracts found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-end space-x-2">
				<div className="flex w-[100px] items-center justify-center text-sm font-medium">
					Page {table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount()}
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
