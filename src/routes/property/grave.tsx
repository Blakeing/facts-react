import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { formatNameForDisplay } from "@/utils/url";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowLeft, Trash2, X } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { GraveForm } from "@/features/property/components/GraveForm";
import {
	useBlock,
	useDeleteGrave,
	useGrave,
	useLot,
	useProperty,
	useSection,
	useUpdateGrave,
} from "@/features/property/hooks/usePropertyQueries";
import type { Grave } from "@/features/property/types";

// Define the GraveFormSubmission type locally
type GraveFormSubmission = Omit<Grave, "id">;

// Define the search params type
export interface GraveSearchParams {
	sectionId: string;
	sectionName: string;
	lotId: string;
	lotName: string;
	blockId: string;
	blockName: string;
	graveId: string;
	graveName: string;
}

export const Route = createFileRoute("/property/grave")({
	component: GraveDetailPage,
	validateSearch: (search: Record<string, unknown>): GraveSearchParams => {
		// Validate and transform search parameters
		return {
			sectionId: String(search["sectionId"] || ""),
			sectionName: String(search["sectionName"] || ""),
			lotId: String(search["lotId"] || ""),
			lotName: String(search["lotName"] || ""),
			blockId: String(search["blockId"] || ""),
			blockName: String(search["blockName"] || ""),
			graveId: String(search["graveId"] || ""),
			graveName: String(search["graveName"] || ""),
		};
	},
});

function GraveDetailPage() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	// Convert string IDs to numbers
	const sectionIdNum = Number.parseInt(search["sectionId"], 10);
	const lotIdNum = Number.parseInt(search["lotId"], 10);
	const blockIdNum = Number.parseInt(search["blockId"], 10);
	const graveIdNum = Number.parseInt(search["graveId"], 10);

	// Format names for display
	const formattedSectionName = formatNameForDisplay(search["sectionName"]);
	const formattedLotName = formatNameForDisplay(search["lotName"]);
	const formattedBlockName = formatNameForDisplay(search["blockName"]);
	const formattedGraveName = formatNameForDisplay(search["graveName"]);

	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const { data: property } = useProperty(1); // We'll need to get the property ID from somewhere
	const { data: section } = useSection(sectionIdNum);
	const { data: lot } = useLot(lotIdNum);
	const { data: block } = useBlock(blockIdNum);
	const { data: grave, refetch } = useGrave(graveIdNum);

	const updateGraveMutation = useUpdateGrave();
	const deleteGraveMutation = useDeleteGrave();

	const isLoading = !property || !section || !lot || !block || !grave;

	if (isLoading) {
		return <div className="py-8 text-center">Loading grave details...</div>;
	}

	const handleSubmit = async (data: GraveFormSubmission) => {
		try {
			await updateGraveMutation.mutateAsync({
				...data,
				id: graveIdNum,
			});
			toast.success("Grave updated successfully");
			setIsEditing(false);
			refetch();
		} catch (error) {
			toast.error("Failed to update grave");
			console.error(error);
		}
	};

	const handleDelete = async () => {
		try {
			await deleteGraveMutation.mutateAsync(grave.id);
			toast.success("Grave deleted successfully");
			navigate({
				to: "/property",
			});
		} catch (error) {
			toast.error("Failed to delete grave");
			console.error(error);
			setIsDeleting(false);
		}
	};

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
		<div className="space-y-6">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link to="/property">Properties</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink>{formattedSectionName}</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink>{formattedLotName}</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink>{formattedBlockName}</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink>{formattedGraveName}</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="flex items-center justify-between">
				<Button variant="outline" size="sm" asChild>
					<Link
						to="/property/"
						search={{
							sectionId: search.sectionId,
							sectionName: search.sectionName,
							lotId: search.lotId,
							lotName: search.lotName,
							blockId: search.blockId,
							blockName: search.blockName,
						}}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Block
					</Link>
				</Button>
				<div className="flex space-x-2">
					{isEditing ? (
						<>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsEditing(false)}
							>
								<X className="mr-2 h-4 w-4" />
								Cancel
							</Button>
						</>
					) : (
						<>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsEditing(true)}
							>
								<Edit className="mr-2 h-4 w-4" />
								Edit Grave
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={() => setIsDeleting(true)}
								disabled={isDeleting || deleteGraveMutation.isPending}
							>
								<Trash2 className="mr-2 h-4 w-4" />
								{deleteGraveMutation.isPending ? "Deleting..." : "Delete Grave"}
							</Button>
						</>
					)}
				</div>
			</div>

			<Card>
				<CardHeader className={isEditing ? "pb-2" : ""}>
					<CardTitle className="flex items-center justify-between">
						<span>Grave {formattedGraveName}</span>
						<Badge variant={getStatusBadgeVariant(grave.status)}>
							{grave.status}
						</Badge>
					</CardTitle>
					<CardDescription>
						Block {formattedBlockName}, Lot {formattedLotName},{" "}
						{formattedSectionName}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isEditing ? (
						<GraveForm
							grave={grave}
							onSubmit={handleSubmit}
							onCancel={() => setIsEditing(false)}
							isSubmitting={updateGraveMutation.isPending}
						/>
					) : (
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<h3 className="text-sm font-medium text-muted-foreground">
										Name
									</h3>
									<p>{grave.name}</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-muted-foreground">
										Size
									</h3>
									<p>{grave.size}</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-muted-foreground">
										Price
									</h3>
									<p>${grave.price.toLocaleString()}</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-muted-foreground">
										Status
									</h3>
									<p>{grave.status}</p>
								</div>
							</div>
							<div>
								<h3 className="text-sm font-medium text-muted-foreground">
									Location Notes
								</h3>
								<p className="whitespace-pre-wrap">
									{grave.locationNotes || "No location notes available."}
								</p>
							</div>
						</div>
					)}
				</CardContent>
				{isDeleting && (
					<CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-4">
						<div>
							<h3 className="font-medium text-destructive">Confirm Deletion</h3>
							<p className="text-sm text-muted-foreground">
								Are you sure you want to delete this grave? This action cannot
								be undone.
							</p>
						</div>
						<div className="flex space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsDeleting(false)}
							>
								Cancel
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={handleDelete}
								disabled={deleteGraveMutation.isPending}
							>
								{deleteGraveMutation.isPending
									? "Deleting..."
									: "Confirm Delete"}
							</Button>
						</div>
					</CardFooter>
				)}
			</Card>
		</div>
	);
}
