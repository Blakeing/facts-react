import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import type { Grave } from "../types";

// Define the form schema with Zod
const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	blockId: z.number().int("Block ID must be an integer"),
	size: z.string().min(1, "Size is required"),
	price: z.number().min(0, "Price must be a positive number"),
	status: z.enum(["Available", "Reserved", "Sold"]),
	locationNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Type for the form submission that matches Grave without id
type GraveFormSubmission = Omit<Grave, "id">;

interface GraveFormProps {
	grave?: Grave;
	blockId?: number;
	onSubmit: (data: GraveFormSubmission) => void;
	onCancel: () => void;
	isSubmitting: boolean;
}

export function GraveForm({
	grave,
	blockId,
	onSubmit,
	onCancel,
	isSubmitting,
}: GraveFormProps) {
	// Initialize the form with default values or existing grave data
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: grave?.name || "",
			blockId: grave?.blockId || blockId || 0,
			size: grave?.size || "Standard",
			price: grave?.price || 2500,
			status:
				(grave?.status as "Available" | "Reserved" | "Sold") || "Available",
			locationNotes: grave?.locationNotes || "",
		},
	});

	const handleSubmit = (data: FormValues) => {
		onSubmit(data as GraveFormSubmission);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Enter grave name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="blockId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Block ID</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Enter block ID"
									{...field}
									disabled={!!blockId}
									onChange={(e) =>
										field.onChange(Number.parseInt(e.target.value))
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="size"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Size</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select size" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="Standard">Standard</SelectItem>
									<SelectItem value="Large">Large</SelectItem>
									<SelectItem value="Premium">Premium</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="price"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Price</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Enter price"
									{...field}
									onChange={(e) =>
										field.onChange(Number.parseInt(e.target.value))
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="Available">Available</SelectItem>
									<SelectItem value="Reserved">Reserved</SelectItem>
									<SelectItem value="Sold">Sold</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="locationNotes"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Location Notes</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Enter any location notes"
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
						onClick={onCancel}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting
							? "Saving..."
							: grave
								? "Update Grave"
								: "Create Grave"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
