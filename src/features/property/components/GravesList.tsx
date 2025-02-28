import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Edit } from "lucide-react";
import { createIdSlug } from "@/utils/url";
import { extractId } from "@/utils/url";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useGraves } from "../hooks/usePropertyQueries";
import { CreateGraveDialog } from "./CreateGraveDialog";
import { DeleteGraveDialog } from "./DeleteGraveDialog";
import type { Grave } from "../types";

interface GravesListProps {
	blockId: string;
	sectionId: string;
	lotId: string;
}

export function GravesList({ blockId, sectionId, lotId }: GravesListProps) {
	// Convert string IDs to numbers
	const blockIdNum = Number.parseInt(extractId(blockId), 10);

	const { data: graves, isLoading, isError, refetch } = useGraves(blockIdNum);

	if (isLoading) {
		return <div className="py-8 text-center">Loading graves...</div>;
	}

	if (isError) {
		return (
			<div className="py-8 text-center text-destructive">
				Error loading graves. Please try again.
			</div>
		);
	}

	if (!graves || graves.length === 0) {
		return (
			<div className="py-8 text-center">
				<p className="mb-4 text-muted-foreground">
					No graves found in this block.
				</p>
				<CreateGraveDialog blockId={blockIdNum} onSuccess={() => refetch()} />
			</div>
		);
	}

	const getStatusBadgeVariant = (status: string) => {
		switch (status) {
			case "Available":
				return "outline";
			case "Reserved":
				return "secondary";
			case "Sold":
				return "default";
			default:
				return "outline";
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-medium">Graves</h3>
				<CreateGraveDialog blockId={blockIdNum} onSuccess={() => refetch()} />
			</div>
			<ScrollArea className="h-[calc(100vh-20rem)]">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]">Actions</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Size</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Location Notes</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{graves.map((grave) => (
							<TableRow key={grave.id}>
								<TableCell className="flex space-x-1">
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8"
										asChild
									>
										<Link
											to="/property/$sectionId/$lotId/$blockId/grave/$graveId"
											params={{
												sectionId,
												lotId,
												blockId,
												graveId: createIdSlug(grave.id, grave.name),
											}}
										>
											<Edit className="h-4 w-4" />
										</Link>
									</Button>
									<DeleteGraveDialog
										grave={grave}
										onSuccess={() => refetch()}
									/>
								</TableCell>
								<TableCell>
									<Link
										to="/property/$sectionId/$lotId/$blockId/grave/$graveId"
										params={{
											sectionId,
											lotId,
											blockId,
											graveId: createIdSlug(grave.id, grave.name),
										}}
										className="hover:underline cursor-pointer"
									>
										{grave.name}
									</Link>
								</TableCell>
								<TableCell>{grave.size}</TableCell>
								<TableCell>${grave.price.toLocaleString()}</TableCell>
								<TableCell>
									<Badge variant={getStatusBadgeVariant(grave.status)}>
										{grave.status}
									</Badge>
								</TableCell>
								<TableCell className="max-w-[200px] truncate">
									{grave.locationNotes}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</ScrollArea>
		</div>
	);
}
