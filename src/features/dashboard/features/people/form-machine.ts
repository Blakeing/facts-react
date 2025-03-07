import { createMachine, assign } from "xstate";
import type { PeopleFormType } from "./shared-form";

// Define default values for form data
const defaultFormData: PeopleFormType = {
	fullName: "",
	email: "",
	phone: "",
	address: {
		line1: "",
		line2: "",
		city: "",
		state: "",
		zip: "",
	},
	emergencyContact: {
		fullName: "",
		phone: "",
	},
};

// Default validation state
const defaultValidationState = {
	personalInfo: false,
	address: false,
	emergencyContact: false,
};

// Define the context type for our machine
export interface FormContext {
	formData: PeopleFormType;
	currentStep: string;
	isValid: {
		personalInfo: boolean;
		address: boolean;
		emergencyContact: boolean;
	};
}

// Define the events that can be sent to the machine
export type FormEvent =
	| { type: "NEXT" }
	| { type: "PREV" }
	| { type: "GO_TO"; step: string }
	| { type: "UPDATE_FORM"; data: Partial<PeopleFormType> }
	| { type: "VALIDATE_STEP"; step: string; isValid: boolean }
	| { type: "SUBMIT" }
	| { type: "RESET" };

// Helper function to safely access validation state
const safeIsValid = (
	context: any,
	step: keyof typeof defaultValidationState,
) => {
	return context?.isValid?.[step] ?? false;
};

// Create the form machine
export const formMachine = createMachine({
	id: "peopleForm",
	initial: "personalInfo",
	context: {
		formData: defaultFormData,
		currentStep: "personalInfo",
		isValid: defaultValidationState,
	},
	states: {
		personalInfo: {
			entry: assign({
				currentStep: "personalInfo",
			}),
			on: {
				NEXT: {
					target: "address",
					// Allow free navigation between tabs
				},
				GO_TO: [
					{
						target: "address",
						guard: ({ event }) =>
							event.type === "GO_TO" && event.step === "address",
					},
					{
						target: "emergencyContact",
						guard: ({ event }) =>
							event.type === "GO_TO" && event.step === "emergencyContact",
					},
				],
				RESET: {
					actions: [
						assign({
							formData: () => ({ ...defaultFormData }),
							isValid: () => ({ ...defaultValidationState }),
							currentStep: () => "personalInfo",
						}),
					],
				},
			},
		},
		address: {
			entry: assign({
				currentStep: "address",
			}),
			on: {
				NEXT: {
					target: "emergencyContact",
					// Allow free navigation between tabs
				},
				PREV: "personalInfo",
				GO_TO: [
					{
						target: "personalInfo",
						guard: ({ event }) =>
							event.type === "GO_TO" && event.step === "personalInfo",
					},
					{
						target: "emergencyContact",
						guard: ({ event }) =>
							event.type === "GO_TO" && event.step === "emergencyContact",
					},
				],
				RESET: {
					target: "personalInfo",
					actions: [
						assign({
							formData: () => ({ ...defaultFormData }),
							isValid: () => ({ ...defaultValidationState }),
						}),
					],
				},
			},
		},
		emergencyContact: {
			entry: assign({
				currentStep: "emergencyContact",
			}),
			on: {
				PREV: "address",
				GO_TO: [
					{
						target: "personalInfo",
						guard: ({ event }) =>
							event.type === "GO_TO" && event.step === "personalInfo",
					},
					{
						target: "address",
						guard: ({ event }) =>
							event.type === "GO_TO" && event.step === "address",
					},
				],
				SUBMIT: {
					target: "submitting",
					// Remove the guard condition to allow submission regardless of validation state
				},
				RESET: {
					target: "personalInfo",
					actions: [
						assign({
							formData: () => ({ ...defaultFormData }),
							isValid: () => ({ ...defaultValidationState }),
						}),
					],
				},
			},
		},
		submitting: {
			invoke: {
				src: "submitForm",
				onDone: "success",
				onError: "error",
			},
			on: {
				RESET: {
					target: "personalInfo",
					actions: [
						assign({
							formData: () => ({ ...defaultFormData }),
							isValid: () => ({ ...defaultValidationState }),
						}),
					],
				},
			},
		},
		success: {
			type: "final",
			entry: "onSuccess",
			on: {
				RESET: {
					target: "personalInfo",
					actions: [
						assign({
							formData: () => ({ ...defaultFormData }),
							isValid: () => ({ ...defaultValidationState }),
						}),
					],
				},
			},
		},
		error: {
			on: {
				RETRY: "submitting",
				GO_TO: [
					{
						target: "personalInfo",
						guard: ({ event }) =>
							event.type === "GO_TO" && event.step === "personalInfo",
					},
					{
						target: "address",
						guard: ({ event }) =>
							event.type === "GO_TO" && event.step === "address",
					},
					{
						target: "emergencyContact",
						guard: ({ event }) =>
							event.type === "GO_TO" && event.step === "emergencyContact",
					},
				],
				RESET: {
					target: "personalInfo",
					actions: [
						assign({
							formData: () => ({ ...defaultFormData }),
							isValid: () => ({ ...defaultValidationState }),
						}),
					],
				},
			},
		},
	},
	on: {
		UPDATE_FORM: {
			actions: [
				assign({
					formData: (context, event) => {
						if (event && event.type === "UPDATE_FORM" && "data" in event) {
							return {
								...(context.formData || defaultFormData),
								...event.data,
							};
						}
						return context.formData || defaultFormData;
					},
				}),
			],
		},
		VALIDATE_STEP: {
			actions: [
				assign({
					isValid: (context, event) => {
						if (
							event &&
							event.type === "VALIDATE_STEP" &&
							"step" in event &&
							"isValid" in event
						) {
							return {
								...(context.isValid || defaultValidationState),
								[event.step]: event.isValid,
							};
						}
						return context.isValid || defaultValidationState;
					},
				}),
			],
		},
	},
});
