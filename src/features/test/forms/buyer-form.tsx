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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { type BuyerFormValues, buyerFormSchema } from "./schemas/buyer-form";

interface BuyerFormProps {
	defaultValues: BuyerFormValues;
	onSubmit: (data: BuyerFormValues) => void;
}

export interface BuyerFormRef {
	form: ReturnType<typeof useForm<BuyerFormValues>>;
}

export const BuyerForm = forwardRef<BuyerFormRef, BuyerFormProps>(
	({ defaultValues, onSubmit }, ref) => {
		const form = useForm<BuyerFormValues>({
			resolver: zodResolver(buyerFormSchema),
			defaultValues,
			mode: "onSubmit",
			reValidateMode: "onChange",
		});

		useImperativeHandle(ref, () => ({
			form,
		}));

		const {
			formState: { isDirty },
			watch,
		} = form;

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

		// Create debounced submit handler for partial updates
		const debouncedPartialSubmit = useDebouncedCallback(
			(data: BuyerFormValues) => {
				// Clone the data to avoid Immer freeze issues
				const unfrozenData = structuredClone(data);
				onSubmit(unfrozenData);
			},
			300,
		);

		// Watch form values for partial updates
		const values = watch();

		// Effect for partial updates - triggers on any change
		useEffect(() => {
			if (isDirty) {
				debouncedPartialSubmit(values);
			}
		}, [isDirty, values, debouncedPartialSubmit]);

		// Handle final form submission with full validation
		const handleSubmit = form.handleSubmit((data) => {
			const result = buyerFormSchema.safeParse(data);
			if (result.success) {
				onSubmit(result.data);
			}
		});

		return (
			<Form {...form}>
				<form onSubmit={handleSubmit} className="space-y-8">
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
						<h3 className="text-lg font-semibold mb-4">Identification</h3>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="identification.stateIdNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>State ID Number</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="identification.issuer"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Issuer</FormLabel>
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
								<h4 className="text-sm font-medium mb-2">Phone Numbers</h4>
								{phoneFields.map((field, index) => (
									<div key={field.id} className="flex items-start gap-4 mt-2">
										<FormField
											control={form.control}
											name={`phones.${index}.number`}
											render={({ field }) => (
												<FormItem className="flex-1">
													<FormControl>
														<Input {...field} placeholder="Phone number" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`phones.${index}.type`}
											render={({ field }) => (
												<FormItem>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Type" />
															</SelectTrigger>
														</FormControl>
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
								<h4 className="text-sm font-medium mb-2">Email Addresses</h4>
								{emailFields.map((field, index) => (
									<div key={field.id} className="flex items-start gap-4 mt-2">
										<FormField
											control={form.control}
											name={`emails.${index}.address`}
											render={({ field, fieldState: { error } }) => (
												<FormItem className="flex-1">
													<FormControl>
														<Input
															{...field}
															type="email"
															placeholder="Email address"
															onBlur={async () => {
																if (field.value) {
																	field.onBlur();
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
						<h3 className="text-lg font-semibold mb-4">
							Additional Information
						</h3>
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
	},
);

BuyerForm.displayName = "BuyerForm";
