import type { UseMutationResult } from "@tanstack/react-query";
import type { GeneralData } from "../machines/generalMachine";
import type { PeopleData } from "../machines/peopleMachine";
import type { PaymentData } from "../machines/paymentMachine";
import type { ContractApiError } from "./errors";

export type ContractState = "draft" | "executed" | "finalized" | "void";

export interface FormData {
	general: GeneralData | null;
	people: PeopleData | null;
	payment: PaymentData | null;
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
	error?: ContractApiError;
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
	| { type: "GO_TO_PAYMENT" }
	| { type: "GO_TO_REVIEW" }
	| { type: "EXECUTE" }
	| { type: "FINALIZE" }
	| { type: "VOID" }
	| { type: "SAVE_CONTRACT" }
	| { type: "UPDATE_GENERAL"; data: GeneralData }
	| { type: "UPDATE_PEOPLE"; data: PeopleData }
	| { type: "UPDATE_PAYMENT"; data: PaymentData };

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
