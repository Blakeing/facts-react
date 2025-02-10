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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "@xstate/react";
import { memo, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { ActorRefFrom } from "xstate";
import * as z from "zod";
import type createContractMachine from "../../machines/contractMachine";
import type { PaymentData } from "../../machines/paymentMachine";

const paymentFormSchema = z.object({
	paymentMethod: z.enum(["cash", "credit"], {
		required_error: "Please select a payment method.",
	}),
	amount: z
		.number({
			required_error: "Amount is required",
			invalid_type_error: "Amount must be a number",
		})
		.min(0.01, "Amount must be greater than 0"),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

type ContractActor = ActorRefFrom<ReturnType<typeof createContractMachine>>;

interface PaymentSectionProps {
	actor: ContractActor;
}

const paymentDataSelector = (state: {
	context: { formData: { payment: PaymentData | null } };
}) => ({
	paymentMethod: state.context.formData.payment?.paymentMethod ?? "cash",
	amount: state.context.formData.payment?.amount ?? 0,
});

const PaymentSection = memo(({ actor }: PaymentSectionProps) => {
	if (!actor) return null;

	const send = actor.send;
	const { paymentMethod, amount } = useSelector(actor, paymentDataSelector);

	const form = useForm<PaymentFormValues>({
		resolver: zodResolver(paymentFormSchema),
		defaultValues: {
			paymentMethod: "cash",
			amount: 0,
		},
		mode: "onTouched",
	});

	useEffect(() => {
		form.reset({ paymentMethod, amount });
	}, [paymentMethod, amount, form]);

	const handlePaymentMethodChange = useCallback(
		(value: "cash" | "credit") => {
			form.setValue("paymentMethod", value);
			const values = form.getValues();
			send({
				type: "UPDATE_PAYMENT",
				data: values,
			});
		},
		[form, send],
	);

	const handleAmountChange = useCallback(
		(value: number) => {
			form.setValue("amount", value);
			const values = form.getValues();
			send({
				type: "UPDATE_PAYMENT",
				data: values,
			});
		},
		[form, send],
	);

	return (
		<Card>
			<CardContent className="pt-6">
				<Form {...form}>
					<form className="space-y-6">
						<FormField
							control={form.control}
							name="paymentMethod"
							render={({ field }) => (
								<FormItem className="space-y-3">
									<FormLabel>Payment Method</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={handlePaymentMethodChange}
											value={field.value}
											className="flex flex-col space-y-1"
										>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
													<RadioGroupItem value="cash" />
												</FormControl>
												<FormLabel className="font-normal">Cash</FormLabel>
											</FormItem>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
													<RadioGroupItem value="credit" />
												</FormControl>
												<FormLabel className="font-normal">
													Credit Card
												</FormLabel>
											</FormItem>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Amount</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.01"
											{...field}
											onChange={(e) =>
												handleAmountChange(Number.parseFloat(e.target.value))
											}
											required
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
});

PaymentSection.displayName = "PaymentSection";

export default PaymentSection;
