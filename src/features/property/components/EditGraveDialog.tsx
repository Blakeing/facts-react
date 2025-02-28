import { useState } from "react";
import { toast } from "sonner";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

import { GraveForm } from "./GraveForm";
import { useUpdateGrave } from "../hooks/usePropertyQueries";
import type { Grave } from "../types";

interface EditGraveDialogProps {
	grave: Grave;
	onSuccess?: () => void;
	trigger?: React.ReactNode;
}

export function EditGraveDialog({
	grave,
	onSuccess,
	trigger,
}: EditGraveDialogProps) {
	const [open, setOpen] = useState(false);
	const updateGraveMutation = useUpdateGrave();

	const handleSubmit = async (data: Omit<Grave, "id"> & { notes: string }) => {
		try {
			await updateGraveMutation.mutateAsync({
				...data,
				id: grave.id,
			});
			toast.success("Grave updated successfully");
			setOpen(false);
			onSuccess?.();
		} catch (error) {
			toast.error("Failed to update grave");
			console.error(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button size="sm" variant="ghost">
						<Edit className="h-4 w-4" />
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Edit Grave</DialogTitle>
					<DialogDescription>
						Update the details of this grave.
					</DialogDescription>
				</DialogHeader>
				<GraveForm
					grave={grave}
					onSubmit={handleSubmit}
					onCancel={() => setOpen(false)}
					isSubmitting={updateGraveMutation.isPending}
				/>
			</DialogContent>
		</Dialog>
	);
}
