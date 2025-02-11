import type { UseMutationResult } from "@tanstack/react-query";
import type { BuyerData } from "../machines/buyerMachine";
import type { GeneralData } from "../machines/generalMachine";
import type { PaymentData } from "../machines/paymentMachine";
import type { ContractApiError } from "./errors";

export type ContractState = "draft" | "executed" | "finalized" | "void";

export interface FinancingData {
	isFinanceContract: boolean;
	downPayment: number;
	otherCredits: number;
	interestRate?: number;
	imputedInterestRate?: number;
	lateFeeType: "percentage" | "fixed";
	lateFeePercentage: number;
	maxLateFeeAmount: number;
	gracePeriod: number;
	paymentFrequency: "monthly" | "weekly" | "biweekly";
	numberOfPayments?: number;
	firstPaymentDate?: string;
	interestRebatePeriod: number;
	sendCouponBook: boolean;
	useCalculatedPaymentAmount: boolean;
	useCalculatedFinanceCharges: boolean;
}

export interface FormData {
	general: GeneralData | null;
	buyer: BuyerData | null;
	payment: PaymentData | null;
	financing: FinancingData | null;
}

export interface Contract {
	id: string;
	contractState: ContractState;
	formData: FormData;
}

export interface ContractContext {
	id: string | null;
	contractState: ContractState;
	formData: FormData;
	error: ContractApiError | null;
}

export interface LoadContractData {
	id: string;
	contractState: ContractState;
	formData: FormData;
}

export type ContractEvent =
	| { type: "LOAD_CONTRACT"; data: LoadContractData }
	| { type: "GO_TO_GENERAL" }
	| { type: "GO_TO_BUYER" }
	| { type: "GO_TO_PAYMENT" }
	| { type: "GO_TO_FINANCING" }
	| { type: "GO_TO_REVIEW" }
	| { type: "EXECUTE" }
	| { type: "FINALIZE" }
	| { type: "VOID" }
	| { type: "SAVE_CONTRACT" }
	| { type: "UPDATE_GENERAL"; data: GeneralData }
	| { type: "UPDATE_BUYER"; data: BuyerData }
	| { type: "UPDATE_PAYMENT"; data: PaymentData }
	| { type: "UPDATE_FINANCING"; data: FinancingData };

export interface ContractServices {
	mutations: {
		updateMutation: UseMutationResult<Contract, Error, Contract>;
		createMutation: UseMutationResult<Contract, Error, Omit<Contract, "id">>;
	};
}

export const CONTRACT_STATE_MAP: Record<
	"EXECUTE" | "FINALIZE" | "VOID",
	ContractState
> = {
	EXECUTE: "executed",
	FINALIZE: "finalized",
	VOID: "void",
} as const;
