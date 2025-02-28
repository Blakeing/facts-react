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
import { Plus } from "lucide-react";

import { GraveForm } from "./GraveForm";
import { useCreateGrave } from "../hooks/usePropertyQueries";
import type { Grave } from "../types";

interface CreateGraveDialogProps {
	blockId: number;
	onSuccess?: () => void;
}

export function CreateGraveDialog({
	blockId,
	onSuccess,
}: CreateGraveDialogProps) {
	const [open, setOpen] = useState(false);
	const createGraveMutation = useCreateGrave();

	const handleSubmit = async (data: Omit<Grave, "id">) => {
		try {
			await createGraveMutation.mutateAsync(data);
			toast.success("Grave created successfully");
			setOpen(false);
			onSuccess?.();
		} catch (error) {
			toast.error("Failed to create grave");
			console.error(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm">
					<Plus className="mr-2 h-4 w-4" />
					Add Grave
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Create New Grave</DialogTitle>
					<DialogDescription>
						Fill in the details to create a new grave in this block.
					</DialogDescription>
				</DialogHeader>
				<GraveForm
					blockId={blockId}
					onSubmit={handleSubmit}
					onCancel={() => setOpen(false)}
					isSubmitting={createGraveMutation.isPending}
				/>
			</DialogContent>
		</Dialog>
	);
}
