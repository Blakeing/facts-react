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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGeneralForm } from "../hooks/useGeneralForm";
import type { GeneralFormValues } from "../types";

const formSchema = z.object({
	serviceDate: z.string().min(1, "Service date is required"),
	contractSignDate: z.string().min(1, "Contract sign date is required"),
	prePrintedContractNumber: z.string(),
	funeralDirector: z.string().min(1, "Funeral director is required"),
	atNeedType: z.string().min(1, "At-need type is required"),
	contractType: z.string().min(1, "Contract type is required"),
	campaign: z.string(),
});

interface GeneralFormProps {
	defaultValues: Partial<GeneralFormValues>;
	onSubmit: (values: GeneralFormValues) => Promise<void>;
	onReset?: () => void;
	onFieldChange?: () => void;
	mode?: "create" | "edit";
}

export function GeneralForm({
	defaultValues,
	onSubmit,
	onReset,
	onFieldChange,
	mode = "create",
}: GeneralFormProps) {
	const form = useForm<GeneralFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const {
		isDirty,
		isSubmitting,
		handleSubmit: handleStateMachineSubmit,
		handleReset: handleStateMachineReset,
		setInitialData,
	} = useGeneralForm(defaultValues);

	// Reset form when defaultValues change
	useEffect(() => {
		form.reset(defaultValues);
		setInitialData({
			...defaultValues,
			serviceDate: defaultValues.serviceDate || "",
			contractSignDate: defaultValues.contractSignDate || "",
			prePrintedContractNumber: defaultValues.prePrintedContractNumber || "",
			funeralDirector: defaultValues.funeralDirector || "",
			atNeedType: defaultValues.atNeedType || "",
			contractType: defaultValues.contractType || "",
			campaign: defaultValues.campaign || "",
		} as GeneralFormValues);
	}, [defaultValues, form, setInitialData]);

	// Notify parent of field changes
	useEffect(() => {
		if (isDirty) {
			onFieldChange?.();
		}
	}, [isDirty, onFieldChange]);

	const handleFormSubmit = async (data: GeneralFormValues) => {
		await handleStateMachineSubmit(async () => {
			await onSubmit(data);
		});
	};

	const handleFormReset = () => {
		form.reset();
		handleStateMachineReset();
		onReset?.();
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleFormSubmit)}
				className="space-y-6"
			>
				<div className="rounded-md border p-4 space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold">General</h2>
						{mode === "edit" && isDirty && (
							<p className="text-sm text-muted-foreground">
								You have unsaved changes
							</p>
						)}
					</div>

					<FormField
						control={form.control}
						name="serviceDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Service Date*</FormLabel>
								<FormControl>
									<Input type="date" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="contractSignDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contract/Sign Date*</FormLabel>
								<FormControl>
									<Input type="date" {...field} />
								</FormControl>
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
									<Input {...field} />
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
								<FormLabel>Funeral Director*</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select funeral director" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="house">House Account</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="atNeedType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>At-Need Type*</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="pn-maturity">PN Maturity</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="contractType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contract Type*</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="burial-graveside">
												Burial - Graveside
											</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="campaign"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Campaign</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select campaign" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="facebook">Facebook (FB)</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormDescription>Optional marketing campaign</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-end gap-2">
						{mode === "edit" && onReset && (
							<Button
								type="button"
								variant="outline"
								onClick={handleFormReset}
								disabled={isSubmitting || !isDirty}
							>
								Reset Changes
							</Button>
						)}
						<Button
							type="submit"
							disabled={isSubmitting}
							className="min-w-[145px] flex items-center justify-center"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									<span>{mode === "create" ? "Creating..." : "Saving..."}</span>
								</>
							) : (
								<span>
									{mode === "create" ? "Create Contract" : "Save Changes"}
								</span>
							)}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
