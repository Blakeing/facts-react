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
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "@xstate/react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
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

type ContractActor = ActorRefFrom<ReturnType<typeof createContractMachine>>;

interface FinancingSectionProps {
	actor: ContractActor;
}

const financingDataSelector = (state: {
	context: { formData: { financing: FinancingData | null } };
}) =>
	state.context.formData.financing ?? {
		isFinanceContract: false,
		downPayment: 0,
		otherCredits: 0,
		lateFeeType: "percentage" as const,
		lateFeePercentage: 5,
		maxLateFeeAmount: 5,
		gracePeriod: 10,
		paymentFrequency: "monthly" as const,
		interestRebatePeriod: 0,
		sendCouponBook: false,
		useCalculatedPaymentAmount: true,
		useCalculatedFinanceCharges: true,
	};

const FinancingSection = ({ actor }: FinancingSectionProps) => {
	if (!actor) return null;

	const send = actor.send;
	const financingData = useSelector(actor, financingDataSelector);

	const form = useForm<FinancingData>({
		resolver: zodResolver(financingFormSchema),
		defaultValues: financingData,
		mode: "onTouched",
	});

	useEffect(() => {
		form.reset(financingData);
	}, [financingData, form]);

	const handleFieldChange = useCallback(
		(field: keyof FinancingData, value: FinancingData[keyof FinancingData]) => {
			form.setValue(field, value, { shouldDirty: true });
			const values = form.getValues();
			send({
				type: "UPDATE_FINANCING",
				data: values,
			});
		},
		[form, send],
	);

	return (
		<Card>
			<CardContent className="pt-6">
				<Form {...form}>
					<form className="space-y-8">
						{/* Finance Contract Toggle */}
						<FormField
							control={form.control}
							name="isFinanceContract"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base font-semibold">
											Enable Financing
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
															{...field}
															onChange={(e) =>
																handleFieldChange(
																	"downPayment",
																	Number.parseFloat(e.target.value),
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
																	Number.parseFloat(e.target.value),
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
									<h3 className="text-lg font-semibold">Interest Rates</h3>
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
															onChange={(e) =>
																handleFieldChange(
																	"interestRate",
																	Number.parseFloat(e.target.value),
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
															onChange={(e) =>
																handleFieldChange(
																	"imputedInterestRate",
																	Number.parseFloat(e.target.value),
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
									<h3 className="text-lg font-semibold">Late Fee Settings</h3>
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
																Percentage of Payment Amount
															</SelectItem>
															<SelectItem value="fixed">
																Fixed Amount
															</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

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
																handleFieldChange(
																	"lateFeePercentage",
																	Number.parseFloat(e.target.value),
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
											name="maxLateFeeAmount"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Maximum Late Fee Amount</FormLabel>
													<FormControl>
														<Input
															type="number"
															step="0.01"
															{...field}
															onChange={(e) =>
																handleFieldChange(
																	"maxLateFeeAmount",
																	Number.parseFloat(e.target.value),
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
															{...field}
															onChange={(e) =>
																handleFieldChange(
																	"gracePeriod",
																	Number.parseInt(e.target.value),
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
															{...field}
															onChange={(e) =>
																handleFieldChange(
																	"numberOfPayments",
																	Number.parseInt(e.target.value),
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
															{...field}
															onChange={(e) =>
																handleFieldChange(
																	"interestRebatePeriod",
																	Number.parseInt(e.target.value),
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
									<h3 className="text-lg font-semibold">Additional Options</h3>
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
};

export default FinancingSection;
