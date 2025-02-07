import type { GeneralData } from "../../machines/generalMachine";
import type { BuyerData } from "../../machines/buyerMachine";
import type { PaymentData } from "../../machines/paymentMachine";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { memo, useCallback } from "react";
import { format } from "date-fns";

export interface ReviewSectionProps {
	generalData: GeneralData | null;
	buyerData: BuyerData | null;
	paymentData: PaymentData | null;
	readOnly?: boolean;
	status?: "finalized" | "void";
	onEdit?: (section: "buyer" | "payment" | "general") => void;
}

const ReviewSection = memo(
	({
		generalData,
		buyerData,
		paymentData,
		readOnly,
		status,
		onEdit,
	}: ReviewSectionProps) => {
		const handleEdit = useCallback(
			(section: "buyer" | "payment" | "general") => {
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
