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
import { useCallback, useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import type { Path, PathValue } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import type { BuyerData } from "../types/buyer";
import { type BuyerFormValues, buyerFormSchema } from "./schemas/buyer-form";

interface BuyerFormProps {
	defaultValues: BuyerFormValues;
	onSubmit: (data: BuyerFormValues) => void;
}

export const BuyerForm = ({ defaultValues, onSubmit }: BuyerFormProps) => {
	const form = useForm<BuyerFormValues>({
		resolver: zodResolver(buyerFormSchema),
		defaultValues: {
			...defaultValues,
			phones: defaultValues.phones.map((phone) => ({ ...phone })),
			emails: defaultValues.emails.map((email) => ({ ...email })),
		},
		mode: "all",
		reValidateMode: "onChange",
	});

	// Create debounced submit handler
	const debouncedSubmit = useDebouncedCallback((data: BuyerData) => {
		onSubmit(data);
	}, 300);

	// Watch all form values
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

	const handleFieldChange = useCallback(
		<T extends Path<BuyerFormValues>>(
			field: T,
			value: PathValue<BuyerFormValues, T>,
		) => {
			form.setValue(field, value, {
				shouldTouch: true,
				shouldDirty: true,
			});
		},
		[form],
	);

	// Sync form changes with XState using debounced submit
	useEffect(() => {
		if (!formValues) return;

		const formattedValues: BuyerData = {
			...formValues,
			name: {
				first: formValues.name?.first || "",
				last: formValues.name?.last || "",
				prefix: formValues.name?.prefix || undefined,
				middle: formValues.name?.middle || undefined,
				suffix: formValues.name?.suffix || undefined,
				companyName: formValues.name?.companyName || undefined,
				nickname: formValues.name?.nickname || undefined,
				maiden: formValues.name?.maiden || undefined,
				gender: formValues.name?.gender || undefined,
			},
			dates: {
				dateOfBirth: formValues.dates?.dateOfBirth || undefined,
				dateOfDeath: formValues.dates?.dateOfDeath || undefined,
				isDeceased: formValues.dates?.isDeceased || false,
			},
			physicalAddress: {
				street: formValues.physicalAddress?.street || "",
				city: formValues.physicalAddress?.city || "",
				state: formValues.physicalAddress?.state || "",
				postalCode: formValues.physicalAddress?.postalCode || "",
				country: formValues.physicalAddress?.country || "",
			},
			mailingAddress: formValues.mailingAddress
				? {
						street: formValues.mailingAddress.street || "",
						city: formValues.mailingAddress.city || "",
						state: formValues.mailingAddress.state || "",
						postalCode: formValues.mailingAddress.postalCode || "",
						country: formValues.mailingAddress.country || "",
					}
				: undefined,
			role: formValues.role || undefined,
			ethnicity: formValues.ethnicity || undefined,
			race: formValues.race || undefined,
			phones: (formValues.phones || []).map((phone) => ({
				number: phone.number || "",
				type: phone.type || "Mobile",
				isPreferred: phone.isPreferred || false,
			})),
			emails: (formValues.emails || []).map((email) => ({
				address: email.address || "",
				isPreferred: email.isPreferred || false,
			})),
			optOutOfFutureMarketing: formValues.optOutOfFutureMarketing || false,
			mailingAddressSameAsPhysical:
				formValues.mailingAddressSameAsPhysical || false,
			identification: {
				stateIdNumber: formValues.identification?.stateIdNumber || "",
				issuer: formValues.identification?.issuer || "",
			},
			isVeteran: formValues.isVeteran || false,
		};
		debouncedSubmit(formattedValues);
	}, [formValues, debouncedSubmit]);

	const handleSubmit = useCallback(
		(values: BuyerFormValues) => {
			const formattedValues: BuyerData = {
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
				dates: {
					...values.dates,
					dateOfBirth: values.dates.dateOfBirth || undefined,
					dateOfDeath: values.dates.dateOfDeath || undefined,
				},
				mailingAddress: values.mailingAddress || undefined,
				role: values.role || undefined,
				ethnicity: values.ethnicity || undefined,
				race: values.race || undefined,
			};
			onSubmit(formattedValues);
		},
		[onSubmit],
	);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
				</Card>

				<Card className="p-6">
					<h3 className="text-lg font-semibold mb-4">Contact Information</h3>
					<div className="space-y-6">
						<div>
							<Label>Phone Numbers</Label>
							{phoneFields.map((field, index) => (
								<div key={field.id} className="flex items-start  gap-4 mt-2">
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
															inputField.onBlur();
															await form.trigger(`emails.${index}.address`);
														}}
														onChange={(e) => {
															inputField.onChange(e);
															form.trigger(`emails.${index}.address`);
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
											onCheckedChange={(checked) =>
												handleFieldChange("optOutOfFutureMarketing", !!checked)
											}
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
};
