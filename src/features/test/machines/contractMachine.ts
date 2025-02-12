import { assign, fromPromise, setup } from "xstate";
import type {
	Contract,
	ContractContext,
	ContractEvent,
	ContractServices,
	LoadContractData,
	FinancingData,
	BeneficiaryData,
} from "../types/contract";
import { CONTRACT_STATE_MAP } from "../types/contract";
import { isContractApiError } from "../types/errors";
import type { GeneralData } from "./generalMachine";
import type { BuyerData } from "./buyerMachine";
import type { PaymentData } from "./paymentMachine";

const createContractMachine = (services: ContractServices) => {
	return setup({
		types: {
			context: {} as ContractContext,
			events: {} as
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
				| { type: "UPDATE_BENEFICIARY"; data: BeneficiaryData },
		},
		actors: {
			saveContract: fromPromise<Contract, { context: ContractContext }>(
				async ({ input: { context } }) => {
					const contractData = {
						contractState: context.contractState,
						formData: context.formData,
					};

					try {
						if (!context.id) {
							return await services.mutations.createMutation.mutateAsync(
								contractData,
							);
						}
						return await services.mutations.updateMutation.mutateAsync({
							...contractData,
							id: context.id,
						});
					} catch (error) {
						if (isContractApiError(error)) {
							throw error;
						}
						throw new Error("Failed to save contract");
					}
				},
			),
			updateContract: fromPromise<Contract, { context: ContractContext }>(
				async ({ input: { context } }) => {
					if (!context.id) {
						throw new Error("Cannot update contract without ID");
					}

					try {
						return await services.mutations.updateMutation.mutateAsync({
							id: context.id,
							contractState: context.contractState,
							formData: context.formData,
						});
					} catch (error) {
						if (isContractApiError(error)) {
							throw error;
						}
						throw new Error("Failed to update contract");
					}
				},
			),
		},
		actions: {
			loadContract: assign(({ event }) => {
				if (event.type !== "LOAD_CONTRACT") return {};
				return {
					id: event.data.id,
					contractState: event.data.contractState,
					formData: event.data.formData,
				};
			}),
			updateGeneralData: assign({
				formData: ({ context, event }) => {
					if (event.type !== "UPDATE_GENERAL") return context.formData;
					return {
						...context.formData,
						general: event.data,
					};
				},
			}),
			updateBuyerData: assign({
				formData: ({ context, event }) => {
					if (event.type !== "UPDATE_BUYER") return context.formData;
					return {
						...context.formData,
						buyer: event.data,
					};
				},
			}),
			updatePaymentData: assign({
				formData: ({ context, event }) => {
					if (event.type !== "UPDATE_PAYMENT") return context.formData;
					return {
						...context.formData,
						payment: event.data,
					};
				},
			}),
			updateFinancingData: assign({
				formData: ({ context, event }) => {
					if (event.type !== "UPDATE_FINANCING") return context.formData;
					return {
						...context.formData,
						financing: event.data,
					};
				},
			}),
			updateBeneficiaryData: assign({
				formData: ({ context, event }) => {
					if (event.type !== "UPDATE_BENEFICIARY") return context.formData;
					return {
						...context.formData,
						beneficiary: event.data,
					};
				},
			}),
			updateContractState: assign(({ event }) => {
				const eventType = event.type as keyof typeof CONTRACT_STATE_MAP;
				if (!(eventType in CONTRACT_STATE_MAP)) return {};
				return {
					contractState: CONTRACT_STATE_MAP[eventType],
				};
			}),
			handleError: assign({
				error: (_, event: { error: unknown }) => {
					if (isContractApiError(event.error)) {
						return event.error;
					}
					return null;
				},
			}),
		},
	}).createMachine({
		id: "contract",
		initial: "general",
		context: {
			id: null,
			contractState: "draft",
			formData: {
				general: null,
				buyer: null,
				payment: null,
				financing: null,
				beneficiary: null,
			},
			error: null,
		},
		on: {
			LOAD_CONTRACT: {
				actions: "loadContract",
				target: ".general",
			},
			UPDATE_GENERAL: {
				actions: "updateGeneralData",
			},
			UPDATE_FINANCING: {
				actions: "updateFinancingData",
			},
		},
		states: {
			general: {
				on: {
					GO_TO_PEOPLE: "people",
					GO_TO_BUYER: "buyer",
					GO_TO_PAYMENT: "payment",
					GO_TO_FINANCING: "financing",
					GO_TO_BENEFICIARY: "beneficiary",
					GO_TO_REVIEW: "review",
					UPDATE_GENERAL: {
						actions: "updateGeneralData",
					},
				},
			},
			people: {
				on: {
					GO_TO_GENERAL: "general",
					GO_TO_BUYER: "buyer",
					GO_TO_PAYMENT: "payment",
					GO_TO_FINANCING: "financing",
					GO_TO_BENEFICIARY: "beneficiary",
					GO_TO_REVIEW: "review",
					UPDATE_BUYER: {
						actions: "updateBuyerData",
					},
					UPDATE_BENEFICIARY: {
						actions: "updateBeneficiaryData",
					},
				},
			},
			buyer: {
				on: {
					GO_TO_GENERAL: "general",
					GO_TO_PEOPLE: "people",
					GO_TO_PAYMENT: "payment",
					GO_TO_FINANCING: "financing",
					GO_TO_BENEFICIARY: "beneficiary",
					GO_TO_REVIEW: "review",
					UPDATE_BUYER: {
						actions: assign({
							formData: ({ context, event }) => ({
								...context.formData,
								buyer: event.data,
							}),
						}),
					},
				},
			},
			payment: {
				on: {
					GO_TO_GENERAL: "general",
					GO_TO_PEOPLE: "people",
					GO_TO_BUYER: "buyer",
					GO_TO_FINANCING: "financing",
					GO_TO_BENEFICIARY: "beneficiary",
					GO_TO_REVIEW: "review",
					UPDATE_PAYMENT: {
						actions: assign({
							formData: ({ context, event }) => ({
								...context.formData,
								payment: event.data,
							}),
						}),
					},
				},
			},
			financing: {
				on: {
					GO_TO_GENERAL: "general",
					GO_TO_PEOPLE: "people",
					GO_TO_BUYER: "buyer",
					GO_TO_PAYMENT: "payment",
					GO_TO_BENEFICIARY: "beneficiary",
					GO_TO_REVIEW: "review",
					UPDATE_FINANCING: {
						actions: "updateFinancingData",
					},
				},
			},
			beneficiary: {
				on: {
					GO_TO_GENERAL: "general",
					GO_TO_PEOPLE: "people",
					GO_TO_BUYER: "buyer",
					GO_TO_PAYMENT: "payment",
					GO_TO_FINANCING: "financing",
					GO_TO_REVIEW: "review",
					UPDATE_BENEFICIARY: {
						actions: "updateBeneficiaryData",
					},
				},
			},
			review: {
				on: {
					GO_TO_GENERAL: "general",
					GO_TO_PEOPLE: "people",
					GO_TO_BUYER: "buyer",
					GO_TO_PAYMENT: "payment",
					GO_TO_FINANCING: "financing",
					GO_TO_BENEFICIARY: "beneficiary",
					EXECUTE: {
						actions: assign({
							contractState: () => CONTRACT_STATE_MAP.EXECUTE,
						}),
					},
					FINALIZE: {
						actions: assign({
							contractState: () => CONTRACT_STATE_MAP.FINALIZE,
						}),
					},
					VOID: {
						actions: assign({
							contractState: () => CONTRACT_STATE_MAP.VOID,
						}),
					},
				},
			},
		},
	});
};

export default createContractMachine;
