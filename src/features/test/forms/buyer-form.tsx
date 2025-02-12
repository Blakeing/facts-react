import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { buyerFormSchema, type BuyerFormValues } from "./schemas/buyer-form";
import { useCallback } from "react";
import type { Path, PathValue } from "react-hook-form";
import type { BuyerData } from "../machines/buyerMachine";

interface BuyerFormProps {
	defaultValues: BuyerFormValues;
	onSubmit: (data: BuyerFormValues) => void;
}

export const BuyerForm = ({ defaultValues, onSubmit }: BuyerFormProps) => {
	const form = useForm<BuyerFormValues>({
		resolver: zodResolver(buyerFormSchema),
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
		<T extends Path<BuyerFormValues>>(
			field: T,
			value: PathValue<BuyerFormValues, T>,
		) => {
			form.setValue(field, value);
			const values = form.getValues();
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
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
								<div key={field.id} className="flex items-end gap-4 mt-2">
									<FormField
										control={form.control}
										name={`phones.${index}.number`}
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														{...field}
														placeholder="Phone number"
														onChange={(e) =>
															handleFieldChange(
																`phones.${index}.number` as Path<BuyerFormValues>,
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
												<Select
													onValueChange={(value) =>
														handleFieldChange(
															`phones.${index}.type` as Path<BuyerFormValues>,
															value,
														)
													}
													defaultValue={field.value}
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
								onClick={() =>
									appendPhone({
										number: "",
										type: "Mobile",
										isPreferred: false,
									})
								}
								className="mt-2"
							>
								Add Phone
							</Button>
						</div>

						<div>
							<Label>Email Addresses</Label>
							{emailFields.map((field, index) => (
								<div key={field.id} className="flex items-end gap-4 mt-2">
									<FormField
										control={form.control}
										name={`emails.${index}.address`}
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														{...field}
														type="email"
														placeholder="Email address"
														onChange={(e) =>
															handleFieldChange(
																`emails.${index}.address` as Path<BuyerFormValues>,
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
								onClick={() => appendEmail({ address: "", isPreferred: false })}
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

				<div className="flex justify-end">
					<Button type="submit">Save Changes</Button>
				</div>
			</form>
		</Form>
	);
};
