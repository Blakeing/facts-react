import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { memo, useCallback } from "react";
import type { BuyerData } from "../../machines/buyerMachine";
import type { GeneralData } from "../../machines/generalMachine";
import type { PaymentData } from "../../machines/paymentMachine";
import type { FinancingData } from "../../types/contract";
import type { BeneficiaryData } from "../../types/contract";
import type { ReviewSectionType } from "../../types/contract";

export interface ReviewSectionProps {
	generalData: GeneralData | null;
	buyerData: BuyerData | null;
	paymentData: PaymentData | null;
	financingData: FinancingData | null;
	beneficiaryData: BeneficiaryData | null;
	onEdit?: (section: ReviewSectionType) => void;
	readOnly?: boolean;
	status?: "finalized" | "void";
}

const ReviewSection = memo(
	({
		generalData,
		buyerData,
		paymentData,
		financingData,
		beneficiaryData,
		onEdit,
		readOnly = false,
		status,
	}: ReviewSectionProps) => {
		const handleEdit = useCallback(
			(
				section: "buyer" | "payment" | "general" | "financing" | "beneficiary",
			) => {
				onEdit?.(section);
			},
			[onEdit],
		);

		return (
			<Card>
				<CardContent className="pt-6">
					<div className="space-y-6">
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<h3 className="text-lg font-semibold">General Information</h3>
								{!readOnly && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleEdit("general")}
									>
										Edit
									</Button>
								)}
							</div>
							{generalData && (
								<div>
									<p>Contract Type: {generalData.contractType}</p>
									<p>
										Contract Date:{" "}
										{format(new Date(generalData.contractSignDate), "PPP")}
									</p>
								</div>
							)}
						</div>

						<Separator />

						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<h3 className="text-lg font-semibold">Buyer Information</h3>
								{!readOnly && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleEdit("buyer")}
									>
										Edit
									</Button>
								)}
							</div>
							{buyerData && (
								<div>
									<p>
										Name: {`${buyerData.name.first} ${buyerData.name.last}`}
									</p>
									<p>
										Address:{" "}
										{`${buyerData.physicalAddress.street}, ${buyerData.physicalAddress.city}, ${buyerData.physicalAddress.state} ${buyerData.physicalAddress.postalCode}`}
									</p>
									<p>Phone: {buyerData.phones[0]?.number}</p>
									<p>Email: {buyerData.emails[0]?.address}</p>
								</div>
							)}
						</div>

						<Separator />

						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<h3 className="text-lg font-semibold">Payment Information</h3>
								{!readOnly && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleEdit("payment")}
									>
										Edit
									</Button>
								)}
							</div>
							{paymentData && (
								<div>
									<p>Payment Method: {paymentData.paymentMethod}</p>
									<p>Amount: ${paymentData.amount}</p>
								</div>
							)}
						</div>

						<Separator />

						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<h3 className="text-lg font-semibold">Financing Information</h3>
								{!readOnly && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleEdit("financing")}
									>
										Edit
									</Button>
								)}
							</div>
							{financingData?.isFinanceContract && (
								<div className="space-y-2">
									<div>
										<p>Down Payment: ${financingData.downPayment}</p>
										<p>Other Credits: ${financingData.otherCredits}</p>
										<p>
											Total Down Payment/Credits: $
											{financingData.downPayment + financingData.otherCredits}
										</p>
									</div>
									<div>
										{financingData.interestRate && (
											<p>Interest Rate: {financingData.interestRate}%</p>
										)}
										{financingData.imputedInterestRate && (
											<p>
												Imputed Interest Rate:{" "}
												{financingData.imputedInterestRate}%
											</p>
										)}
									</div>
									<div>
										<p>
											Late Fee:{" "}
											{financingData.lateFeeType === "percentage"
												? `${financingData.lateFeePercentage}% of payment amount`
												: `$${financingData.maxLateFeeAmount} fixed amount`}
										</p>
										<p>
											Maximum Late Fee Amount: ${financingData.maxLateFeeAmount}
										</p>
										<p>Grace Period: {financingData.gracePeriod} days</p>
									</div>
									<div>
										<p>Payment Frequency: {financingData.paymentFrequency}</p>
										{financingData.numberOfPayments && (
											<p>
												Number of Payments: {financingData.numberOfPayments}
											</p>
										)}
										{financingData.firstPaymentDate && (
											<p>
												First Payment Date:{" "}
												{format(
													new Date(financingData.firstPaymentDate),
													"PPP",
												)}
											</p>
										)}
									</div>
									<div>
										<p>
											Interest Rebate Period:{" "}
											{financingData.interestRebatePeriod} days
										</p>
										<p>
											Send Coupon Book:{" "}
											{financingData.sendCouponBook ? "Yes" : "No"}
										</p>
										<p>
											Use Calculated Payment Amount:{" "}
											{financingData.useCalculatedPaymentAmount ? "Yes" : "No"}
										</p>
										<p>
											Use Calculated Finance Charges:{" "}
											{financingData.useCalculatedFinanceCharges ? "Yes" : "No"}
										</p>
									</div>
								</div>
							)}
						</div>

						<Separator />

						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<h3 className="text-lg font-semibold">
									Beneficiary Information
								</h3>
								{!readOnly && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleEdit("beneficiary")}
									>
										Edit
									</Button>
								)}
							</div>
							{beneficiaryData && (
								<div>
									<p>
										Name:{" "}
										{`${beneficiaryData.name.first} ${beneficiaryData.name.last}`}
									</p>
									<p>
										Address:{" "}
										{`${beneficiaryData.physicalAddress.street}, ${beneficiaryData.physicalAddress.city}, ${beneficiaryData.physicalAddress.state} ${beneficiaryData.physicalAddress.postalCode}`}
									</p>
									<p>Phone: {beneficiaryData.phones[0]?.number}</p>
									<p>Email: {beneficiaryData.emails[0]?.address}</p>
								</div>
							)}
						</div>

						{status && (
							<>
								<Separator />
								<p
									className={cn(
										"text-lg font-semibold text-center",
										status === "finalized"
											? "text-green-600 dark:text-green-500"
											: "text-red-600 dark:text-red-500",
									)}
								>
									Status: {status.charAt(0).toUpperCase() + status.slice(1)}
								</p>
							</>
						)}
					</div>
				</CardContent>
			</Card>
		);
	},
);

ReviewSection.displayName = "ReviewSection";

export default ReviewSection;
