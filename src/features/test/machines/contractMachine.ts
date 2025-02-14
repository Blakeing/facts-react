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
			upsertContract: fromPromise<
				Contract,
				{ context: ContractContext; isDraft: boolean }
			>(async ({ input: { context, isDraft } }) => {
				const contractData = {
					contractState: isDraft ? "draft" : context.contractState,
					formData: isDraft
						? context.draftData
						: context.finalizedData || context.draftData,
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
			}),
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
				draftData: (
					_,
					params: {
						id: string;
						contractState: ContractState;
						formData: FormData;
					},
				) => params.formData,
				finalizedData: (
					_,
					params: {
						id: string;
						contractState: ContractState;
						formData: FormData;
					},
				) => (params.contractState !== "draft" ? params.formData : null),
				isDirty: () => false,
				validSections: () => ({
					general: false,
					buyer: false,
					payment: false,
					financing: false,
					beneficiary: false,
				}),
			}),
			updateFormData: assign({
				draftData: (
					{ context },
					params: { section: keyof FormData; data: FormData[keyof FormData] },
				) => ({
					...context.draftData,
					[params.section]: params.data,
				}),
				isDirty: () => true,
				validSections: ({ context, event }) => {
					if ("isValid" in event) {
						return {
							...context.validSections,
							[event.type.toLowerCase().replace("update_", "")]: event.isValid,
						};
					}
					return context.validSections;
				},
			}),
			updateContractState: assign({
				contractState: (
					_,
					params: { state: keyof typeof CONTRACT_STATE_MAP },
				) => CONTRACT_STATE_MAP[params.state],
				finalizedData: (
					{ context },
					params: { state: keyof typeof CONTRACT_STATE_MAP },
				) => {
					if (CONTRACT_STATE_MAP[params.state] !== "draft") {
						return context.draftData;
					}
					return null;
				},
				isDirty: () => false,
			}),
			handleError: assign({
				error: (_, params: { error: ContractApiError | null }) => params.error,
			}),
			clearError: assign({
				error: () => null,
			}),
			handleSaveSuccess: assign({
				id: (_, params: { id: string }) => params.id,
				isDirty: () => false,
			}),
			revertToDraft: assign({
				contractState: () => "draft" as ContractState,
				draftData: ({ context }) => context.finalizedData || context.draftData,
				finalizedData: () => null,
				isDirty: () => false,
			}),
		},
	}).createMachine({
		id: "contract",
		initial: "general",
		context: {
			id: null,
			contractState: "draft",
			draftData: {
				general: null,
				buyer: null,
				payment: null,
				financing: null,
				beneficiary: null,
			},
			finalizedData: null,
			error: null,
			isDirty: false,
			validSections: {
				general: false,
				buyer: false,
				payment: false,
				financing: false,
				beneficiary: false,
			},
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
			SAVE_DRAFT: {
				target: ".savingDraft",
			},
			SAVE_FINALIZED: {
				target: ".savingFinalized",
				guard: ({ context }) =>
					Object.values(context.validSections).every(Boolean),
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
						guard: ({ context }) =>
							Object.values(context.validSections).every(Boolean),
					},
					FINALIZE: {
						actions: {
							type: "updateContractState",
							params: { state: "FINALIZE" },
						},
						guard: ({ context }) =>
							Object.values(context.validSections).every(Boolean),
					},
					VOID: {
						actions: {
							type: "updateContractState",
							params: { state: "VOID" },
						},
					},
				},
			},
			savingDraft: {
				entry: "clearError",
				invoke: {
					src: "upsertContract",
					input: ({ context }) => ({ context, isDraft: true }),
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
			savingFinalized: {
				entry: "clearError",
				invoke: {
					src: "upsertContract",
					input: ({ context }) => ({ context, isDraft: false }),
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
					SAVE_DRAFT: {
						target: "savingDraft",
					},
					SAVE_FINALIZED: {
						target: "savingFinalized",
						guard: ({ context }) =>
							Object.values(context.validSections).every(Boolean),
					},
					...navTransitions,
				},
			},
		},
	});
};

export default createContractMachine;
