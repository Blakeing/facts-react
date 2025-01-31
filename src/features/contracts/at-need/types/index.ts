export interface AtNeedContract {
	id: string;
	contractNumber: string;
	deceasedName: string;
	dateOfDeath: string;
	status: "draft" | "active" | "completed";
	totalAmount: number;
	createdAt: string;
}
