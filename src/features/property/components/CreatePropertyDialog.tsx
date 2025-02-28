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

import { useCreateProperty } from "../hooks/usePropertyQueries";
import type { Property } from "../types";

// Define the form schema with Zod
const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	location: z.string().min(1, "Location is required"),
	description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreatePropertyDialogProps {
	onSuccess?: () => void;
	trigger?: React.ReactNode;
}

export function CreatePropertyDialog({
	onSuccess,
	trigger,
}: CreatePropertyDialogProps) {
	const [open, setOpen] = useState(false);
	const createPropertyMutation = useCreateProperty();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			location: "",
			description: "",
		},
	});

	const handleSubmit = async (data: FormValues) => {
		try {
			await createPropertyMutation.mutateAsync({
				name: data.name,
				location: data.location,
				description: data.description || "",
			});
			toast.success("Property created successfully");
			setOpen(false);
			form.reset();
			onSuccess?.();
		} catch (error) {
			toast.error("Failed to create property");
			console.error(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button size="sm">
						<Plus className="mr-2 h-4 w-4" />
						Add Property
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Create New Property</DialogTitle>
					<DialogDescription>
						Fill in the details to create a new property.
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
										<Input placeholder="Enter property name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<FormControl>
										<Input placeholder="Enter property location" {...field} />
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
											placeholder="Enter property description"
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
								disabled={createPropertyMutation.isPending}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={createPropertyMutation.isPending}>
								{createPropertyMutation.isPending
									? "Creating..."
									: "Create Property"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
