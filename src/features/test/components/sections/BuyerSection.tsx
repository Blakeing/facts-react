import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "@xstate/react";
import { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";
import {
	FormProvider,
	type Resolver,
	type UseFormReturn,
	useForm,
	useFormState,
} from "react-hook-form";
import type { ActorRefFrom } from "xstate";
import { BuyerForm } from "../../forms/buyer-form";
import {
	type BuyerFormValues,
	buyerFormSchema,
} from "../../forms/schemas/buyer-form";
import type createContractMachine from "../../machines/contractMachine";
import type { BuyerData } from "../../types/buyer";
import type { ContractContext } from "../../types/contract";

export interface BuyerSectionRef {
	form: UseFormReturn<BuyerFormValues>;
	isDirty: boolean;
	save: () => void;
}

type BuyerSectionProps = {
	actor: ActorRefFrom<ReturnType<typeof createContractMachine>>;
	onDirtyChange?: (isDirty: boolean) => void;
};

const defaultBuyerData: BuyerFormValues = {
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

export const BuyerSection = forwardRef<BuyerSectionRef, BuyerSectionProps>(
	({ actor, onDirtyChange }, ref) => {
		// Get initial data from XState
		const buyerData = useSelector(
			actor,
			(state: { context: ContractContext }) => {
				return state.context.draftData.buyer ?? defaultBuyerData;
			},
		);

		const contractState = useSelector(
			actor,
			(state: { context: ContractContext }) => state.context.contractState,
		);

		// Initialize form with RHF
		const form = useForm<BuyerFormValues>({
			defaultValues: buyerData,
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
				type: "UPDATE_BUYER",
				data: data as BuyerData,
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
				const isDifferent =
					JSON.stringify(currentValues) !== JSON.stringify(buyerData);
				if (isDifferent) {
					form.reset(buyerData);
				}
			}
		}, [form, buyerData, formState.isDirty]);

		// Notify parent of dirty state changes
		useEffect(() => {
			onDirtyChange?.(formState.isDirty);
		}, [formState.isDirty, onDirtyChange]);

		return (
			<FormProvider {...form}>
				<BuyerForm onSubmit={saveToXState} />
			</FormProvider>
		);
	},
);

BuyerSection.displayName = "BuyerSection";
