export interface PreNeedContract {
	id: string;
	contractNumber: string;
	customerName: string;
	status: "draft" | "active" | "completed" | "cancelled";
	totalAmount: number;
	monthlyPayment: number;
	nextPaymentDate: string;
	createdAt: string;
}
