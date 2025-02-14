import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { buyerFormSchema, type BuyerFormValues } from "./schemas/buyer-form";

interface BuyerFormProps {
	defaultValues: BuyerFormValues;
	onSubmit: (data: BuyerFormValues) => void;
}

export function BuyerForm({ defaultValues, onSubmit }: BuyerFormProps) {
	const form = useForm<BuyerFormValues>({
		resolver: zodResolver(buyerFormSchema),
		defaultValues,
		mode: "onChange",
		reValidateMode: "onChange",
	});

	// Create debounced submit handler
	const debouncedSubmit = useDebouncedCallback(onSubmit, 300);

	const { formState } = form;
	const { isDirty, isValid, errors } = formState;

	// Watch all form values and validate with schema
	const formValues = useWatch({
		control: form.control,
	});

	const {
		fields: phoneFields,
		append: appendPhone,
		remove: removePhone,
	} = useFieldArray({
		control: form.control,
		name: "phones",
	});

	const {
		fields: emailFields,
		append: appendEmail,
		remove: removeEmail,
	} = useFieldArray({
		control: form.control,
		name: "emails",
	});

	// Log form state changes
	useEffect(() => {
		console.log("Buyer Form State:", {
			isDirty,
			isValid,
			errors,
			currentValues: form.getValues(),
		});
	}, [isDirty, isValid, errors, form]);

	// Sync form changes with XState using debounced submit
	useEffect(() => {
		if (isDirty && isValid) {
			const data = form.getValues();
			console.log("Buyer Form Submitting:", data);
			debouncedSubmit(data);
		} else {
			console.log("Buyer Form Not Submitting:", {
				isDirty,
				isValid,
				hasErrors: Object.keys(errors).length > 0,
			});
		}
	}, [isDirty, isValid, debouncedSubmit, form, errors]);

	return (
		<Form {...form}>
			<form
				className="space-y-8"
				onChange={() => {
					console.log("Buyer Form onChange triggered");
					form.trigger();
				}}
			>
				<Card className="p-6">
					<h3 className="text-lg font-semibold mb-4">Personal Information</h3>
					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="name.first"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="name.last"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</Card>

				<Card className="p-6">
					<h3 className="text-lg font-semibold mb-4">Physical Address</h3>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="physicalAddress.street"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Street Address</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="physicalAddress.city"
							render={({ field }) => (
								<FormItem>
									<FormLabel>City</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="physicalAddress.state"
							render={({ field }) => (
								<FormItem>
									<FormLabel>State</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="physicalAddress.postalCode"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Postal Code</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</Card>

				<Card className="p-6">
					<h3 className="text-lg font-semibold mb-4">Contact Information</h3>
					<div className="space-y-6">
						<div>
							<Label>Phone Numbers</Label>
							{phoneFields.map((field, index) => (
								<div key={field.id} className="flex items-start gap-4 mt-2">
									<Controller
										control={form.control}
										name={`phones.${index}.number`}
										render={({ field: inputField }) => (
											<FormItem>
												<FormControl>
													<Input {...inputField} placeholder="Phone number" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Controller
										control={form.control}
										name={`phones.${index}.type`}
										render={({ field: selectField }) => (
											<FormItem>
												<Select
													onValueChange={selectField.onChange}
													value={selectField.value}
												>
													<SelectTrigger>
														<SelectValue placeholder="Type" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="Mobile">Mobile</SelectItem>
														<SelectItem value="Home">Home</SelectItem>
														<SelectItem value="Work">Work</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button
										type="button"
										variant="destructive"
										onClick={() => removePhone(index)}
									>
										Remove
									</Button>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									appendPhone({
										number: "",
										type: "Mobile",
										isPreferred: false,
									});
								}}
								className="mt-2"
							>
								Add Phone
							</Button>
						</div>

						<div>
							<Label>Email Addresses</Label>
							{emailFields.map((field, index) => (
								<div key={field.id} className="flex items-start gap-4 mt-2">
									<Controller
										control={form.control}
										name={`emails.${index}.address`}
										render={({ field: inputField, fieldState: { error } }) => (
											<FormItem className="flex-1">
												<FormControl>
													<Input
														{...inputField}
														type="email"
														placeholder="Email address"
														onBlur={async () => {
															if (inputField.value) {
																inputField.onBlur();
																await form.trigger(`emails.${index}.address`);
															}
														}}
														className={error ? "border-red-500" : ""}
													/>
												</FormControl>
												{error && <FormMessage>{error.message}</FormMessage>}
											</FormItem>
										)}
									/>
									<Button
										type="button"
										variant="destructive"
										onClick={() => removeEmail(index)}
									>
										Remove
									</Button>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									appendEmail({ address: "", isPreferred: false });
								}}
								className="mt-2"
							>
								Add Email
							</Button>
						</div>
					</div>
				</Card>

				<Card className="p-6">
					<h3 className="text-lg font-semibold mb-4">Additional Information</h3>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="optOutOfFutureMarketing"
							render={({ field }) => (
								<FormItem className="flex items-center gap-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel>Opt out of future marketing</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</Card>
			</form>
		</Form>
	);
}
