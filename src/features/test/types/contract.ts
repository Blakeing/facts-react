import type { UseMutationResult } from "@tanstack/react-query";
import type { BuyerFormValues } from "../forms/schemas/buyer-form";
import type { ContractApiError } from "./errors";
import type { GeneralData } from "./general";
import type { DoneActorEvent, ErrorActorEvent } from "xstate";

// Re-export person types from schema
import type {
	Name,
	Address,
	Phone,
	Email,
	Dates,
	Identification as PersonIdentification,
} from "../forms/schemas/buyer-form";

// Core Types
export type ContractState = "draft" | "executed" | "finalized" | "void";

export interface Contract {
	id: string;
	contractState: ContractState;
	formData: FormData;
}

// ContactInfo type using schema types
export interface ContactInfo {
	phones: Phone[];
	emails: Email[];
}

export interface BeneficiaryData extends ContactInfo {
	name: Name;
	physicalAddress: Address;
	mailingAddressSameAsPhysical: boolean;
	mailingAddress?: Address;
	identification: PersonIdentification;
	dates: Dates;
	role?: string;
	ethnicity?: string;
	race?: string;
	isVeteran: boolean;
	optOutOfFutureMarketing: boolean;
}

// Form Data Types
export interface FormData {
	general: GeneralData | null;
	buyer: BuyerFormValues | null;
	payment: PaymentData | null;
	financing: FinancingData | null;
	beneficiary: BeneficiaryData | null;
}

export type PaymentData = {
	paymentMethod: "cash" | "credit";
	amount: number;
} | null;

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

// State Machine Types
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
	| { type: "GO_TO_PEOPLE" }
	| { type: "GO_TO_BUYER" }
	| { type: "GO_TO_BENEFICIARY" }
	| { type: "GO_TO_PAYMENT" }
	| { type: "GO_TO_FINANCING" }
	| { type: "GO_TO_REVIEW" }
	| { type: "EXECUTE" }
	| { type: "FINALIZE" }
	| { type: "VOID" }
	| { type: "SAVE_CONTRACT" }
	| { type: "UPDATE_GENERAL"; data: GeneralData }
	| { type: "UPDATE_BUYER"; data: BuyerFormValues }
	| { type: "UPDATE_PAYMENT"; data: PaymentData }
	| { type: "UPDATE_FINANCING"; data: FinancingData }
	| { type: "UPDATE_BENEFICIARY"; data: BeneficiaryData }
	| DoneActorEvent<Contract, string>
	| ErrorActorEvent<unknown, string>;

// Service Types
export interface ContractServices {
	mutations: {
		updateMutation: UseMutationResult<Contract, Error, Contract>;
		createMutation: UseMutationResult<Contract, Error, Omit<Contract, "id">>;
	};
}

// Constants
export const CONTRACT_STATE_MAP: Record<
	"EXECUTE" | "FINALIZE" | "VOID",
	ContractState
> = {
	EXECUTE: "executed",
	FINALIZE: "finalized",
	VOID: "void",
} as const;

// UI Types
export type ReviewSectionType =
	| "people"
	| "payment"
	| "general"
	| "financing"
	| "buyer"
	| "beneficiary";
