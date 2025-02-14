import { Card, CardContent } from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "@xstate/react";
import { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";
import { type UseFormReturn, useForm, useFormState } from "react-hook-form";
import type { ActorRefFrom } from "xstate";
import * as z from "zod";
import type createContractMachine from "../../machines/contractMachine";
import type { FinancingData } from "../../types/contract";

const financingFormSchema = z.object({
	isFinanceContract: z.boolean().default(false),
	downPayment: z.number().min(0).default(0),
	otherCredits: z.number().min(0).default(0),
	interestRate: z.number().min(0).max(100).optional(),
	imputedInterestRate: z.number().min(0).max(100).optional(),
	lateFeeType: z.enum(["percentage", "fixed"]).default("percentage"),
	lateFeePercentage: z.number().min(0).max(100).default(5),
	maxLateFeeAmount: z.number().min(0).default(5),
	gracePeriod: z.number().min(0).default(10),
	paymentFrequency: z
		.enum(["monthly", "weekly", "biweekly"])
		.default("monthly"),
	numberOfPayments: z.number().min(1).optional(),
	firstPaymentDate: z.string().optional(),
	interestRebatePeriod: z.number().min(0).default(0),
	sendCouponBook: z.boolean().default(false),
	useCalculatedPaymentAmount: z.boolean().default(true),
	useCalculatedFinanceCharges: z.boolean().default(true),
});

type FinancingFormValues = z.infer<typeof financingFormSchema>;

type ContractActor = ActorRefFrom<ReturnType<typeof createContractMachine>>;

export interface FinancingSectionRef {
	form: UseFormReturn<FinancingFormValues>;
	isDirty: boolean;
	save: () => void;
}

interface FinancingSectionProps {
	actor: ContractActor;
}

const defaultFinancingData: FinancingFormValues = {
	isFinanceContract: false,
	downPayment: 0,
	otherCredits: 0,
	lateFeeType: "percentage",
	lateFeePercentage: 5,
	maxLateFeeAmount: 5,
	gracePeriod: 10,
	paymentFrequency: "monthly",
	interestRebatePeriod: 0,
	sendCouponBook: false,
	useCalculatedPaymentAmount: true,
	useCalculatedFinanceCharges: true,
};

const financingDataSelector = (state: {
	context: { draftData: { financing: FinancingData | null } };
}) => state.context.draftData.financing ?? defaultFinancingData;

const FinancingSection = forwardRef<FinancingSectionRef, FinancingSectionProps>(
	({ actor }, ref) => {
		if (!actor) return null;

		const send = actor.send;
		const financingData = useSelector(actor, financingDataSelector);

		const form = useForm<FinancingFormValues>({
			resolver: zodResolver(financingFormSchema),
			defaultValues: financingData,
			mode: "onChange",
		});

		const formState = useFormState({
			control: form.control,
		});

		const saveToXState = useCallback(() => {
			const values = form.getValues();
			const today = new Date().toISOString().split("T")[0];
			const data = {
				isFinanceContract: values.isFinanceContract,
				downPayment: values.downPayment,
				otherCredits: values.otherCredits,
				lateFeeType: values.lateFeeType,
				lateFeePercentage: values.lateFeePercentage,
				maxLateFeeAmount: values.maxLateFeeAmount,
				gracePeriod: values.gracePeriod,
				paymentFrequency: values.paymentFrequency,
				interestRebatePeriod: values.interestRebatePeriod,
				sendCouponBook: values.sendCouponBook,
				useCalculatedPaymentAmount: values.useCalculatedPaymentAmount,
				useCalculatedFinanceCharges: values.useCalculatedFinanceCharges,
				...(values.interestRate !== undefined && {
					interestRate: values.interestRate,
				}),
				...(values.imputedInterestRate !== undefined && {
					imputedInterestRate: values.imputedInterestRate,
				}),
				...(values.numberOfPayments !== undefined && {
					numberOfPayments: values.numberOfPayments,
				}),
				...(values.firstPaymentDate !== undefined && {
					firstPaymentDate: values.firstPaymentDate,
				}),
			} satisfies FinancingData;
			send({
				type: "UPDATE_FINANCING",
				data,
			});
		}, [form, send]);

		useEffect(() => {
			form.reset(financingData);
		}, [form, financingData]);

		useImperativeHandle(
			ref,
			() => ({
				form,
				isDirty: formState.isDirty,
				save: saveToXState,
			}),
			[form, formState.isDirty, saveToXState],
		);

		const handleFieldChange = (
			field: keyof FinancingFormValues,
			value: string | number | boolean | undefined,
		) => {
			if (value === undefined) return;
			form.setValue(field, value);
			const values = form.getValues();
			const today = new Date().toISOString().split("T")[0];
			const data = {
				isFinanceContract: values.isFinanceContract,
				downPayment: values.downPayment,
				otherCredits: values.otherCredits,
				lateFeeType: values.lateFeeType,
				lateFeePercentage: values.lateFeePercentage,
				maxLateFeeAmount: values.maxLateFeeAmount,
				gracePeriod: values.gracePeriod,
				paymentFrequency: values.paymentFrequency,
				interestRebatePeriod: values.interestRebatePeriod,
				sendCouponBook: values.sendCouponBook,
				useCalculatedPaymentAmount: values.useCalculatedPaymentAmount,
				useCalculatedFinanceCharges: values.useCalculatedFinanceCharges,
				...(values.interestRate !== undefined && {
					interestRate: values.interestRate,
				}),
				...(values.imputedInterestRate !== undefined && {
					imputedInterestRate: values.imputedInterestRate,
				}),
				...(values.numberOfPayments !== undefined && {
					numberOfPayments: values.numberOfPayments,
				}),
				...(values.firstPaymentDate !== undefined && {
					firstPaymentDate: values.firstPaymentDate,
				}),
			} satisfies FinancingData;
			send({
				type: "UPDATE_FINANCING",
				data,
			});
		};

		return (
			<Card>
				<CardContent className="pt-6">
					<Form {...form}>
						<form className="space-y-8">
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
												checked={field.value}
												onCheckedChange={(value) =>
													handleFieldChange("isFinanceContract", value)
												}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							{form.watch("isFinanceContract") && (
								<div className="space-y-8">
									{/* Payment Details Section */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold">Payment Details</h3>
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
																value={field.value ?? ""}
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
																value={field.value ?? ""}
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
										<h3 className="text-lg font-semibold">Interest Rate</h3>
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
																value={field.value ?? ""}
																onChange={(e) =>
																	handleFieldChange(
																		"imputedInterestRate",
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
										</div>
									</div>

									{/* Late Fee Section */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold">Late Fee</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="lateFeeType"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Late Fee Type</FormLabel>
														<Select
															onValueChange={(value: "percentage" | "fixed") =>
																handleFieldChange("lateFeeType", value)
															}
															defaultValue={field.value}
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

											{form.watch("lateFeeType") === "percentage" && (
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
																	value={field.value ?? ""}
																	onChange={(e) =>
																		handleFieldChange(
																			"lateFeePercentage",
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
												name="maxLateFeeAmount"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Maximum Late Fee Amount</FormLabel>
														<FormControl>
															<Input
																type="number"
																step="0.01"
																value={field.value ?? ""}
																onChange={(e) =>
																	handleFieldChange(
																		"maxLateFeeAmount",
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
												name="gracePeriod"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Grace Period (days)</FormLabel>
														<FormControl>
															<Input
																type="number"
																value={field.value ?? ""}
																onChange={(e) =>
																	handleFieldChange(
																		"gracePeriod",
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
										<h3 className="text-lg font-semibold">Payment Schedule</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="paymentFrequency"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Payment Frequency</FormLabel>
														<Select
															onValueChange={(
																value: "monthly" | "weekly" | "biweekly",
															) => handleFieldChange("paymentFrequency", value)}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select payment frequency" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="monthly">Monthly</SelectItem>
																<SelectItem value="weekly">Weekly</SelectItem>
																<SelectItem value="biweekly">
																	Bi-weekly
																</SelectItem>
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
																value={field.value ?? ""}
																onChange={(e) =>
																	handleFieldChange(
																		"numberOfPayments",
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
												name="firstPaymentDate"
												render={({ field }) => (
													<FormItem>
														<FormLabel>First Payment Date</FormLabel>
														<FormControl>
															<Input
																type="date"
																{...field}
																onChange={(e) =>
																	handleFieldChange(
																		"firstPaymentDate",
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
												name="interestRebatePeriod"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Interest Rebate Period (days)</FormLabel>
														<FormControl>
															<Input
																type="number"
																value={field.value ?? ""}
																onChange={(e) =>
																	handleFieldChange(
																		"interestRebatePeriod",
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
										<h3 className="text-lg font-semibold">
											Additional Options
										</h3>
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
																checked={field.value}
																onCheckedChange={(value) =>
																	handleFieldChange("sendCouponBook", value)
																}
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
																checked={field.value}
																onCheckedChange={(value) =>
																	handleFieldChange(
																		"useCalculatedPaymentAmount",
																		value,
																	)
																}
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
																checked={field.value}
																onCheckedChange={(value) =>
																	handleFieldChange(
																		"useCalculatedFinanceCharges",
																		value,
																	)
																}
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
				</CardContent>
			</Card>
		);
	},
);

FinancingSection.displayName = "FinancingSection";

export default FinancingSection;
