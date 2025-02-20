import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "@xstate/react";
import { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";
import {
	FormProvider,
	type UseFormReturn,
	useForm,
	useFormState,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ActorRefFrom } from "xstate";
import { FinancingForm } from "../../forms/financing-form";
import {
	type FinancingFormValues,
	defaultFinancingFormValues,
	financingFormSchema,
} from "../../forms/schemas/financing-form";
import type createContractMachine from "../../machines/contractMachine";
import type { ContractContext, FinancingData } from "../../types/contract";
import isEqual from "lodash/isEqual";

export interface FinancingSectionRef {
	form: UseFormReturn<FinancingFormValues>;
	isDirty: boolean;
	save: () => void;
}

type FinancingSectionProps = {
	actor: ActorRefFrom<ReturnType<typeof createContractMachine>>;
	onDirtyChange?: (isDirty: boolean) => void;
};

const selectFinancingData = (state: { context: ContractContext }) =>
	state.context.draftData.financing ?? defaultFinancingFormValues;

const compareFinancingData = (
	prev: FinancingFormValues,
	next: FinancingFormValues,
) => isEqual(prev, next);

export const FinancingSection = forwardRef<
	FinancingSectionRef,
	FinancingSectionProps
>(({ actor, onDirtyChange }, ref) => {
	// Get initial data from XState
	const financingData = useSelector(
		actor,
		selectFinancingData,
		compareFinancingData,
	);

	// Initialize form with RHF
	const form = useForm<FinancingFormValues>({
		resolver: zodResolver(financingFormSchema),
		defaultValues: financingData,
		mode: "onSubmit",
	});

	// Track form state for dirty tracking
	const formState = useFormState({
		control: form.control,
	});

	// Function to save form data to XState
	const saveToXState = useCallback(() => {
		const data = form.getValues();
		actor.send({
			type: "UPDATE_FINANCING",
			data: data as FinancingData,
			isValid: true,
		});
	}, [form, actor]);

	// Handle form submission
	const handleSubmit = useCallback(
		(data: FinancingFormValues) => {
			// Save to XState
			actor.send({
				type: "UPDATE_FINANCING",
				data: data as FinancingData,
				isValid: true,
			});
		},
		[actor],
	);

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
			const currentValues = form.getValues();
			const isDifferent = !isEqual(currentValues, financingData);
			if (isDifferent) {
				form.reset(financingData);
			}
		}
	}, [form, financingData, formState.isDirty]);

	// Notify parent of dirty state changes
	useEffect(() => {
		onDirtyChange?.(formState.isDirty);
	}, [formState.isDirty, onDirtyChange]);

	return (
		<Card>
			<CardContent>
				<FormProvider {...form}>
					<FinancingForm
						onSubmit={handleSubmit}
						onDirtyChange={onDirtyChange}
					/>
				</FormProvider>
			</CardContent>
		</Card>
	);
});

FinancingSection.displayName = "FinancingSection";
