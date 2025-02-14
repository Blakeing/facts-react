import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import {
	beneficiaryFormSchema,
	type BeneficiaryFormValues,
} from "./schemas/beneficiary-form";
import { produce } from "immer";

interface BeneficiaryFormProps {
	defaultValues: BeneficiaryFormValues;
	onSubmit: (data: BeneficiaryFormValues) => void;
}

export function BeneficiaryForm({
	defaultValues,
	onSubmit,
}: BeneficiaryFormProps) {
	// Create a mutable copy of defaultValues
	const mutableDefaultValues = useMemo(
		() => produce(defaultValues, (draft) => draft),
		[defaultValues],
	);

	const form = useForm<BeneficiaryFormValues>({
		resolver: zodResolver(beneficiaryFormSchema),
		defaultValues: mutableDefaultValues,
		mode: "onChange",
		reValidateMode: "onChange",
	});

	const { formState } = form;
	const { isDirty, isValid, errors } = formState;

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

	// Create debounced submit handler
	const debouncedSubmit = useDebouncedCallback(
		(data: BeneficiaryFormValues) => {
			if (isValid) {
				onSubmit(data);
			}
		},
		300,
	);

	// Handle form changes
	useEffect(() => {
		const subscription = form.watch((data) => {
			if (data && isValid) {
				debouncedSubmit(data as BeneficiaryFormValues);
			}
		});
		return () => subscription.unsubscribe();
	}, [form, debouncedSubmit, isValid]);

	return (
		<Card className="bg-background">
			<CardContent className="p-6">
				<Form {...form}>
					<form className="space-y-6">
						{/* Name Section */}
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Name</h3>
								<Separator className="flex-1" />
							</div>
							<div className="grid grid-cols-2 gap-6">
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
						</div>

						{/* Identification Section */}
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Identification</h3>
								<Separator className="flex-1" />
							</div>
							<div className="grid grid-cols-2 gap-6">
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
						</div>

						{/* Demographics Section */}
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Demographics</h3>
								<Separator className="flex-1" />
							</div>
							<div className="grid grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="ethnicity"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Ethnicity</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value || ""}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select ethnicity" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="hispanic">Hispanic</SelectItem>
													<SelectItem value="non-hispanic">
														Non-Hispanic
													</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="race"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Race</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value || ""}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select race" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="white">White</SelectItem>
													<SelectItem value="black">Black</SelectItem>
													<SelectItem value="asian">Asian</SelectItem>
													<SelectItem value="native">
														Native American
													</SelectItem>
													<SelectItem value="pacific">
														Pacific Islander
													</SelectItem>
													<SelectItem value="other">Other</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="flex items-center space-x-2">
								<FormField
									control={form.control}
									name="isVeteran"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<FormLabel>Veteran Status</FormLabel>
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Address Section */}
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Address</h3>
								<Separator className="flex-1" />
							</div>
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
								<div className="grid grid-cols-2 gap-6">
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
								</div>
								<div className="grid grid-cols-2 gap-6">
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
									<FormField
										control={form.control}
										name="physicalAddress.country"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Country</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
							<div className="flex items-center space-x-2">
								<FormField
									control={form.control}
									name="mailingAddressSameAsPhysical"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center space-x-3 space-y-0">
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<FormLabel>Mailing Address Same as Physical</FormLabel>
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Contact Information */}
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Contact Information</h3>
								<Separator className="flex-1" />
							</div>
							<div className="space-y-4">
								{phoneFields.map((field, index) => (
									<div key={field.id} className="flex items-end gap-4">
										<FormField
											control={form.control}
											name={`phones.${index}.number`}
											render={({ field }) => (
												<FormItem className="flex-1">
													<FormLabel>Phone Number</FormLabel>
													<FormControl>
														<Input {...field} placeholder="Phone number" />
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
													<FormLabel>Type</FormLabel>
													<Select
														onValueChange={selectField.onChange}
														value={selectField.value}
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
											variant="ghost"
											size="icon"
											onClick={() => removePhone(index)}
										>
											<Trash2Icon className="h-4 w-4" />
										</Button>
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										appendPhone({
											number: "",
											type: "Mobile",
											isPreferred: false,
										})
									}
								>
									Add Phone Number
								</Button>
							</div>
							<div className="space-y-4">
								{emailFields.map((field, index) => (
									<div key={field.id} className="flex items-end gap-4">
										<FormField
											control={form.control}
											name={`emails.${index}.address`}
											render={({ field, fieldState: { error } }) => (
												<FormItem className="flex-1">
													<FormLabel>Email Address</FormLabel>
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
											variant="ghost"
											size="icon"
											onClick={() => removeEmail(index)}
										>
											<Trash2Icon className="h-4 w-4" />
										</Button>
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										appendEmail({
											address: "",
											isPreferred: false,
										})
									}
								>
									Add Email Address
								</Button>
							</div>
						</div>

						{/* Marketing Preferences */}
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Marketing Preferences</h3>
								<Separator className="flex-1" />
							</div>
							<div className="flex items-center space-x-2">
								<FormField
									control={form.control}
									name="optOutOfFutureMarketing"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<FormLabel>Opt Out of Future Marketing</FormLabel>
										</FormItem>
									)}
								/>
							</div>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
