import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
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
import { format } from "date-fns";
import { CalendarIcon, Trash2Icon } from "lucide-react";
import { useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { Path, PathValue } from "react-hook-form";
import type { BeneficiaryData } from "../types/contract";
import {
	beneficiaryFormSchema,
	type BeneficiaryFormValues,
} from "./schemas/beneficiary-form";

interface BeneficiaryFormProps {
	defaultValues: BeneficiaryData;
	onSubmit: (data: BeneficiaryData) => void;
}

export function BeneficiaryForm({
	defaultValues,
	onSubmit,
}: BeneficiaryFormProps) {
	const form = useForm<BeneficiaryFormValues>({
		resolver: zodResolver(beneficiaryFormSchema),
		defaultValues,
		mode: "onTouched",
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

	const handleFieldChange = useCallback(
		<T extends Path<BeneficiaryFormValues>>(
			field: T,
			value: PathValue<BeneficiaryFormValues, T>,
		) => {
			form.setValue(field, value);
			const values = form.getValues();
			const formattedValues: BeneficiaryData = {
				...values,
				name: {
					...values.name,
					prefix: values.name.prefix || undefined,
					middle: values.name.middle || undefined,
					suffix: values.name.suffix || undefined,
					companyName: values.name.companyName || undefined,
					nickname: values.name.nickname || undefined,
					maiden: values.name.maiden || undefined,
					gender: values.name.gender || undefined,
				},
				mailingAddress: values.mailingAddress || undefined,
				role: values.role || undefined,
				ethnicity: values.ethnicity || undefined,
				race: values.race || undefined,
			};
			onSubmit(formattedValues);
		},
		[form, onSubmit],
	);

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
												<Input
													{...field}
													onChange={(e) =>
														handleFieldChange("name.first", e.target.value)
													}
												/>
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
												<Input
													{...field}
													onChange={(e) =>
														handleFieldChange("name.last", e.target.value)
													}
												/>
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
												<Input
													{...field}
													onChange={(e) =>
														handleFieldChange(
															"identification.stateIdNumber",
															e.target.value,
														)
													}
												/>
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
												<Input
													{...field}
													onChange={(e) =>
														handleFieldChange(
															"identification.issuer",
															e.target.value,
														)
													}
												/>
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
												onValueChange={(value) =>
													handleFieldChange("ethnicity", value)
												}
												defaultValue={field.value || undefined}
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
												onValueChange={(value) =>
													handleFieldChange("race", value)
												}
												defaultValue={field.value || undefined}
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
													onCheckedChange={(checked) =>
														handleFieldChange("isVeteran", checked)
													}
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
												<Input
													{...field}
													onChange={(e) =>
														handleFieldChange(
															"physicalAddress.street",
															e.target.value,
														)
													}
												/>
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
													<Input
														{...field}
														onChange={(e) =>
															handleFieldChange(
																"physicalAddress.city",
																e.target.value,
															)
														}
													/>
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
													<Input
														{...field}
														onChange={(e) =>
															handleFieldChange(
																"physicalAddress.state",
																e.target.value,
															)
														}
													/>
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
													<Input
														{...field}
														onChange={(e) =>
															handleFieldChange(
																"physicalAddress.postalCode",
																e.target.value,
															)
														}
													/>
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
													<Input
														{...field}
														onChange={(e) =>
															handleFieldChange(
																"physicalAddress.country",
																e.target.value,
															)
														}
													/>
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
													onCheckedChange={(checked) =>
														handleFieldChange(
															"mailingAddressSameAsPhysical",
															checked,
														)
													}
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
														<Input
															{...field}
															onChange={(e) =>
																handleFieldChange(
																	`phones.${index}.number` as Path<BeneficiaryFormValues>,
																	e.target.value,
																)
															}
														/>
													</FormControl>
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
											render={({ field }) => (
												<FormItem className="flex-1">
													<FormLabel>Email Address</FormLabel>
													<FormControl>
														<Input
															{...field}
															type="email"
															onChange={(e) =>
																handleFieldChange(
																	`emails.${index}.address` as Path<BeneficiaryFormValues>,
																	e.target.value,
																)
															}
														/>
													</FormControl>
													<FormMessage />
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
													onCheckedChange={(checked) =>
														handleFieldChange(
															"optOutOfFutureMarketing",
															checked,
														)
													}
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
