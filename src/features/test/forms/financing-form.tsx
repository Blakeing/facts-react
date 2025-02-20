import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { forwardRef, useEffect, useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { FinancingFormValues } from "./schemas/financing-form";
import { defaultFinancingFormValues } from "./schemas/financing-form";

interface FinancingFormProps {
	onSubmit: (data: FinancingFormValues) => void;
	onDirtyChange?: (isDirty: boolean) => void;
}

export const FinancingForm = forwardRef<HTMLFormElement, FinancingFormProps>(
	({ onSubmit, onDirtyChange }, ref) => {
		const form = useFormContext<FinancingFormValues>();
		const [showFinancing, setShowFinancing] = useState(false);

		// Watch for changes to isFinanceContract and form dirty state
		const isFinanceContract = form.watch("isFinanceContract");
		const formState = form.formState;

		// Initialize form with defaults and set initial state
		useEffect(() => {
			const currentValues = form.getValues();
			setShowFinancing(!!currentValues.isFinanceContract);
		}, [form]);

		// Sync local state with form state
		useEffect(() => {
			setShowFinancing(!!isFinanceContract);
		}, [isFinanceContract]);

		// Notify parent of dirty state changes
		useEffect(() => {
			onDirtyChange?.(formState.isDirty);
		}, [formState.isDirty, onDirtyChange]);

		const handleToggleChange = useCallback(
			async (checked: boolean) => {
				// First update the toggle state
				form.setValue("isFinanceContract", checked, {
					shouldDirty: true,
					shouldTouch: true,
					shouldValidate: true,
				});

				// If turning off financing, reset all fields to defaults
				if (!checked) {
					form.reset({
						...defaultFinancingFormValues,
						isFinanceContract: false,
					});
				}

				// Submit the form to update XState
				await form.handleSubmit(onSubmit)();
			},
			[form, onSubmit],
		);

		const handleFieldChange = useCallback(
			(
				field: keyof FinancingFormValues,
				value: FinancingFormValues[keyof FinancingFormValues],
			) => {
				form.setValue(field, value, {
					shouldDirty: true,
					shouldTouch: true,
					shouldValidate: true,
				});

				// Trigger form submission to sync with XState
				form.handleSubmit(onSubmit)();
			},
			[form, onSubmit],
		);

		return (
			<Form {...form}>
				<form
					ref={ref}
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<div className="space-y-6">
						<div className="flex items-center gap-2">
							<h3 className="text-lg font-semibold">Financing Options</h3>
							<Separator className="flex-1" />
						</div>

						<FormField
							control={form.control}
							name="isFinanceContract"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Finance Contract
										</FormLabel>
									</div>
									<FormControl>
										<Switch
											checked={field.value ?? false}
											onCheckedChange={handleToggleChange}
											aria-label="Toggle finance contract"
											name={field.name}
											ref={field.ref}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>

					{showFinancing && (
						<div className="space-y-8">
							{/* Payment Details Section */}
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<h3 className="text-lg font-semibold">Payment Details</h3>
									<Separator className="flex-1" />
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="downPayment"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Down Payment</FormLabel>
												<FormControl>
													<Input
														type="number"
														step="0.01"
														{...field}
														onChange={(e) =>
															handleFieldChange(
																"downPayment",
																e.target.value === ""
																	? 0
																	: Number(e.target.value),
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
										name="otherCredits"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Other Credits</FormLabel>
												<FormControl>
													<Input
														type="number"
														step="0.01"
														{...field}
														onChange={(e) =>
															handleFieldChange(
																"otherCredits",
																e.target.value === ""
																	? 0
																	: Number(e.target.value),
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

							{/* Interest Rate Section */}
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<h3 className="text-lg font-semibold">Interest Rate</h3>
									<Separator className="flex-1" />
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="interestRate"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Interest Rate (%)</FormLabel>
												<FormControl>
													<Input
														type="number"
														step="0.01"
														{...field}
														value={field.value ?? ""}
														onChange={(e) =>
															handleFieldChange(
																"interestRate",
																e.target.value === ""
																	? undefined
																	: Number(e.target.value),
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
										name="imputedInterestRate"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Imputed Interest Rate (%)</FormLabel>
												<FormControl>
													<Input
														type="number"
														step="0.01"
														{...field}
														value={field.value ?? ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>

							{/* Late Fee Section */}
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<h3 className="text-lg font-semibold">Late Fee</h3>
									<Separator className="flex-1" />
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="lateFeeType"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Late Fee Type</FormLabel>
												<Select
													onValueChange={(value) =>
														handleFieldChange("lateFeeType", value)
													}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select late fee type" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="percentage">
															Percentage
														</SelectItem>
														<SelectItem value="fixed">Fixed</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									{form.watch("lateFeeType") === "percentage" ? (
										<FormField
											control={form.control}
											name="lateFeePercentage"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Late Fee Percentage (%)</FormLabel>
													<FormControl>
														<Input
															type="number"
															step="0.01"
															{...field}
															onChange={(e) =>
																field.onChange(
																	e.target.value === ""
																		? 0
																		: Number(e.target.value),
																)
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									) : (
										<FormField
											control={form.control}
											name="maxLateFeeAmount"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Late Fee Amount</FormLabel>
													<FormControl>
														<Input
															type="number"
															step="0.01"
															{...field}
															onChange={(e) =>
																field.onChange(
																	e.target.value === ""
																		? 0
																		: Number(e.target.value),
																)
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}

									<FormField
										control={form.control}
										name="gracePeriod"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Grace Period (Days)</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
														onChange={(e) =>
															field.onChange(
																e.target.value === ""
																	? 0
																	: Number(e.target.value),
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

							{/* Payment Schedule Section */}
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<h3 className="text-lg font-semibold">Payment Schedule</h3>
									<Separator className="flex-1" />
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="paymentFrequency"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Payment Frequency</FormLabel>
												<Select
													onValueChange={(value) =>
														handleFieldChange("paymentFrequency", value)
													}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select payment frequency" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="monthly">Monthly</SelectItem>
														<SelectItem value="weekly">Weekly</SelectItem>
														<SelectItem value="biweekly">Bi-Weekly</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="numberOfPayments"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Number of Payments</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
														value={field.value ?? ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="firstPaymentDate"
										render={({ field }) => (
											<FormItem>
												<FormLabel>First Payment Date</FormLabel>
												<FormControl>
													<Input
														type="date"
														{...field}
														value={field.value ?? ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="interestRebatePeriod"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Interest Rebate Period (Days)</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
														onChange={(e) =>
															field.onChange(
																e.target.value === ""
																	? 0
																	: Number(e.target.value),
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

							{/* Additional Options Section */}
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<h3 className="text-lg font-semibold">Additional Options</h3>
									<Separator className="flex-1" />
								</div>
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="sendCouponBook"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
												<div className="space-y-0.5">
													<FormLabel className="text-base">
														Send Coupon Book
													</FormLabel>
												</div>
												<FormControl>
													<Switch
														checked={field.value ?? false}
														onCheckedChange={(checked) =>
															handleFieldChange("sendCouponBook", checked)
														}
														aria-label="Toggle send coupon book"
													/>
												</FormControl>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="useCalculatedPaymentAmount"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
												<div className="space-y-0.5">
													<FormLabel className="text-base">
														Use Calculated Payment Amount
													</FormLabel>
												</div>
												<FormControl>
													<Switch
														checked={field.value ?? true}
														onCheckedChange={field.onChange}
														aria-label="Toggle use calculated payment amount"
													/>
												</FormControl>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="useCalculatedFinanceCharges"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
												<div className="space-y-0.5">
													<FormLabel className="text-base">
														Use Calculated Finance Charges
													</FormLabel>
												</div>
												<FormControl>
													<Switch
														checked={field.value ?? true}
														onCheckedChange={field.onChange}
														aria-label="Toggle use calculated finance charges"
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>
					)}
				</form>
			</Form>
		);
	},
);

FinancingForm.displayName = "FinancingForm";
