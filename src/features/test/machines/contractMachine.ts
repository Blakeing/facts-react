import { assign, fromPromise, setup } from "xstate";
import type { DoneActorEvent, ErrorActorEvent } from "xstate";
import type {
	Contract,
	ContractContext,
	ContractEvent,
	ContractServices,
	ContractState,
	FormData,
} from "../types/contract";
import { CONTRACT_STATE_MAP } from "../types/contract";
import { isContractApiError } from "../types/errors";
import type { ContractApiError } from "../types/errors";

type MachineEvents = ContractEvent | DoneActorEvent<Contract> | ErrorActorEvent;

const createContractMachine = (services: ContractServices) => {
	const navTransitions = {
		GO_TO_GENERAL: "general",
		GO_TO_PEOPLE: "people",
		GO_TO_BUYER: "buyer",
		GO_TO_PAYMENT: "payment",
		GO_TO_FINANCING: "financing",
		GO_TO_BENEFICIARY: "beneficiary",
		GO_TO_REVIEW: "review",
	};

	return setup({
		types: {
			context: {} as ContractContext,
			events: {} as MachineEvents,
		},
		actors: {
			upsertContract: fromPromise<Contract, { context: ContractContext }>(
				async ({ input: { context } }) => {
					const contractData = {
						contractState: context.contractState,
						formData: context.formData,
					};

					try {
						if (context.id) {
							return await services.mutations.updateMutation.mutateAsync({
								...contractData,
								id: context.id,
							});
						}
						return await services.mutations.createMutation.mutateAsync(
							contractData,
						);
					} catch (error) {
						if (isContractApiError(error)) {
							throw error;
						}
						throw new Error("Failed to save contract");
					}
				},
			),
		},
		actions: {
			loadContract: assign({
				id: (
					_,
					params: {
						id: string;
						contractState: ContractState;
						formData: FormData;
					},
				) => params.id,
				contractState: (
					_,
					params: {
						id: string;
						contractState: ContractState;
						formData: FormData;
					},
				) => params.contractState,
				formData: (
					_,
					params: {
						id: string;
						contractState: ContractState;
						formData: FormData;
					},
				) => params.formData,
			}),
			updateFormData: assign({
				formData: (
					{ context },
					params: { section: keyof FormData; data: FormData[keyof FormData] },
				) => ({
					...context.formData,
					[params.section]: params.data,
				}),
			}),
			updateContractState: assign({
				contractState: (
					_,
					params: { state: keyof typeof CONTRACT_STATE_MAP },
				) => CONTRACT_STATE_MAP[params.state],
			}),
			handleError: assign({
				error: (_, params: { error: ContractApiError | null }) => params.error,
			}),
			clearError: assign({
				error: () => null,
			}),
			handleSaveSuccess: assign({
				id: (_, params: { id: string }) => params.id,
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
				actions: {
					type: "loadContract",
					params: ({ event }) => ({
						id: event.data.id,
						contractState: event.data.contractState,
						formData: event.data.formData,
					}),
				},
				target: ".general",
			},
			UPDATE_GENERAL: {
				actions: {
					type: "updateFormData",
					params: ({ event }) => ({
						section: "general",
						data: event.data,
					}),
				},
			},
			UPDATE_BUYER: {
				actions: {
					type: "updateFormData",
					params: ({ event }) => ({
						section: "buyer",
						data: event.data,
					}),
				},
			},
			UPDATE_PAYMENT: {
				actions: {
					type: "updateFormData",
					params: ({ event }) => ({
						section: "payment",
						data: event.data,
					}),
				},
			},
			UPDATE_FINANCING: {
				actions: {
					type: "updateFormData",
					params: ({ event }) => ({
						section: "financing",
						data: event.data,
					}),
				},
			},
			UPDATE_BENEFICIARY: {
				actions: {
					type: "updateFormData",
					params: ({ event }) => ({
						section: "beneficiary",
						data: event.data,
					}),
				},
			},
			SAVE_CONTRACT: {
				target: ".saving",
			},
		},
		states: {
			general: {
				on: navTransitions,
			},
			people: {
				on: navTransitions,
			},
			buyer: {
				on: navTransitions,
			},
			payment: {
				on: navTransitions,
			},
			financing: {
				on: navTransitions,
			},
			beneficiary: {
				on: navTransitions,
			},
			review: {
				on: {
					...navTransitions,
					EXECUTE: {
						actions: {
							type: "updateContractState",
							params: { state: "EXECUTE" },
						},
					},
					FINALIZE: {
						actions: {
							type: "updateContractState",
							params: { state: "FINALIZE" },
						},
					},
					VOID: {
						actions: {
							type: "updateContractState",
							params: { state: "VOID" },
						},
					},
				},
			},
			saving: {
				entry: "clearError",
				invoke: {
					src: "upsertContract",
					input: ({ context }) => ({ context }),
					onDone: {
						target: "general",
						actions: {
							type: "handleSaveSuccess",
							params: ({ event }) => ({
								id: event.output.id,
							}),
						},
					},
					onError: {
						target: "error",
						actions: {
							type: "handleError",
							params: ({ event }) => ({
								error: isContractApiError(event.error) ? event.error : null,
							}),
						},
					},
				},
			},
			error: {
				on: {
					SAVE_CONTRACT: {
						target: "saving",
					},
					...navTransitions,
				},
			},
		},
	});
};

export default createContractMachine;
