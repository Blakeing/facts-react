import type { UseMutationResult } from "@tanstack/react-query";
import type { BuyerData } from "../machines/buyerMachine";
import type { GeneralData } from "../machines/generalMachine";
import type { ContractApiError } from "./errors";

// Core Types
export type ContractState = "draft" | "executed" | "finalized" | "void";

export interface Contract {
	id: string;
	contractState: ContractState;
	formData: FormData;
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

// Person Data Types
export interface PersonName {
	first: string;
	last: string;
	prefix?: string | undefined;
	middle?: string | undefined;
	suffix?: string | undefined;
	companyName?: string | undefined;
	nickname?: string | undefined;
	maiden?: string | undefined;
	gender?: string | undefined;
}

export interface Address {
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
}

export interface PersonDates {
	dateOfBirth?: string | undefined;
	dateOfDeath?: string | undefined;
	isDeceased: boolean;
}

interface PersonIdentification {
	stateIdNumber: string;
	issuer: string;
}

interface ContactInfo {
	phones: Array<{
		number: string;
		type: string;
		isPreferred: boolean;
	}>;
	emails: Array<{
		address: string;
		isPreferred: boolean;
	}>;
}

export interface BeneficiaryData extends ContactInfo {
	name: PersonName;
	physicalAddress: Address;
	mailingAddressSameAsPhysical: boolean;
	mailingAddress?: Address | undefined;
	identification: PersonIdentification;
	dates: PersonDates;
	role?: string | undefined;
	ethnicity?: string | undefined;
	race?: string | undefined;
	isVeteran: boolean;
	optOutOfFutureMarketing: boolean;
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
	| { type: "UPDATE_BUYER"; data: BuyerData }
	| { type: "UPDATE_PAYMENT"; data: PaymentData }
	| { type: "UPDATE_FINANCING"; data: FinancingData }
	| { type: "UPDATE_BENEFICIARY"; data: BeneficiaryData };

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
