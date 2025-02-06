import { setup, assign, fromPromise } from "xstate";
import type {
	Contract,
	ContractContext,
	ContractEvent,
	ContractServices,
} from "../types/contract";
import { CONTRACT_STATE_MAP } from "../types/contract";
import { isContractApiError } from "../types/errors";

const createContractMachine = (services: ContractServices) => {
	return setup({
		types: {
			context: {} as ContractContext,
			events: {} as ContractEvent,
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
			updatePeopleData: assign({
				formData: ({ context, event }) => {
					if (event.type !== "UPDATE_PEOPLE") return context.formData;
					return {
						...context.formData,
						people: event.data,
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
					return undefined;
				},
			}),
		},
	}).createMachine({
		id: "contract",
		initial: "draft",
		context: () => ({
			id: null,
			contractState: "draft",
			formData: {
				general: null,
				people: null,
				payment: null,
			},
		}),
		states: {
			draft: {
				on: {
					LOAD_CONTRACT: {
						actions: ["loadContract"],
					},
					UPDATE_GENERAL: {
						actions: ["updateGeneralData"],
					},
					GO_TO_PEOPLE: "people",
					GO_TO_PAYMENT: "payment",
					GO_TO_REVIEW: "review",
					SAVE_CONTRACT: {
						target: "saving",
					},
				},
			},
			people: {
				on: {
					LOAD_CONTRACT: {
						actions: ["loadContract"],
					},
					UPDATE_PEOPLE: {
						actions: ["updatePeopleData"],
					},
					GO_TO_GENERAL: "draft",
					GO_TO_PAYMENT: "payment",
					GO_TO_REVIEW: "review",
					SAVE_CONTRACT: {
						target: "saving",
					},
				},
			},
			payment: {
				on: {
					LOAD_CONTRACT: {
						actions: ["loadContract"],
					},
					UPDATE_PAYMENT: {
						actions: ["updatePaymentData"],
					},
					GO_TO_GENERAL: "draft",
					GO_TO_PEOPLE: "people",
					GO_TO_REVIEW: "review",
					SAVE_CONTRACT: {
						target: "saving",
					},
				},
			},
			saving: {
				invoke: {
					src: "saveContract",
					input: ({ context }) => ({
						context,
					}),
					onDone: {
						target: "review",
						actions: assign({
							id: ({ event }) => event.output.id,
						}),
					},
					onError: {
						target: "error",
						actions: {
							type: "handleError",
							params: ({ event }) => ({
								error: event.error,
							}),
						},
					},
				},
			},
			review: {
				on: {
					LOAD_CONTRACT: {
						actions: ["loadContract"],
					},
					GO_TO_GENERAL: "draft",
					GO_TO_PEOPLE: "people",
					GO_TO_PAYMENT: "payment",
					EXECUTE: {
						target: "executing",
						actions: ["updateContractState"],
					},
				},
			},
			executing: {
				invoke: {
					src: "updateContract",
					input: ({ context }) => ({
						context,
					}),
					onDone: "executed",
					onError: {
						target: "error",
						actions: {
							type: "handleError",
							params: ({ event }) => ({
								error: event.error,
							}),
						},
					},
				},
			},
			executed: {
				on: {
					LOAD_CONTRACT: {
						actions: ["loadContract"],
					},
					FINALIZE: {
						target: "finalizing",
						actions: ["updateContractState"],
					},
					VOID: {
						target: "voiding",
						actions: ["updateContractState"],
					},
				},
			},
			finalizing: {
				invoke: {
					src: "updateContract",
					input: ({ context }) => ({
						context,
					}),
					onDone: "finalized",
					onError: {
						target: "error",
						actions: {
							type: "handleError",
							params: ({ event }) => ({
								error: event.error,
							}),
						},
					},
				},
			},
			voiding: {
				invoke: {
					src: "updateContract",
					input: ({ context }) => ({
						context,
					}),
					onDone: "void",
					onError: {
						target: "error",
						actions: {
							type: "handleError",
							params: ({ event }) => ({
								error: event.error,
							}),
						},
					},
				},
			},
			error: {
				on: {
					GO_TO_GENERAL: "draft",
					GO_TO_PEOPLE: "people",
					GO_TO_PAYMENT: "payment",
					GO_TO_REVIEW: "review",
				},
			},
			finalized: {
				type: "final",
			},
			void: {
				type: "final",
			},
		},
	});
};

export default createContractMachine;
