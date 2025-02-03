import { assign, setup } from "xstate";
import type { GeneralFormValues } from "../types";

export type GeneralFormContext = {
	formData: GeneralFormValues;
	error?: string;
	isDirty: boolean;
};

type GeneralFormEvent =
	| { type: "CHANGE_FIELD"; field: keyof GeneralFormValues; value: string }
	| { type: "SUBMIT" }
	| { type: "SUBMIT_SUCCESS" }
	| { type: "SUBMIT_ERROR" }
	| { type: "RESET" }
	| { type: "SET_INITIAL_DATA"; data: GeneralFormValues };

const initialFormData: GeneralFormValues = {
	serviceDate: "",
	contractSignDate: "",
	prePrintedContractNumber: "",
	funeralDirector: "",
	atNeedType: "",
	contractType: "",
	campaign: "",
};

export const generalFormMachine = setup({
	types: {} as {
		context: GeneralFormContext;
		events: GeneralFormEvent;
	},
	actions: {
		updateField: assign({
			formData: ({ context, event }) =>
				event.type === "CHANGE_FIELD"
					? { ...context.formData, [event.field]: event.value }
					: context.formData,
			isDirty: () => true,
		}),
		setData: assign({
			formData: ({ event }) =>
				event.type === "SET_INITIAL_DATA" ? event.data : initialFormData,
			isDirty: () => false,
		}),
		resetForm: assign({
			formData: ({ context }) => context.formData,
			isDirty: () => false,
		}),
		clearError: assign({
			error: () => undefined,
		}),
	},
}).createMachine({
	id: "generalForm",
	initial: "idle",
	context: {
		formData: initialFormData,
		isDirty: false,
	},
	states: {
		idle: {
			on: {
				CHANGE_FIELD: {
					actions: "updateField",
				},
				SET_INITIAL_DATA: {
					actions: "setData",
				},
				SUBMIT: {
					target: "submitting",
					guard: ({ context }) => {
						const { formData } = context;
						return (
							!!formData.serviceDate &&
							!!formData.contractSignDate &&
							!!formData.funeralDirector &&
							!!formData.atNeedType &&
							!!formData.contractType
						);
					},
				},
				RESET: {
					actions: "resetForm",
				},
			},
		},
		submitting: {
			on: {
				SUBMIT_SUCCESS: {
					target: "idle",
					actions: ["clearError", "resetForm"],
				},
				SUBMIT_ERROR: {
					target: "idle",
				},
				SET_INITIAL_DATA: {
					target: "idle",
					actions: "setData",
				},
			},
		},
	},
});
