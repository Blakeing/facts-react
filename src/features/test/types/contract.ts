import type { UseMutationResult } from "@tanstack/react-query";
import type { DoneActorEvent, ErrorActorEvent, SnapshotFrom } from "xstate";
import type { BeneficiaryFormValues } from "../forms/schemas/beneficiary-form";
import type { BuyerFormValues } from "../forms/schemas/buyer-form";
import type { BuyerData } from "./buyer";
import type { ContractApiError } from "./errors";
import type { GeneralData } from "./general";

// Re-export person types from schema
import type {
	Address,
	Dates,
	Email,
	Name,
	Identification as PersonIdentification,
	Phone,
} from "../forms/schemas/buyer-form";

import type createContractMachine from "../machines/contractMachine";

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
	mailingAddress?: Address | undefined;
	identification: PersonIdentification;
	dates: Dates;
	role?: string | undefined;
	ethnicity?: string | undefined;
	race?: string | undefined;
	isVeteran: boolean;
	optOutOfFutureMarketing: boolean;
}

// Form Data Types
export interface FormData {
	general: GeneralData | null;
	buyer: BuyerData | null;
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
	draftData: FormData;
	finalizedData: FormData | null;
	error: ContractApiError | null;
	isDirty: boolean;
	validSections: {
		general: boolean;
		buyer: boolean;
		payment: boolean;
		financing: boolean;
		beneficiary: boolean;
	};
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
	| { type: "SAVE_DRAFT" }
	| { type: "SAVE_FINALIZED" }
	| { type: "UPDATE_GENERAL"; data: GeneralData; isValid?: boolean }
	| { type: "UPDATE_BUYER"; data: BuyerData; isValid?: boolean }
	| { type: "UPDATE_PAYMENT"; data: PaymentData; isValid?: boolean }
	| { type: "UPDATE_FINANCING"; data: FinancingData; isValid?: boolean }
	| { type: "UPDATE_BENEFICIARY"; data: BeneficiaryData; isValid?: boolean }
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

// Machine Types
export type ContractSnapshot = SnapshotFrom<
	ReturnType<typeof createContractMachine>
>;
