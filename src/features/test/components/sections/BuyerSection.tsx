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
import { useSelector } from "@xstate/react";
import { format } from "date-fns";
import { CalendarIcon, Trash2Icon } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { Path, PathValue } from "react-hook-form";
import type { ActorRefFrom } from "xstate";
import * as z from "zod";
import type { BuyerData } from "../../machines/buyerMachine";
import type createContractMachine from "../../machines/contractMachine";

const nameSchema = z.object({
	first: z.string().min(1, "First name is required"),
	last: z.string().min(1, "Last name is required"),
	prefix: z.string().optional(),
	middle: z.string().optional(),
	suffix: z.string().optional(),
	companyName: z.string().optional(),
	nickname: z.string().optional(),
	maiden: z.string().optional(),
	gender: z.string().optional(),
});

const addressSchema = z.object({
	street: z.string().min(1, "Street address is required"),
	city: z.string().min(1, "City is required"),
	state: z.string().min(1, "State is required"),
	postalCode: z.string().min(1, "Postal code is required"),
	country: z.string().min(1, "Country is required"),
});

const identificationSchema = z.object({
	stateIdNumber: z.string().min(1, "State ID number is required"),
	issuer: z.string().min(1, "Issuer is required"),
});

const datesSchema = z.object({
	dateOfBirth: z.string().optional(),
	dateOfDeath: z.string().optional(),
	isDeceased: z.boolean(),
});

const phoneSchema = z.object({
	number: z.string().min(1, "Phone number is required"),
	type: z.string().min(1, "Phone type is required"),
	isPreferred: z.boolean(),
});

const emailSchema = z.object({
	address: z.string().email("Invalid email address"),
	isPreferred: z.boolean(),
});

const buyerFormSchema = z.object({
	name: nameSchema,
	physicalAddress: addressSchema,
	mailingAddressSameAsPhysical: z.boolean(),
	mailingAddress: addressSchema.optional(),
	identification: identificationSchema,
	dates: datesSchema,
	role: z.string().optional(),
	ethnicity: z.string().optional(),
	race: z.string().optional(),
	isVeteran: z.boolean(),
	phones: z.array(phoneSchema).min(1, "At least one phone number is required"),
	emails: z.array(emailSchema).min(1, "At least one email is required"),
	optOutOfFutureMarketing: z.boolean(),
});

type BuyerFormValues = z.infer<typeof buyerFormSchema>;

type ContractActor = ActorRefFrom<ReturnType<typeof createContractMachine>>;

interface BuyerSectionProps {
	actor: ContractActor;
}

const buyerDataSelector = (state: {
	context: { formData: { buyer: BuyerData | null } };
}) =>
	state.context.formData.buyer || {
		name: {
			first: "",
			last: "",
		},
		physicalAddress: {
			street: "",
			city: "",
			state: "",
			postalCode: "",
			country: "United States",
		},
		mailingAddressSameAsPhysical: true,
		identification: {
			stateIdNumber: "",
			issuer: "",
		},
		dates: {
			isDeceased: false,
		},
		isVeteran: false,
		phones: [{ number: "", type: "Mobile", isPreferred: true }],
		emails: [{ address: "", isPreferred: true }],
		optOutOfFutureMarketing: false,
	};

