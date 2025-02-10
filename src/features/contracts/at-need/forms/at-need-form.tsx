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
	contractNumber: z.string().optional(),
	prePrintedContractNumber: z
		.string()
		.min(1, "Pre-printed contract number is required"),
	date: z.string().min(1, "Date is required"),
	deceased: z.string().min(1, "Deceased name is required"),
	dateOfDeath: z.string().min(1, "Date of death is required"),
	purchaser: z.string().min(1, "Purchaser name is required"),
	funeralDirector: z.string().min(1, "Funeral director is required"),
	status: z.enum(["Active", "Pending", "Completed", "Cancelled"]),
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
			contractNumber: "",
			prePrintedContractNumber: "",
			date: "",
			deceased: "",
			dateOfDeath: "",
			purchaser: "",
			funeralDirector: "",
			status: "Active",
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="contractNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Contract #</FormLabel>
							<FormControl>
								<Input placeholder="2742-0001426" {...field} />
							</FormControl>
							<FormDescription>
								System generated contract number
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="prePrintedContractNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Pre-Printed Contract #</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter pre-printed contract number"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="date"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Date</FormLabel>
							<FormControl>
								<Input type="date" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="deceased"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Deceased</FormLabel>
							<FormControl>
								<Input placeholder="Enter deceased name" {...field} />
							</FormControl>
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
					name="purchaser"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Purchaser</FormLabel>
							<FormControl>
								<Input placeholder="Enter purchaser name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="funeralDirector"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Funeral Director</FormLabel>
							<FormControl>
								<Input placeholder="Enter funeral director name" {...field} />
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
									<SelectItem value="Active">Active</SelectItem>
									<SelectItem value="Pending">Pending</SelectItem>
									<SelectItem value="Completed">Completed</SelectItem>
									<SelectItem value="Cancelled">Cancelled</SelectItem>
								</SelectContent>
							</Select>
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
