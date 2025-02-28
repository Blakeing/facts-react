import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Save, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Mock data for graves
interface Grave {
	id: number;
	name: string;
	item: string;
	developed: string;
	status: string;
}

const gravesData: Grave[] = [
	{
		id: 1,
		name: "Grave 1",
		item: "Double Depth Ground Interment Right",
		developed: "Y",
		status: "Sold",
	},
	{
		id: 2,
		name: "Grave 2",
		item: "Double Depth Ground Interment Right",
		developed: "Y",
		status: "Sold",
	},
	{
		id: 3,
		name: "Grave 3",
		item: "Double Depth Ground Interment Right",
		developed: "Y",
		status: "Sold",
	},
	{
		id: 4,
		name: "Grave 4",
		item: "Double Depth Ground Interment Right",
		developed: "Y",
		status: "Sold",
	},
];

export const Route = createFileRoute(
	"/property/$sectionId/$lotId/$blockId/grave/$graveId",
)({
	component: GraveDetailPage,
});

function GraveDetailPage() {
	const { sectionId, lotId, blockId, graveId } = Route.useParams();
	const id = Number.parseInt(graveId);

	// Find the grave data by ID
	const grave = gravesData.find((g) => g.id === id);

	if (!grave) {
		return (
			<div className="h-full w-full p-6 flex items-center justify-center bg-background">
				<div className="text-center">
					<h2 className="text-xl font-semibold mb-2">Grave Not Found</h2>
					<p className="text-muted-foreground mb-4">
						The grave with ID {graveId} could not be found.
					</p>
					<Button asChild>
						<Link to="/property">Back to Property</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full w-full bg-background">
			<div className="max-w-4xl mx-auto p-6">
				{/* Header with breadcrumb navigation */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h1 className="text-2xl font-bold">Grave Details</h1>
						<Button variant="outline" asChild>
							<Link to="/property">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to Property
							</Link>
						</Button>
					</div>

					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Link to="/" className="hover:underline">
							Property
						</Link>
						<ChevronRight className="h-4 w-4" />
						<span>{sectionId}</span>
						<ChevronRight className="h-4 w-4" />
						<span>{lotId}</span>
						<ChevronRight className="h-4 w-4" />
						<span>{blockId}</span>
						<ChevronRight className="h-4 w-4" />
						<span className="font-medium text-foreground">Grave {graveId}</span>
					</div>
				</div>

				{/* Main content */}
				<div className="grid grid-cols-1 gap-6">
					{/* Basic Information Card */}
					<Card>
						<CardHeader>
							<CardTitle>Basic Information</CardTitle>
							<CardDescription>
								View and edit basic details for this grave
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input id="name" defaultValue={grave.name} />
								</div>

								<div className="space-y-2">
									<Label htmlFor="item">Item</Label>
									<Input id="item" defaultValue={grave.item} />
								</div>

								<div className="space-y-2">
									<Label htmlFor="developed">Developed</Label>
									<Select defaultValue={grave.developed}>
										<SelectTrigger id="developed">
											<SelectValue placeholder="Select" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Y">Yes</SelectItem>
											<SelectItem value="N">No</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="status">Status</Label>
									<Select defaultValue={grave.status}>
										<SelectTrigger id="status">
											<SelectValue placeholder="Select" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Available">Available</SelectItem>
											<SelectItem value="Sold">Sold</SelectItem>
											<SelectItem value="Reserved">Reserved</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Location Information Card */}
					<Card>
						<CardHeader>
							<CardTitle>Location Information</CardTitle>
							<CardDescription>
								Details about where this grave is located
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label htmlFor="section">Section</Label>
									<Input id="section" value={sectionId} readOnly />
								</div>

								<div className="space-y-2">
									<Label htmlFor="lot">Lot</Label>
									<Input id="lot" value={lotId} readOnly />
								</div>

								<div className="space-y-2">
									<Label htmlFor="block">Block</Label>
									<Input id="block" value={blockId} readOnly />
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Additional Information Card */}
					<Card>
						<CardHeader>
							<CardTitle>Additional Information</CardTitle>
							<CardDescription>Other details about this grave</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="notes">Notes</Label>
									<textarea
										id="notes"
										className="w-full min-h-[100px] p-2 border rounded-md"
										placeholder="Add notes about this grave..."
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Footer with actions */}
				<div className="mt-6 flex justify-end gap-2">
					<Button variant="outline" asChild>
						<Link to="/">Cancel</Link>
					</Button>
					<Button>
						<Save className="h-4 w-4 mr-2" />
						Save Changes
					</Button>
				</div>
			</div>
		</div>
	);
}
