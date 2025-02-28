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

import { useCreateSection } from "../hooks/usePropertyQueries";
import type { Section } from "../types";

// Define the form schema with Zod
const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	propertyId: z.number().int("Property ID must be an integer"),
	description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateSectionDialogProps {
	propertyId: number;
	onSuccess?: () => void;
	trigger?: React.ReactNode;
}

export function CreateSectionDialog({
	propertyId,
	onSuccess,
	trigger,
}: CreateSectionDialogProps) {
	const [open, setOpen] = useState(false);
	const createSectionMutation = useCreateSection();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			propertyId: propertyId,
			description: "",
		},
	});

	const handleSubmit = async (data: FormValues) => {
		try {
			await createSectionMutation.mutateAsync({
				name: data.name,
				propertyId: data.propertyId,
				description: data.description || "",
			});
			toast.success("Section created successfully");
			setOpen(false);
			form.reset();
			onSuccess?.();
		} catch (error) {
			toast.error("Failed to create section");
			console.error(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button size="sm">
						<Plus className="mr-2 h-4 w-4" />
						Add Section
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Create New Section</DialogTitle>
					<DialogDescription>
						Fill in the details to create a new section in this property.
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
										<Input placeholder="Enter section name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="propertyId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Property ID</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter property ID"
											{...field}
											disabled={!!propertyId}
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
											placeholder="Enter section description"
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
								disabled={createSectionMutation.isPending}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={createSectionMutation.isPending}>
								{createSectionMutation.isPending
									? "Creating..."
									: "Create Section"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
