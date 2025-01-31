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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	customerName: z.string().min(1, "Customer name is required"),
	totalAmount: z.coerce.number().min(0, "Total amount must be positive"),
	monthlyPayment: z.coerce.number().min(0, "Monthly payment must be positive"),
	nextPaymentDate: z.string().min(1, "Next payment date is required"),
});

export type PreNeedFormValues = z.infer<typeof formSchema>;

interface PreNeedFormProps {
	onSubmit: (values: PreNeedFormValues) => Promise<void>;
	isSubmitting?: boolean;
}

export function PreNeedForm({ onSubmit, isSubmitting }: PreNeedFormProps) {
	const form = useForm<PreNeedFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			customerName: "",
			totalAmount: 0,
			monthlyPayment: 0,
			nextPaymentDate: "",
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="customerName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Customer Name</FormLabel>
							<FormControl>
								<Input placeholder="John Doe" {...field} />
							</FormControl>
							<FormDescription>
								Enter the full name of the customer
							</FormDescription>
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
				<FormField
					control={form.control}
					name="monthlyPayment"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Monthly Payment</FormLabel>
							<FormControl>
								<Input type="number" placeholder="500" {...field} />
							</FormControl>
							<FormDescription>
								Enter the monthly payment amount
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="nextPaymentDate"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Next Payment Date</FormLabel>
							<FormControl>
								<Input type="date" {...field} />
							</FormControl>
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
