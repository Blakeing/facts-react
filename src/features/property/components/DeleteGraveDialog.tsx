import { useState } from "react";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import { useDeleteGrave } from "../hooks/usePropertyQueries";
import type { Grave } from "../types";

interface DeleteGraveDialogProps {
	grave: Grave;
	onSuccess?: () => void;
}

export function DeleteGraveDialog({
	grave,
	onSuccess,
}: DeleteGraveDialogProps) {
	const [open, setOpen] = useState(false);
	const deleteGraveMutation = useDeleteGrave();

	const handleDelete = async () => {
		try {
			await deleteGraveMutation.mutateAsync(grave.id);
			toast.success("Grave deleted successfully");
			setOpen(false);
			onSuccess?.();
		} catch (error) {
			toast.error("Failed to delete grave");
			console.error(error);
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button size="sm" variant="ghost" className="text-destructive">
					<Trash2 className="h-4 w-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the grave
						"{grave.name}" and remove its data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						disabled={deleteGraveMutation.isPending}
					>
						{deleteGraveMutation.isPending ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
