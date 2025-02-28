import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
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
import { GraveSearchParams } from "./grave"; // Import the GraveSearchParams type

// Mock data for graves - in a real app, you would fetch this from an API
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

export const Route = createFileRoute("/property/grave/$graveId")({
	component: GraveDetailPage,
	validateSearch: (search: Record<string, unknown>) => {
		// Make all search parameters optional
		const result = {
			sectionId: String(search["sectionId"] || ""),
			sectionName: String(search["sectionName"] || ""),
			lotId: String(search["lotId"] || ""),
			lotName: String(search["lotName"] || ""),
			blockId: String(search["blockId"] || ""),
			blockName: String(search["blockName"] || ""),
			graveId: String(search["graveId"] || ""),
			graveName: String(search["graveName"] || ""),
		};
		return result;
	},
});

function GraveDetailPage() {
	const { graveId } = Route.useParams();
	const id = Number.parseInt(graveId);

	// Find the grave data by ID
	const grave = gravesData.find((g) => g.id === id);

	if (!grave) {
		return (
			<div className="h-full w-full p-4 flex items-center justify-center">
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
		<div className="h-full w-full p-4 overflow-auto">
			<div className="max-w-3xl mx-auto">
				<div className="mb-6">
					<Button variant="outline" size="sm" asChild className="mb-4">
						<Link to="/property">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Property
						</Link>
					</Button>
					<h1 className="text-2xl font-bold">{grave.name}</h1>
					<p className="text-muted-foreground">ID: {grave.id}</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Grave Details</CardTitle>
						<CardDescription>
							View and edit details for this grave.
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
					<CardFooter className="flex justify-end">
						<Button>
							<Save className="h-4 w-4 mr-2" />
							Save Changes
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
