import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { createSheet } from "@/hooks/use-create-sheet";
import { Plus } from "lucide-react";
import { BaseSheet } from "./BaseSheet";

interface TestSheetData {
	message: string;
	count: number;
}

const useTestSheet = createSheet<TestSheetData>();
export { useTestSheet };

function TestSheet() {
	const { isOpen, onClose, data, setData } = useTestSheet();

	// Example of setting data
	const handleSecondaryClick = () => {
		setData({
			message: "Clicked from nested sheet!",
			count: (data?.count ?? 0) + 1,
		});
	};

	const description = (
		<div className="space-y-4">
			<div>This is a test sheet that demonstrates the sheet pattern.</div>
			{data && (
				<div className="rounded-md bg-muted p-4">
					<p>Message: {data.message}</p>
					<p>Click Count: {data.count}</p>
				</div>
			)}
			<Sheet>
				<Button size="sm" asChild>
					<SheetTrigger onClick={handleSecondaryClick}>
						<Plus className="mr-2 size-4" />
						Secondary Sheet Test
					</SheetTrigger>
				</Button>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Secondary Content</SheetTitle>
						<div>This is a nested sheet example.</div>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		</div>
	);

	return (
		<BaseSheet
			isOpen={isOpen}
			onClose={onClose}
			title="Test Sheet"
			description={description}
		/>
	);
}

export { TestSheet };
