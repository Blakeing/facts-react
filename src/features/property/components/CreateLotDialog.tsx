import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useCreateLot } from "../hooks/usePropertyQueries";
import type { Lot } from "../types";

// Define the form schema with Zod
const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	sectionId: z.number().int("Section ID must be an integer"),
	description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateLotDialogProps {
	sectionId: number;
	onSuccess?: () => void;
	trigger?: React.ReactNode;
}

export function CreateLotDialog({
	sectionId,
	onSuccess,
	trigger,
}: CreateLotDialogProps) {
	const [open, setOpen] = useState(false);
	const createLotMutation = useCreateLot();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			sectionId: sectionId,
			description: "",
		},
	});

	const handleSubmit = async (data: FormValues) => {
		try {
			await createLotMutation.mutateAsync({
				name: data.name,
				sectionId: data.sectionId,
				description: data.description || "",
			});
			toast.success("Lot created successfully");
			setOpen(false);
			form.reset();
			onSuccess?.();
		} catch (error) {
			toast.error("Failed to create lot");
			console.error(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button size="sm">
						<Plus className="mr-2 h-4 w-4" />
						Add Lot
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Create New Lot</DialogTitle>
					<DialogDescription>
						Fill in the details to create a new lot in this section.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter lot name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="sectionId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Section ID</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter section ID"
											{...field}
											disabled={!!sectionId}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter lot description"
											className="resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end space-x-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
								disabled={createLotMutation.isPending}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={createLotMutation.isPending}>
								{createLotMutation.isPending ? "Creating..." : "Create Lot"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
