import { useCallback } from "react";
import { useMachine } from "@xstate/react";
import { generalFormMachine } from "../machines/generalFormMachine";
import type { GeneralFormValues } from "../types";

export function useGeneralForm(defaultValues?: Partial<GeneralFormValues>) {
	const [state, send] = useMachine(generalFormMachine, {
		input: {
			formData: {
				serviceDate: "",
				contractSignDate: "",
				prePrintedContractNumber: "",
				funeralDirector: "",
				atNeedType: "",
				contractType: "",
				campaign: "",
				...defaultValues,
			},
			isDirty: false,
		},
	});

	const handleFieldChange = useCallback(
		(field: keyof GeneralFormValues, value: string) => {
			send({ type: "CHANGE_FIELD", field, value });
		},
		[send],
	);

	const handleSubmit = useCallback(
		async (onSubmit: (values: GeneralFormValues) => Promise<void>) => {
			try {
				send({ type: "SUBMIT" });
				await onSubmit(state.context.formData);
				send({ type: "SUBMIT_SUCCESS" });
			} catch (error) {
				send({ type: "SUBMIT_ERROR" });
				throw error;
			}
		},
		[send, state],
	);

	const handleReset = useCallback(() => {
		send({ type: "RESET" });
	}, [send]);

	const setInitialData = useCallback(
		(data: GeneralFormValues) => {
			send({ type: "SET_INITIAL_DATA", data });
		},
		[send],
	);

	return {
		formData: state.context.formData,
		isDirty: state.context.isDirty,
		isSubmitting: state.matches("submitting"),
		handleFieldChange,
		handleSubmit,
		handleReset,
		setInitialData,
	};
}
