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
import { Edit, ArrowLeft, Trash2, X, Plus } from "lucide-react";

import {
	useBlock,
	useGraves,
	useLot,
	useProperty,
	useSection,
} from "@/features/property/hooks/usePropertyQueries";
import { CreateGraveDialog } from "@/features/property/components/CreateGraveDialog";
import { createQueryParams } from "@/utils/url";

// Define the search params type
interface BlockSearchParams {
	sectionId: string;
	sectionName: string;
	lotId: string;
	lotName: string;
	blockId: string;
	blockName: string;
}

export const Route = createFileRoute("/property/block")({
	component: BlockDetailPage,
	validateSearch: (search: Record<string, unknown>): BlockSearchParams => {
		// Validate and transform search parameters
		return {
			sectionId: String(search["sectionId"] || ""),
			sectionName: String(search["sectionName"] || ""),
			lotId: String(search["lotId"] || ""),
			lotName: String(search["lotName"] || ""),
			blockId: String(search["blockId"] || ""),
			blockName: String(search["blockName"] || ""),
		};
	},
});

function BlockDetailPage() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	// Convert string IDs to numbers
	const sectionIdNum = Number.parseInt(search.sectionId, 10);
	const lotIdNum = Number.parseInt(search.lotId, 10);
	const blockIdNum = Number.parseInt(search.blockId, 10);

	// Format names for display
	const formattedSectionName = formatNameForDisplay(search.sectionName);
	const formattedLotName = formatNameForDisplay(search.lotName);
	const formattedBlockName = formatNameForDisplay(search.blockName);

	const [isCreatingGrave, setIsCreatingGrave] = useState(false);

	const { data: property } = useProperty(1); // We'll need to get the property ID from somewhere
	const { data: section } = useSection(sectionIdNum);
	const { data: lot } = useLot(lotIdNum);
	const { data: block } = useBlock(blockIdNum);
	const { data: graves, refetch: refetchGraves } = useGraves(blockIdNum);

	const isLoading = !property || !section || !lot || !block || !graves;

	if (isLoading) {
		return <div className="py-8 text-center">Loading block details...</div>;
	}

	const handleCreateGrave = () => {
		setIsCreatingGrave(true);
	};

	const handleGraveCreated = () => {
		setIsCreatingGrave(false);
		refetchGraves();
		toast.success("Grave created successfully");
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
				</BreadcrumbList>
			</Breadcrumb>

			<div className="flex items-center justify-between">
				<Button variant="outline" size="sm" asChild>
					<Link to="/property">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Properties
					</Link>
				</Button>
				<Button size="sm" onClick={handleCreateGrave}>
					<Plus className="mr-2 h-4 w-4" />
					Create Grave
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Block {formattedBlockName}</CardTitle>
					<CardDescription>
						Lot {formattedLotName}, {formattedSectionName}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<h3 className="text-lg font-medium">Graves</h3>
						{graves.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								No graves found in this block.
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{graves.map((grave) => (
									<Card key={grave.id} className="overflow-hidden">
										<CardHeader className="pb-2">
											<CardTitle className="text-base flex items-center justify-between">
												<span>{grave.name}</span>
												<Badge variant={getStatusBadgeVariant(grave.status)}>
													{grave.status}
												</Badge>
											</CardTitle>
											<CardDescription className="text-xs">
												Size: {grave.size}
											</CardDescription>
										</CardHeader>
										<CardContent className="pb-2">
											<p className="text-sm">
												Price: ${grave.price.toLocaleString()}
											</p>
										</CardContent>
										<CardFooter className="flex justify-end pt-0">
											<Button variant="outline" size="sm" asChild>
												<Link
													to="/property/property.grave.$graveId"
													params={{
														graveId: String(grave.id),
													}}
													search={{
														...createQueryParams(grave.id, grave.name),
														sectionId: search.sectionId,
														sectionName: search.sectionName,
														lotId: search.lotId,
														lotName: search.lotName,
														blockId: search.blockId,
														blockName: search.blockName,
														graveName: grave.name,
													}}
												>
													View Details
												</Link>
											</Button>
										</CardFooter>
									</Card>
								))}
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{isCreatingGrave && (
				<CreateGraveDialog
					blockId={blockIdNum}
					onClose={() => setIsCreatingGrave(false)}
					onCreated={handleGraveCreated}
				/>
			)}
		</div>
	);
}
