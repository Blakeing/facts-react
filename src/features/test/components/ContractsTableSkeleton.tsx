import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const SKELETON_ROWS = ["row-1", "row-2", "row-3", "row-4", "row-5"] as const;

export const ContractsTableSkeleton = () => {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Client Name</TableHead>
						<TableHead>Family Members</TableHead>
						<TableHead>Payment Method</TableHead>
						<TableHead>Amount</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{SKELETON_ROWS.map((rowId) => (
						<TableRow key={rowId}>
							<TableCell>
								<Skeleton className="h-4 w-[150px]" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-[80px]" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-[100px]" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-[80px]" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-6 w-[100px] rounded-full" />
							</TableCell>
							<TableCell className="text-right">
								<Skeleton className="h-9 w-[70px] ml-auto" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
