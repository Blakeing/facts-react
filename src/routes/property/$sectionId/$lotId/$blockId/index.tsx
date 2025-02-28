import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronRight, Edit, ArrowLeft, Trash2, X } from "lucide-react";
import { extractId } from "@/utils/url";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { GravesList } from "@/features/property/components/GravesList";
import {
	useProperty,
	useSection,
	useLot,
	useBlock,
	useUpdateBlock,
	useDeleteBlock,
} from "@/features/property/hooks/usePropertyQueries";

export const Route = createFileRoute("/property/$sectionId/$lotId/$blockId/")({
	component: BlockDetailPage,
});

function BlockDetailPage() {
	const { sectionId, lotId, blockId } = Route.useParams();
	const navigate = Route.useNavigate();

	// Extract IDs from the URL parameters
	const sectionIdNum = Number.parseInt(extractId(sectionId), 10);
	const lotIdNum = Number.parseInt(extractId(lotId), 10);
	const blockIdNum = Number.parseInt(extractId(blockId), 10);

	// Extract names from the URL parameters
	const sectionName = sectionId.split("-").slice(1).join("-") || "Section";
	const lotName = lotId.split("-").slice(1).join("-") || "Lot";
	const blockName = blockId.split("-").slice(1).join("-") || "Block";
	const propertyName = "Property"; // We'll need to get this from somewhere else

	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
	});

	const { data: property } = useProperty(1); // We'll need to get the property ID from somewhere
	const { data: section } = useSection(sectionIdNum);
	const { data: lot } = useLot(lotIdNum);
	const { data: block, refetch } = useBlock(blockIdNum);

	const updateBlockMutation = useUpdateBlock();
	const deleteBlockMutation = useDeleteBlock();

	const isLoading = !property || !section || !lot || !block;

	if (isLoading) {
		return <div className="py-8 text-center">Loading block details...</div>;
	}

	// Initialize form data when block data is loaded
	if (block && formData.name === "") {
		setFormData({
			name: block.name,
			description: block.description,
		});
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleUpdate = async () => {
		try {
			await updateBlockMutation.mutateAsync({
				id: block.id,
				lotId: block.lotId,
				name: formData.name,
				description: formData.description,
			});
			toast.success("Block updated successfully");
			setIsEditing(false);
			refetch();
		} catch (error) {
			toast.error("Failed to update block");
			console.error(error);
		}
	};

	const handleDelete = async () => {
		try {
			await deleteBlockMutation.mutateAsync(block.id);
			toast.success("Block deleted successfully");
			navigate({
				to: "/property",
			});
		} catch (error) {
			toast.error("Failed to delete block");
			console.error(error);
			setIsDeleting(false);
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
						<BreadcrumbLink>{sectionName}</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink>{lotName}</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink>{blockName}</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="flex items-center justify-between">
				<Button variant="outline" size="sm" asChild>
					<Link to="/property">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Properties
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
							<Button
								variant="default"
								size="sm"
								onClick={handleUpdate}
								disabled={updateBlockMutation.isPending}
							>
								{updateBlockMutation.isPending ? "Saving..." : "Save Changes"}
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
								Edit Block
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={() => setIsDeleting(true)}
								disabled={isDeleting || deleteBlockMutation.isPending}
							>
								<Trash2 className="mr-2 h-4 w-4" />
								{deleteBlockMutation.isPending ? "Deleting..." : "Delete Block"}
							</Button>
						</>
					)}
				</div>
			</div>

			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Block {blockName}</CardTitle>
						<CardDescription>
							Lot {lotName}, {sectionName}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isEditing ? (
							<div className="space-y-4">
								<div className="grid gap-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										name="description"
										value={formData.description}
										onChange={handleInputChange}
										rows={4}
									/>
								</div>
							</div>
						) : (
							<div className="space-y-2">
								<div>
									<span className="font-medium">Description:</span>{" "}
									{block.description || "No description available."}
								</div>
							</div>
						)}
					</CardContent>
					{isDeleting && (
						<CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-4">
							<div>
								<h3 className="font-medium text-destructive">
									Confirm Deletion
								</h3>
								<p className="text-sm text-muted-foreground">
									Are you sure you want to delete this block? This will also
									delete all graves within this block. This action cannot be
									undone.
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
									disabled={deleteBlockMutation.isPending}
								>
									{deleteBlockMutation.isPending
										? "Deleting..."
										: "Confirm Delete"}
								</Button>
							</div>
						</CardFooter>
					)}
				</Card>

				<Card>
					<CardContent className="pt-6">
						<GravesList blockId={blockId} sectionId={sectionId} lotId={lotId} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
