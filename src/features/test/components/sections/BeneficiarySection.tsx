import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "@xstate/react";
import { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";
import {
	type UseFormReturn,
	useForm,
	useFormState,
	FormProvider,
} from "react-hook-form";
import type { ActorRefFrom } from "xstate";
import { BeneficiaryForm } from "../../forms/beneficiary-form";
import {
	type BeneficiaryFormValues,
	beneficiaryFormSchema,
} from "../../forms/schemas/beneficiary-form";
import type createContractMachine from "../../machines/contractMachine";
import type { BeneficiaryData } from "../../types/contract";
import type { ContractContext } from "../../types/contract";
import isEqual from "lodash/isEqual";
import { Card, CardContent } from "@/components/ui/card";

export interface BeneficiaryRef {
	form: UseFormReturn<BeneficiaryFormValues>;
	isDirty: boolean;
	save: () => void;
}

interface BeneficiarySectionProps {
	actor: ActorRefFrom<ReturnType<typeof createContractMachine>>;
	onDirtyChange?: (isDirty: boolean) => void;
}

const defaultBeneficiaryData: BeneficiaryFormValues = {
	name: {
		first: "",
		last: "",
	},
	physicalAddress: {
		street: "",
		city: "",
		state: "",
		postalCode: "",
		country: "United States",
	},
	mailingAddressSameAsPhysical: true,
	identification: {
		stateIdNumber: "",
		issuer: "",
	},
	dates: {
		isDeceased: false,
	},
	isVeteran: false,
	phones: [{ number: "", type: "Mobile", isPreferred: true }],
	emails: [{ address: "", isPreferred: true }],
	optOutOfFutureMarketing: false,
};

const selectBeneficiaryData = (state: { context: ContractContext }) =>
	state.context.draftData.beneficiary ?? defaultBeneficiaryData;

const compareBeneficiaryData = (
	prev: BeneficiaryFormValues,
	next: BeneficiaryFormValues,
) => isEqual(prev, next);

export const BeneficiarySection = forwardRef<
	BeneficiaryRef,
	BeneficiarySectionProps
>(({ actor, onDirtyChange }, ref) => {
	// Get initial data from XState
	const beneficiaryData = useSelector(
		actor,
		selectBeneficiaryData,
		compareBeneficiaryData,
	);

	// Initialize form with RHF
	const form = useForm<BeneficiaryFormValues>({
		resolver: zodResolver(beneficiaryFormSchema),
		defaultValues: beneficiaryData,
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
			type: "UPDATE_BENEFICIARY",
			data: data as BeneficiaryData,
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
			const isDifferent = !isEqual(currentValues, beneficiaryData);
			if (isDifferent) {
				form.reset(beneficiaryData);
			}
		}
	}, [form, beneficiaryData, formState.isDirty]);

	// Notify parent of dirty state changes
	useEffect(() => {
		onDirtyChange?.(formState.isDirty);
	}, [formState.isDirty, onDirtyChange]);

	return (
		<Card>
			<CardContent>
				<FormProvider {...form}>
					<BeneficiaryForm
						onSubmit={saveToXState}
						onDirtyChange={onDirtyChange || undefined}
					/>
				</FormProvider>
			</CardContent>
		</Card>
	);
});

BeneficiarySection.displayName = "BeneficiarySection";
