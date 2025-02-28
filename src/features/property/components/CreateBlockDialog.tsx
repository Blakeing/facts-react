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

import { useCreateBlock } from "../hooks/usePropertyQueries";
import type { Block } from "../types";

// Define the form schema with Zod
const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	lotId: z.number().int("Lot ID must be an integer"),
	description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateBlockDialogProps {
	lotId: number;
	onSuccess?: () => void;
	trigger?: React.ReactNode;
}

export function CreateBlockDialog({
	lotId,
	onSuccess,
	trigger,
}: CreateBlockDialogProps) {
	const [open, setOpen] = useState(false);
	const createBlockMutation = useCreateBlock();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			lotId: lotId,
			description: "",
		},
	});

	const handleSubmit = async (data: FormValues) => {
		try {
			await createBlockMutation.mutateAsync({
				name: data.name,
				lotId: data.lotId,
				description: data.description || "",
			});
			toast.success("Block created successfully");
			setOpen(false);
			form.reset();
			onSuccess?.();
		} catch (error) {
			toast.error("Failed to create block");
			console.error(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button size="sm">
						<Plus className="mr-2 h-4 w-4" />
						Add Block
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Create New Block</DialogTitle>
					<DialogDescription>
						Fill in the details to create a new block in this lot.
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
										<Input placeholder="Enter block name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="lotId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Lot ID</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter lot ID"
											{...field}
											disabled={!!lotId}
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
											placeholder="Enter block description"
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
								disabled={createBlockMutation.isPending}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={createBlockMutation.isPending}>
								{createBlockMutation.isPending ? "Creating..." : "Create Block"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
