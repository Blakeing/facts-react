import * as z from "zod";

export const financingFormSchema = z.object({
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

export type FinancingFormValues = z.infer<typeof financingFormSchema>;
export type LateFeeType = z.infer<typeof financingFormSchema.shape.lateFeeType>;
export type PaymentFrequency = z.infer<
	typeof financingFormSchema.shape.paymentFrequency
>;

export const defaultFinancingFormValues: FinancingFormValues = {
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
