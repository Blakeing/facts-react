import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "@xstate/react";
import { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";
import {
	FormProvider,
	type UseFormReturn,
	useForm,
	useFormState,
} from "react-hook-form";
import type { ActorRefFrom } from "xstate";
import { GeneralForm } from "../../forms/general-form";
import type { GeneralFormValues } from "../../forms/schemas/general-form";
import type createContractMachine from "../../machines/contractMachine";
import type { GeneralData } from "../../types/general";
import type { ContractContext } from "../../types/contract";
import isEqual from "lodash/isEqual";

export interface GeneralSectionRef {
	form: UseFormReturn<GeneralFormValues>;
	isDirty: boolean;
	save: () => void;
}

type GeneralSectionProps = {
	actor: ActorRefFrom<ReturnType<typeof createContractMachine>>;
	onDirtyChange?: (isDirty: boolean) => void;
};

const defaultGeneralData: GeneralFormValues = {
	prePrintedContractNumber: "",
	serviceDate: new Date(),
	contractSignDate: new Date(),
	funeralDirector: "",
	atNeedType: "",
	contractType: "",
	campaign: "",
};

const selectGeneralData = (state: { context: ContractContext }) =>
	state.context.draftData.general ?? defaultGeneralData;

const compareGeneralData = (prev: GeneralFormValues, next: GeneralFormValues) =>
	isEqual(prev, next);

export const GeneralSection = forwardRef<
	GeneralSectionRef,
	GeneralSectionProps
>(({ actor, onDirtyChange }, ref) => {
	// Get initial data from XState
	const generalData = useSelector(actor, selectGeneralData, compareGeneralData);

	// Initialize form with RHF
	const form = useForm<GeneralFormValues>({
		defaultValues: generalData,
		mode: "onSubmit", // Only validate on submit
	});

	// Track form state for dirty tracking
	const formState = useFormState({
		control: form.control,
	});

	// Function to save form data to XState
	const saveToXState = useCallback(() => {
		const data = form.getValues();
		actor.send({
			type: "UPDATE_GENERAL",
			data: data as GeneralData,
			isValid: true, // Always valid in draft mode
		});
	}, [form, actor]);

	// Expose form methods, dirty state, and save function to parent
	useImperativeHandle(
		ref,
		() => ({
			form,
			isDirty: formState.isDirty,
			save: saveToXState,
		}),
		[form, formState.isDirty, saveToXState],
	);

	// Reset form when external data changes and form isn't dirty
	useEffect(() => {
		if (!formState.isDirty) {
			// Only reset if the data is actually different
			const currentValues = form.getValues();
			const isDifferent = !isEqual(currentValues, generalData);
			if (isDifferent) {
				form.reset(generalData);
			}
		}
	}, [form, generalData, formState.isDirty]);

	// Notify parent of dirty state changes
	useEffect(() => {
		onDirtyChange?.(formState.isDirty);
	}, [formState.isDirty, onDirtyChange]);

	return (
		<Card>
			<CardContent>
				<FormProvider {...form}>
					<GeneralForm
						actor={actor}
						defaultValues={generalData}
						onDirtyChange={onDirtyChange || (() => {})}
					/>
				</FormProvider>
			</CardContent>
		</Card>
	);
});

GeneralSection.displayName = "GeneralSection";

export default GeneralSection;
