import { Button } from "@/components/ui/button";
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
import { Trash2Icon } from "lucide-react";
import { forwardRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type {
	BeneficiaryFormValues,
	PhoneType,
} from "./schemas/beneficiary-form";

interface BeneficiaryFormProps {
	onSubmit: (data: BeneficiaryFormValues) => void;
	onDirtyChange: ((isDirty: boolean) => void) | undefined;
}

export const BeneficiaryForm = forwardRef<
	HTMLFormElement,
	BeneficiaryFormProps
>(({ onSubmit }, ref) => {
	const methods = useFormContext<BeneficiaryFormValues>();

	const {
		fields: phoneFields,
		append: appendPhone,
		remove: removePhone,
	} = useFieldArray({
		control: methods.control,
		name: "phones",
	});

	const {
		fields: emailFields,
		append: appendEmail,
		remove: removeEmail,
	} = useFieldArray({
		control: methods.control,
		name: "emails",
	});

	return (
		<Form {...methods}>
			<form
				ref={ref}
				onSubmit={(e) => {
					methods.handleSubmit((data) => {
						onSubmit(data);
					})(e);
				}}
				className="space-y-6"
			>
				{/* Name Section */}
				<div className="space-y-6">
					<div className="flex items-center gap-2">
						<h3 className="text-lg font-semibold">Personal Information</h3>
						<Separator className="flex-1" />
					</div>
					<div className="grid grid-cols-2 gap-6">
						<FormField
							control={methods.control}
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
							control={methods.control}
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
							control={methods.control}
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
							control={methods.control}
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
							control={methods.control}
							name="ethnicity"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ethnicity</FormLabel>
									<Select
										onValueChange={(value: string | undefined) => {
											if (!value && methods.getValues().ethnicity) {
												return;
											}
											methods.setValue("ethnicity", value || undefined, {
												shouldDirty: true,
												shouldTouch: true,
												shouldValidate: true,
											});
										}}
										value={field.value || ""}
										defaultValue={methods.getValues().ethnicity || ""}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select ethnicity" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="hispanic">Hispanic</SelectItem>
											<SelectItem value="non-hispanic">Non-Hispanic</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={methods.control}
							name="race"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Race</FormLabel>
									<Select
										onValueChange={(value: string | undefined) => {
											if (!value && methods.getValues().race) {
												return;
											}
											methods.setValue("race", value || undefined, {
												shouldDirty: true,
												shouldTouch: true,
												shouldValidate: true,
											});
										}}
										value={field.value || ""}
										defaultValue={methods.getValues().race || ""}
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
											<SelectItem value="native">Native American</SelectItem>
											<SelectItem value="pacific">Pacific Islander</SelectItem>
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
							control={methods.control}
							name="isVeteran"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center space-x-3 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={(checked) => {
												if (typeof checked === "boolean") {
													methods.setValue("isVeteran", checked, {
														shouldDirty: true,
														shouldTouch: true,
														shouldValidate: true,
													});
												}
											}}
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
							control={methods.control}
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
								control={methods.control}
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
								control={methods.control}
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
								control={methods.control}
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
								control={methods.control}
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
							control={methods.control}
							name="mailingAddressSameAsPhysical"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center space-x-3 space-y-0">
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={(checked) => {
												methods.setValue(
													"mailingAddressSameAsPhysical",
													checked,
												);
											}}
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
									control={methods.control}
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
								<FormField
									control={methods.control}
									name={`phones.${index}.type`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Type</FormLabel>
											<Select
												onValueChange={(value: PhoneType) => {
													if (
														!value &&
														methods.getValues().phones[index]?.type
													) {
														return;
													}
													methods.setValue(`phones.${index}.type`, value);
												}}
												value={field.value}
												defaultValue={
													methods.getValues().phones[index]?.type || "Mobile"
												}
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
							Add Phone
						</Button>
					</div>

					<div className="space-y-4">
						{emailFields.map((field, index) => (
							<div key={field.id} className="flex items-end gap-4">
								<FormField
									control={methods.control}
									name={`emails.${index}.address`}
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Email Address</FormLabel>
											<FormControl>
												<Input
													{...field}
													type="email"
													placeholder="Email address"
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
									<Trash2Icon className="h-4 w-4" />
								</Button>
							</div>
						))}
						<Button
							type="button"
							variant="outline"
							onClick={() => appendEmail({ address: "", isPreferred: false })}
						>
							Add Email
						</Button>
					</div>
				</div>

				{/* Additional Information */}
				<div className="space-y-6">
					<div className="flex items-center gap-2">
						<h3 className="text-lg font-semibold">Additional Information</h3>
						<Separator className="flex-1" />
					</div>
					<div className="space-y-4">
						<FormField
							control={methods.control}
							name="optOutOfFutureMarketing"
							render={({ field }) => (
								<FormItem className="flex items-center gap-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={(checked) => {
												if (typeof checked === "boolean") {
													field.onChange(checked);
												}
											}}
										/>
									</FormControl>
									<FormLabel>Opt out of future marketing</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
			</form>
		</Form>
	);
});

BeneficiaryForm.displayName = "BeneficiaryForm";