const BuyerSection = ({ actor }: BuyerSectionProps) => {
	const send = actor.send;
	const formData = useSelector(actor, buyerDataSelector);

	const form = useForm<BuyerFormValues>({
		resolver: zodResolver(buyerFormSchema),
		defaultValues: formData,
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
		<T extends Path<BuyerFormValues>>(
			field: T,
			value: PathValue<BuyerFormValues, T>,
		) => {
			form.setValue(field, value);
			const values = form.getValues();
			const formattedValues: BuyerData = {
				name: {
					first: values.name.first,
					last: values.name.last,
					prefix: values.name.prefix || undefined,
					middle: values.name.middle || undefined,
					suffix: values.name.suffix || undefined,
					companyName: values.name.companyName || undefined,
					nickname: values.name.nickname || undefined,
					maiden: values.name.maiden || undefined,
					gender: values.name.gender || undefined,
				},
				physicalAddress: {
					street: values.physicalAddress.street,
					city: values.physicalAddress.city,
					state: values.physicalAddress.state,
					postalCode: values.physicalAddress.postalCode,
					country: values.physicalAddress.country,
				},
				mailingAddressSameAsPhysical: values.mailingAddressSameAsPhysical,
				mailingAddress: values.mailingAddress || undefined,
				identification: {
					stateIdNumber: values.identification.stateIdNumber,
					issuer: values.identification.issuer,
				},
				dates: {
					dateOfBirth: values.dates.dateOfBirth || undefined,
					dateOfDeath: values.dates.dateOfDeath || undefined,
					isDeceased: values.dates.isDeceased,
				},
				role: values.role || undefined,
				ethnicity: values.ethnicity || undefined,
				race: values.race || undefined,
				isVeteran: values.isVeteran,
				phones: values.phones.map((phone) => ({
					number: phone.number,
					type: phone.type,
					isPreferred: phone.isPreferred,
				})),
				emails: values.emails.map((email) => ({
					address: email.address,
					isPreferred: email.isPreferred,
				})),
				optOutOfFutureMarketing: values.optOutOfFutureMarketing,
			};
			send({
				type: "UPDATE_BUYER",
				data: formattedValues,
			});
		},
		[form, send],
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
							<div className="space-y-6">
								<div className="grid grid-cols-2 gap-6">
									<FormField
										control={form.control}
										name="name.companyName"
										render={({ field }) => (
											<FormItem className="col-span-2">
												<FormLabel>Company Name</FormLabel>
												<FormControl>
													<Input
														{...field}
														onChange={(e) =>
															handleFieldChange(
																"name.companyName",
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
								<div className="grid grid-cols-6 gap-6">
									<FormField
										control={form.control}
										name="name.prefix"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Prefix</FormLabel>
												<Select
													onValueChange={(value: string) =>
														handleFieldChange("name.prefix", value || undefined)
													}
													value={field.value || ""}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Prefix" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="Mr">Mr.</SelectItem>
														<SelectItem value="Mrs">Mrs.</SelectItem>
														<SelectItem value="Ms">Ms.</SelectItem>
														<SelectItem value="Dr">Dr.</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="name.first"
										render={({ field }) => (
											<FormItem className="col-span-2">
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
										name="name.middle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Middle Name</FormLabel>
												<FormControl>
													<Input
														{...field}
														onChange={(e) =>
															handleFieldChange("name.middle", e.target.value)
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
											<FormItem className="col-span-2">
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
								<div className="grid grid-cols-3 gap-6">
									<FormField
										control={form.control}
										name="name.nickname"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Nickname</FormLabel>
												<FormControl>
													<Input
														{...field}
														onChange={(e) =>
															handleFieldChange("name.nickname", e.target.value)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="name.maiden"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Maiden Name</FormLabel>
												<FormControl>
													<Input
														{...field}
														onChange={(e) =>
															handleFieldChange("name.maiden", e.target.value)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="name.gender"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Gender</FormLabel>
												<Select
													onValueChange={(value: string) =>
														handleFieldChange("name.gender", value || undefined)
													}
													value={field.value || ""}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select gender" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="male">Male</SelectItem>
														<SelectItem value="female">Female</SelectItem>
														<SelectItem value="other">Other</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>

						<Separator />

						{/* Physical Address Section */}
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Physical Address</h3>
								<Separator className="flex-1" />
							</div>
							<div className="space-y-6">
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
								<div className="grid grid-cols-4 gap-6">
									<FormField
										control={form.control}
										name="physicalAddress.city"
										render={({ field }) => (
											<FormItem className="col-span-2">
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
												<Select
													onValueChange={(value: string) =>
														handleFieldChange("physicalAddress.state", value)
													}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="State" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="CA">California</SelectItem>
														<SelectItem value="NY">New York</SelectItem>
														<SelectItem value="TX">Texas</SelectItem>
													</SelectContent>
												</Select>
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
								</div>
								<FormField
									control={form.control}
									name="physicalAddress.country"
									render={({ field }) => (
										<FormItem className="max-w-[50%]">
											<FormLabel>Country</FormLabel>
											<Select
												onValueChange={(value: string) =>
													handleFieldChange("physicalAddress.country", value)
												}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select country" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="United States">
														United States
													</SelectItem>
													<SelectItem value="Canada">Canada</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<Separator />

						{/* Mailing Address Section */}
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Mailing Address</h3>
								<Separator className="flex-1" />
							</div>
							<FormField
								control={form.control}
								name="mailingAddressSameAsPhysical"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center gap-2">
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={(checked) =>
													handleFieldChange(
														"mailingAddressSameAsPhysical",
														Boolean(checked),
													)
												}
											/>
										</FormControl>
										<FormLabel className="!mt-0 font-normal">
											Same as physical address
										</FormLabel>
									</FormItem>
								)}
							/>
						</div>

						{/* Identification Section */}
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Identification</h3>
								<Separator className="flex-1" />
							</div>
							<div className="space-y-6">
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
												<Select
													onValueChange={(value: string) =>
														handleFieldChange("identification.issuer", value)
													}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select issuer" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="CA">California</SelectItem>
														<SelectItem value="NY">New York</SelectItem>
														<SelectItem value="TX">Texas</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>

						{/* Dates Section */}
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Dates</h3>
								<Separator className="flex-1" />
							</div>
							<div className="space-y-6">
								<div className="grid grid-cols-2 gap-6">
									<FormField
										control={form.control}
										name="dates.dateOfBirth"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Date of Birth</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant="outline"
																className="w-full pl-3 text-left font-normal"
															>
																{field.value ? (
																	format(new Date(field.value), "PPP")
																) : (
																	<span>Pick a date</span>
																)}
																<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<Calendar
															mode="single"
															selected={
																field.value ? new Date(field.value) : undefined
															}
															onSelect={(date) =>
																handleFieldChange(
																	"dates.dateOfBirth",
																	date?.toISOString(),
																)
															}
															disabled={(date) =>
																date > new Date() ||
																date < new Date("1900-01-01")
															}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="dates.dateOfDeath"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Date of Death</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant="outline"
																className="w-full pl-3 text-left font-normal"
																disabled={!form.getValues("dates.isDeceased")}
															>
																{field.value ? (
																	format(new Date(field.value), "PPP")
																) : (
																	<span>Pick a date</span>
																)}
																<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<Calendar
															mode="single"
															selected={
																field.value ? new Date(field.value) : undefined
															}
															onSelect={(date) =>
																handleFieldChange(
																	"dates.dateOfDeath",
																	date?.toISOString(),
																)
															}
															disabled={(date) =>
																date > new Date() ||
																date < new Date("1900-01-01")
															}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="dates.isDeceased"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center space-x-2">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={(
														checked: boolean | "indeterminate",
													) => handleFieldChange("dates.isDeceased", !!checked)}
												/>
											</FormControl>
											<FormLabel className="!mt-0">Deceased</FormLabel>
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Roles Section */}
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Roles</h3>
								<Separator className="flex-1" />
							</div>
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role</FormLabel>
										<Select
											onValueChange={(value: string) =>
												handleFieldChange("role", value || undefined)
											}
											value={field.value || ""}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select role" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="primary">Primary</SelectItem>
												<SelectItem value="secondary">Secondary</SelectItem>
												<SelectItem value="beneficiary">Beneficiary</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Demographic Section */}
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Demographic</h3>
								<Separator className="flex-1" />
							</div>
							<div className="space-y-6">
								<div className="grid grid-cols-2 gap-6">
									<FormField
										control={form.control}
										name="ethnicity"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Ethnicity</FormLabel>
												<Select
													onValueChange={(value: string) =>
														handleFieldChange("ethnicity", value || undefined)
													}
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
													onValueChange={(value: string) =>
														handleFieldChange("race", value || undefined)
													}
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
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>

						{/* Military Section */}
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Military</h3>
								<Separator className="flex-1" />
							</div>
							<FormField
								control={form.control}
								name="isVeteran"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center space-x-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={(checked: boolean | "indeterminate") =>
													handleFieldChange("isVeteran", !!checked)
												}
											/>
										</FormControl>
										<FormLabel className="!mt-0">Veteran</FormLabel>
									</FormItem>
								)}
							/>
						</div>

						{/* Phone Section */}
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Phone</h3>
								<Separator className="flex-1" />
							</div>
							{phoneFields.map((field, index) => (
								<div
									key={field.id}
									className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-end"
								>
									<FormField
										control={form.control}
										name={`phones.${index}.number`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Number</FormLabel>
												<FormControl>
													<Input
														{...field}
														onChange={(e) =>
															handleFieldChange(
																`phones.${index}.number`,
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
										name={`phones.${index}.type`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Type</FormLabel>
												<Select
													onValueChange={(value: string) =>
														handleFieldChange(`phones.${index}.type`, value)
													}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select type" />
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
									<FormField
										control={form.control}
										name={`phones.${index}.isPreferred`}
										render={({ field }) => (
											<FormItem className="flex flex-row items-center space-x-2">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={(
															checked: boolean | "indeterminate",
														) =>
															handleFieldChange(
																`phones.${index}.isPreferred`,
																!!checked,
															)
														}
													/>
												</FormControl>
												<FormLabel className="!mt-0">Preferred</FormLabel>
											</FormItem>
										)}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="text-destructive"
										onClick={() => {
											removePhone(index);
											handleFieldChange(
												"phones",
												form.getValues("phones").filter((_, i) => i !== index),
											);
										}}
									>
										<Trash2Icon className="h-4 w-4" />
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
									const newPhones = form.getValues("phones");
									handleFieldChange("phones", newPhones);
								}}
							>
								Add Phone
							</Button>
						</div>

						{/* Email Section */}
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Email</h3>
								<Separator className="flex-1" />
							</div>
							{emailFields.map((field, index) => (
								<div
									key={field.id}
									className="grid grid-cols-[1fr_auto_auto] gap-4 items-end"
								>
									<FormField
										control={form.control}
										name={`emails.${index}.address`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email Address</FormLabel>
												<FormControl>
													<Input
														{...field}
														type="email"
														onChange={(e) =>
															handleFieldChange(
																`emails.${index}.address`,
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
										name={`emails.${index}.isPreferred`}
										render={({ field }) => (
											<FormItem className="flex flex-row items-center space-x-2">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={(
															checked: boolean | "indeterminate",
														) =>
															handleFieldChange(
																`emails.${index}.isPreferred`,
																!!checked,
															)
														}
													/>
												</FormControl>
												<FormLabel className="!mt-0">Preferred</FormLabel>
											</FormItem>
										)}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="text-destructive"
										onClick={() => {
											removeEmail(index);
											handleFieldChange(
												"emails",
												form.getValues("emails").filter((_, i) => i !== index),
											);
										}}
									>
										<Trash2Icon className="h-4 w-4" />
									</Button>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									appendEmail({ address: "", isPreferred: false });
									const newEmails = form.getValues("emails");
									handleFieldChange("emails", newEmails);
								}}
							>
								Add Email
							</Button>
						</div>

						{/* Marketing Section */}
						<div className="space-y-6">
							<div className="flex items-center gap-2">
								<h3 className="text-lg font-semibold">Marketing</h3>
								<Separator className="flex-1" />
							</div>
							<FormField
								control={form.control}
								name="optOutOfFutureMarketing"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center space-x-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={(checked: boolean | "indeterminate") =>
													handleFieldChange(
														"optOutOfFutureMarketing",
														!!checked,
													)
												}
											/>
										</FormControl>
										<FormLabel className="!mt-0">
											Opt out of Future Marketing
										</FormLabel>
									</FormItem>
								)}
							/>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

BuyerSection.displayName = "BuyerSection";

export default BuyerSection;
