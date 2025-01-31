import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	deceasedName: z.string().min(1, "Deceased name is required"),
	dateOfDeath: z.string().min(1, "Date of death is required"),
	totalAmount: z.coerce.number().min(0, "Total amount must be positive"),
});

export type AtNeedFormValues = z.infer<typeof formSchema>;

interface AtNeedFormProps {
	onSubmit: (values: AtNeedFormValues) => Promise<void>;
	isSubmitting?: boolean;
}

export function AtNeedForm({ onSubmit, isSubmitting }: AtNeedFormProps) {
	const form = useForm<AtNeedFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			deceasedName: "",
			dateOfDeath: "",
			totalAmount: 0,
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="deceasedName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Deceased Name</FormLabel>
							<FormControl>
								<Input placeholder="John Doe" {...field} />
							</FormControl>
							<FormDescription>
								Enter the full name of the deceased
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="dateOfDeath"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Date of Death</FormLabel>
							<FormControl>
								<Input type="date" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="totalAmount"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Total Amount</FormLabel>
							<FormControl>
								<Input type="number" placeholder="5000" {...field} />
							</FormControl>
							<FormDescription>Enter the total contract amount</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Creating..." : "Create Contract"}
				</Button>
			</form>
		</Form>
	);
}
