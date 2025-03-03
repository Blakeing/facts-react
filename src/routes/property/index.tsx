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
	Loader2,
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
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
		return (
			<div className="flex h-full w-full items-center justify-center">
				<div className="flex flex-col items-center gap-2">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<p className="text-sm text-muted-foreground">
						Loading property data...
					</p>
				</div>
			</div>
		);
	}

	if (!properties || properties.length === 0) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<Card className="w-[400px]">
					<CardHeader>
						<CardTitle className="text-center">No Properties Found</CardTitle>
					</CardHeader>
					<CardContent className="flex justify-center">
						<CreatePropertyDialog onSuccess={() => refetchProperties()} />
					</CardContent>
				</Card>
			</div>
		);
	}

	// Get the property for display
	const property = selectedProperty || properties[0];

	if (!property) {
		return <div className="py-8 text-center">Property data is invalid.</div>;
	}

	return (
		<div className="h-full w-full p-6 overflow-hidden">
			<div className="flex h-full w-full overflow-hidden rounded-lg border bg-background shadow-sm">
				{/* Left sidebar - contained within the main content area */}
				<div className="w-[280px] border-r">
					<div className="h-full flex flex-col">
						<div className="border-b px-4 py-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Building2 className="h-5 w-5 text-primary" />
									<h2 className="text-lg font-semibold">Property Explorer</h2>
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
							<div className="px-4 py-3 font-medium text-xs uppercase tracking-wider text-muted-foreground">
								Container Hierarchy
							</div>
							<TreeView
								data={treeData}
								onSelectChange={handleTreeItemSelect}
								initialSelectedItemId={selectedItemId}
								defaultNodeIcon={Folder}
								defaultLeafIcon={FileText}
								className="px-2"
							/>
						</div>
					</div>
				</div>

				{/* Right content area */}
				<div className="flex-1 overflow-auto">
					<div className="p-6">
						<div className="mb-6">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-2xl font-semibold text-primary">
									Inventory Management
								</h2>
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

							<Breadcrumb className="mb-4">
								<BreadcrumbList>
									{selectedProperty && (
										<BreadcrumbItem>
											<BreadcrumbLink
												onClick={() => {
													setSelectedSection(null);
													setSelectedLot(null);
													setSelectedBlock(null);
												}}
												className="font-medium cursor-pointer"
											>
												{selectedProperty.name}
											</BreadcrumbLink>
										</BreadcrumbItem>
									)}
									{selectedSection && (
										<>
											<BreadcrumbSeparator />
											<BreadcrumbItem>
												<BreadcrumbLink
													onClick={() => {
														setSelectedLot(null);
														setSelectedBlock(null);
													}}
													className="font-medium cursor-pointer"
												>
													{selectedSection.name}
												</BreadcrumbLink>
											</BreadcrumbItem>
										</>
									)}
									{selectedLot && (
										<>
											<BreadcrumbSeparator />
											<BreadcrumbItem>
												<BreadcrumbLink
													onClick={() => {
														setSelectedBlock(null);
													}}
													className="font-medium cursor-pointer"
												>
													{selectedLot.name}
												</BreadcrumbLink>
											</BreadcrumbItem>
										</>
									)}
									{selectedBlock && (
										<>
											<BreadcrumbSeparator />
											<BreadcrumbItem>
												<BreadcrumbLink className="font-medium">
													{selectedBlock.name}
												</BreadcrumbLink>
											</BreadcrumbItem>
										</>
									)}
								</BreadcrumbList>
							</Breadcrumb>

							<div className="text-sm text-muted-foreground">
								{selectedProperty && (
									<span>
										Location:{" "}
										<span className="font-medium">
											{selectedProperty.location}
										</span>
									</span>
								)}
							</div>
						</div>

						<Separator className="my-4" />

						{/* Inventory table */}
						{selectedBlock && graves ? (
							<>
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-medium">Grave Inventory</h3>
									{isLoadingGraves && (
										<div className="flex items-center gap-2">
											<Loader2 className="h-4 w-4 animate-spin" />
											<span className="text-sm text-muted-foreground">
												Refreshing...
											</span>
										</div>
									)}
								</div>
								<div className="rounded-lg border shadow-sm overflow-hidden">
									<ScrollArea className="h-[calc(100vh-24rem)]">
										<Table>
											<TableHeader>
												<TableRow className="bg-muted/50">
													<TableHead className="w-[100px]">Actions</TableHead>
													<TableHead>Name</TableHead>
													<TableHead>Size</TableHead>
													<TableHead>Price</TableHead>
													<TableHead>Status</TableHead>
													<TableHead>Notes</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{graves.length === 0 ? (
													<TableRow>
														<TableCell colSpan={6} className="h-24 text-center">
															No graves found in this block
														</TableCell>
													</TableRow>
												) : (
													graves.map((grave) => (
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
																			graveId: String(grave.id),
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
																		graveId: String(grave.id),
																		graveName: grave.name,
																	})}
																	className="font-medium hover:underline cursor-pointer text-primary"
																>
																	{grave.name}
																</Link>
															</TableCell>
															<TableCell>{grave.size}</TableCell>
															<TableCell>
																${grave.price.toLocaleString()}
															</TableCell>
															<TableCell>
																<Badge
																	variant={getStatusBadgeVariant(grave.status)}
																>
																	{grave.status}
																</Badge>
															</TableCell>
															<TableCell className="max-w-[200px] truncate">
																{grave.locationNotes || "—"}
															</TableCell>
														</TableRow>
													))
												)}
											</TableBody>
										</Table>
									</ScrollArea>
								</div>
							</>
						) : (
							<div className="flex flex-col h-[calc(100vh-24rem)] items-center justify-center rounded-lg border bg-muted/10 p-8">
								{isLoading ? (
									<div className="flex flex-col items-center gap-2">
										<Loader2 className="h-8 w-8 animate-spin text-primary" />
										<p className="text-muted-foreground">
											Loading inventory data...
										</p>
									</div>
								) : (
									<div className="flex flex-col items-center gap-4 text-center">
										<FileText className="h-12 w-12 text-muted-foreground/50" />
										<div>
											<h3 className="text-lg font-medium mb-1">
												No Block Selected
											</h3>
											<p className="text-sm text-muted-foreground">
												Select a block from the tree view to display its
												inventory
											</p>
										</div>
										{selectedLot && (
											<CreateBlockDialog
												lotId={selectedLot.id}
												onSuccess={() => refetchBlocks()}
											/>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
