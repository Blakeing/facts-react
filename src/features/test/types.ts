// Form data types
import type { GeneralData } from "./machines/generalMachine";
import type { BuyerData } from "./machines/buyerMachine";
type PaymentData = { paymentMethod: "cash" | "credit"; amount: number } | null;

export type ContractState = "draft" | "executed" | "finalized" | "void";

export interface Contract {
	id: string;
	contractState: ContractState;
	formData: {
		general: GeneralData | null;
		buyer: BuyerData | null;
		payment: PaymentData;
	};
}
