import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import {
	Building2,
	ChevronRight,
	Edit,
	FolderOpen,
	Folder,
	FileText,
	Plus,
} from "lucide-react";
import { createIdSlug } from "@/utils/url";

import { TreeView, type TreeDataItem } from "@/components/ui/tree-view";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import {
	useProperties,
	useSections,
	useLots,
	useBlocks,
	useGraves,
	CreatePropertyDialog,
	CreateSectionDialog,
	CreateLotDialog,
	CreateBlockDialog,
	CreateGraveDialog,
	DeleteGraveDialog,
} from "@/features/property";
import type {
	Property,
	Section,
	Lot,
	Block,
	Grave,
} from "@/features/property/types";

export const Route = createFileRoute("/property/")({
	component: PropertyPage,
});

function PropertyPage() {
	const [selectedProperty, setSelectedProperty] = useState<Property | null>(
		null,
	);
	const [selectedSection, setSelectedSection] = useState<Section | null>(null);
	const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
	const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
	const [selectedItemId, setSelectedItemId] = useState<string | undefined>(
		undefined,
	);

	// Fetch data using React Query
	const {
		data: properties,
		isLoading: isLoadingProperties,
		refetch: refetchProperties,
	} = useProperties();
	const {
		data: sections,
		isLoading: isLoadingSections,
		refetch: refetchSections,
	} = useSections();
	const {
		data: lots,
		isLoading: isLoadingLots,
		refetch: refetchLots,
	} = useLots(selectedSection?.id);
	const {
		data: blocks,
		isLoading: isLoadingBlocks,
		refetch: refetchBlocks,
	} = useBlocks(selectedLot?.id);
	const {
		data: graves,
		isLoading: isLoadingGraves,
		refetch: refetchGraves,
	} = useGraves(selectedBlock?.id);

	// Set the selected property when properties change
	useEffect(() => {
		if (properties && properties.length > 0 && !selectedProperty) {
			const firstProperty = properties[0];
			if (firstProperty) {
				setSelectedProperty(firstProperty);
			}
		}
	}, [properties, selectedProperty]);

	const isLoading =
		isLoadingProperties ||
		isLoadingSections ||
		(selectedSection && isLoadingLots) ||
		(selectedLot && isLoadingBlocks) ||
		(selectedBlock && isLoadingGraves);

	// Convert property data to TreeView format
	const treeData: TreeDataItem[] =
		properties && properties.length > 0
			? properties.map((property) => {
					// Create a descriptive name for the property
					const propertyName = `${property.name} (${property.location})`;

					return {
						id: property.id.toString(),
						name: propertyName,
						icon: Building2,
						onClick: () => {
							setSelectedProperty(property);
							setSelectedSection(null);
							setSelectedLot(null);
							setSelectedBlock(null);
						},
						children:
							sections
								?.filter((section) => section.propertyId === property.id)
								.map((section) => {
									// Create a descriptive name for the section
									const sectionName = section.name;

									const sectionItem: TreeDataItem = {
										id: section.id.toString(),
										name: sectionName,
										icon: Folder,
										openIcon: FolderOpen,
										onClick: () => {
											setSelectedProperty(property);
											setSelectedSection(section);
											setSelectedLot(null);
											setSelectedBlock(null);
										},
									};

									if (lots && selectedSection?.id === section.id) {
										const sectionLots = lots.filter(
											(lot) => lot.sectionId === section.id,
										);
										if (sectionLots.length > 0) {
											sectionItem.children = sectionLots.map((lot) => {
												// Create a descriptive name for the lot
												const lotName = lot.name;

												const lotItem: TreeDataItem = {
													id: lot.id.toString(),
													name: lotName,
													icon: Folder,
													openIcon: FolderOpen,
													onClick: () => {
														setSelectedSection(section);
														setSelectedLot(lot);
														setSelectedBlock(null);
													},
												};

												if (blocks && selectedLot?.id === lot.id) {
													const lotBlocks = blocks.filter(
														(block) => block.lotId === lot.id,
													);
													if (lotBlocks.length > 0) {
														lotItem.children = lotBlocks.map((block) => {
															// Create a descriptive name for the block
															const blockName = block.name;

															return {
																id: block.id.toString(),
																name: blockName,
																icon: FileText,
																onClick: () => {
																	setSelectedSection(section);
																	setSelectedLot(lot);
																	setSelectedBlock(block);
																},
															};
														});
													}
												}

												return lotItem;
											});
										}
									}

									return sectionItem;
								}) || [],
					};
				})
			: [];

	// Handle tree item selection
	const handleTreeItemSelect = useCallback((item: TreeDataItem | undefined) => {
		if (item) {
			setSelectedItemId(item.id);
			item.onClick?.();
		}
	}, []);

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

	if (isLoadingProperties || isLoadingSections) {
		return <div className="py-8 text-center">Loading property data...</div>;
	}

	if (!properties || properties.length === 0) {
		return (
			<div className="py-8 text-center">
				<p className="mb-4">No properties found.</p>
				<CreatePropertyDialog onSuccess={() => refetchProperties()} />
			</div>
		);
	}

	// Get the property for display
	const property = selectedProperty || properties[0];

	if (!property) {
		return <div className="py-8 text-center">Property data is invalid.</div>;
	}

	return (
		<div className="h-full w-full p-4 overflow-hidden">
			<div className="flex h-full w-full overflow-hidden rounded-md border bg-background">
				{/* Left sidebar - contained within the main content area */}
				<div className="w-[250px] border-r">
					<div className="h-full flex flex-col">
						<div className="border-b px-4 py-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Building2 className="h-5 w-5" />
									<h2 className="text-lg font-semibold">Property Viewer</h2>
								</div>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<CreatePropertyDialog
												onSuccess={() => refetchProperties()}
												trigger={
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
													>
														<Plus className="h-4 w-4" />
													</Button>
												}
											/>
										</TooltipTrigger>
										<TooltipContent>
											<p>Create Property</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</div>
						<div className="flex-1 overflow-auto">
							<div className="px-2 py-2 font-medium text-sm text-muted-foreground">
								CONTAINER LIST
							</div>
							<TreeView
								data={treeData}
								onSelectChange={handleTreeItemSelect}
								initialSelectedItemId={selectedItemId}
								defaultNodeIcon={Folder}
								defaultLeafIcon={FileText}
							/>
						</div>
					</div>
				</div>

				{/* Right content area */}
				<div className="flex-1 overflow-auto">
					<div className="p-4">
						<div className="mb-4">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">INVENTORY</h2>
								<div className="flex space-x-2">
									{selectedProperty && !selectedSection && (
										<CreateSectionDialog
											propertyId={selectedProperty.id}
											onSuccess={() => refetchSections()}
										/>
									)}
									{selectedSection && !selectedLot && (
										<CreateLotDialog
											sectionId={selectedSection.id}
											onSuccess={() => refetchLots()}
										/>
									)}
									{selectedLot && !selectedBlock && (
										<CreateBlockDialog
											lotId={selectedLot.id}
											onSuccess={() => refetchBlocks()}
										/>
									)}
									{selectedBlock && (
										<CreateGraveDialog
											blockId={selectedBlock.id}
											onSuccess={() => refetchGraves()}
										/>
									)}
								</div>
							</div>
							<div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
								{selectedProperty && (
									<span className="font-medium">
										{selectedProperty.name} ({selectedProperty.location})
									</span>
								)}
								{selectedSection && (
									<>
										<ChevronRight className="h-4 w-4" />
										<span className="font-medium">{selectedSection.name}</span>
									</>
								)}
								{selectedLot && (
									<>
										<ChevronRight className="h-4 w-4" />
										<span className="font-medium">{selectedLot.name}</span>
									</>
								)}
								{selectedBlock && (
									<>
										<ChevronRight className="h-4 w-4" />
										<span className="font-medium">{selectedBlock.name}</span>
									</>
								)}
							</div>
						</div>

						{/* Inventory table */}
						{selectedBlock && graves ? (
							<ScrollArea className="h-[calc(100vh-20rem)]">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[100px]">Actions</TableHead>
											<TableHead>Name</TableHead>
											<TableHead>Size</TableHead>
											<TableHead>Price</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Notes</TableHead>
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
															to="/property/grave/$graveId"
															params={{
																graveId: String(grave.id),
															}}
															search={() => ({
																sectionId: selectedSection?.id
																	? String(selectedSection.id)
																	: "",
																sectionName: selectedSection?.name || "",
																lotId: selectedLot?.id
																	? String(selectedLot.id)
																	: "",
																lotName: selectedLot?.name || "",
																blockId: String(selectedBlock.id),
																blockName: selectedBlock.name,
																graveName: grave.name,
															})}
														>
															<Edit className="h-4 w-4" />
														</Link>
													</Button>
													<DeleteGraveDialog
														grave={grave}
														onSuccess={() => refetchGraves()}
													/>
												</TableCell>
												<TableCell>
													<Link
														to="/property/grave/$graveId"
														params={{
															graveId: String(grave.id),
														}}
														search={() => ({
															sectionId: selectedSection?.id
																? String(selectedSection.id)
																: "",
															sectionName: selectedSection?.name || "",
															lotId: selectedLot?.id
																? String(selectedLot.id)
																: "",
															lotName: selectedLot?.name || "",
															blockId: String(selectedBlock.id),
															blockName: selectedBlock.name,
															graveName: grave.name,
														})}
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
						) : (
							<div className="flex h-[calc(100vh-20rem)] items-center justify-center text-muted-foreground">
								{isLoading ? "Loading..." : "Select a block to view inventory"}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
