import { useCallback, useRef } from "react";
import { useMachine } from "@xstate/react";
import { formMachine } from "./form-machine";
import type { PeopleFormType } from "./shared-form";

interface UseFormMachineProps {
	onSubmit: (data: PeopleFormType) => Promise<void>;
	onSuccess?: () => void;
}

export function useFormMachine({ onSubmit, onSuccess }: UseFormMachineProps) {
	// Keep track of machine status
	const isMachineActive = useRef(true);

	const [state, send] = useMachine(formMachine, {
		services: {
			submitForm: async (context) => {
				await onSubmit(context.formData);
			},
		},
		actions: {
			onSuccess: () => {
				onSuccess?.();
				// Mark machine as inactive after success
				isMachineActive.current = false;
			},
		},
	});

	const currentStep = state.context.currentStep;
	const formData = state.context.formData;
	const isValid = state.context.isValid;

	// Safe send function that checks if machine is active
	const safeSend = useCallback(
		(event: any) => {
			if (isMachineActive.current) {
				send(event);
			}
		},
		[send],
	);

	const updateForm = useCallback(
		(data: Partial<PeopleFormType>) => {
			safeSend({ type: "UPDATE_FORM", data });
		},
		[safeSend],
	);

	const validateStep = useCallback(
		(step: string, isValid: boolean) => {
			safeSend({ type: "VALIDATE_STEP", step, isValid });
		},
		[safeSend],
	);

	const nextStep = useCallback(() => {
		safeSend({ type: "NEXT" });
	}, [safeSend]);

	const prevStep = useCallback(() => {
		safeSend({ type: "PREV" });
	}, [safeSend]);

	const goToStep = useCallback(
		(step: string) => {
			safeSend({ type: "GO_TO", step });
		},
		[safeSend],
	);

	const submitForm = useCallback(() => {
		safeSend({ type: "SUBMIT" });
	}, [safeSend]);

	const resetForm = useCallback(() => {
		safeSend({ type: "RESET" });
		// Reset machine active status
		isMachineActive.current = true;
	}, [safeSend]);

	return {
		currentStep,
		formData,
		isValid,
		updateForm,
		validateStep,
		nextStep,
		prevStep,
		goToStep,
		submitForm,
		resetForm,
		isSubmitting: state.matches("submitting"),
		isSuccess: state.matches("success"),
		isError: state.matches("error"),
	};
}
