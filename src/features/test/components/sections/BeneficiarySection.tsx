import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "@xstate/react";
import { produce } from "immer";
import { forwardRef, memo, useCallback, useImperativeHandle } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm, useFormState } from "react-hook-form";
import type { ActorRefFrom } from "xstate";
import { BeneficiaryForm } from "../../forms/beneficiary-form";
import {
	type BeneficiaryFormValues,
	beneficiaryFormSchema,
} from "../../forms/schemas/beneficiary-form";
import type createContractMachine from "../../machines/contractMachine";
import type { BeneficiaryData } from "../../types/contract";
import type { ContractContext } from "../../types/contract";

export interface BeneficiaryRef {
	form: UseFormReturn<BeneficiaryFormValues>;
	isDirty: boolean;
	save: () => void;
}

interface BeneficiarySectionProps {
	actor: ActorRefFrom<ReturnType<typeof createContractMachine>>;
	onSubmit?: (data: BeneficiaryData) => void;
}

const defaultBeneficiaryData: BeneficiaryData = {
	name: {
		first: "",
		last: "",
		prefix: undefined,
		middle: undefined,
		suffix: undefined,
		companyName: undefined,
		nickname: undefined,
		maiden: undefined,
		gender: undefined,
	},
	physicalAddress: {
		street: "",
		city: "",
		state: "",
		postalCode: "",
		country: "United States",
	},
	mailingAddressSameAsPhysical: true,
	mailingAddress: undefined,
	identification: {
		stateIdNumber: "",
		issuer: "",
	},
	dates: {
		dateOfBirth: undefined,
		dateOfDeath: undefined,
		isDeceased: false,
	},
	role: undefined,
	ethnicity: undefined,
	race: undefined,
	isVeteran: false,
	phones: [{ number: "", type: "Mobile", isPreferred: true }],
	emails: [{ address: "", isPreferred: true }],
	optOutOfFutureMarketing: false,
};

const beneficiaryDataSelector = (state: { context: ContractContext }) =>
	state.context.draftData.beneficiary || defaultBeneficiaryData;

export const BeneficiarySection = forwardRef<
	BeneficiaryRef,
	BeneficiarySectionProps
>(({ actor, onSubmit }, ref) => {
	const send = actor.send;
	const formData = useSelector(actor, beneficiaryDataSelector);

	const form = useForm<BeneficiaryFormValues>({
		resolver: zodResolver(beneficiaryFormSchema),
		defaultValues: formData,
		mode: "onChange",
	});

	const formState = useFormState({
		control: form.control,
	});

	const saveToXState = useCallback(() => {
		const data = form.getValues();
		const beneficiaryData = produce(data, (draft) => draft) as BeneficiaryData;
		send({ type: "UPDATE_BENEFICIARY", data: beneficiaryData });
		if (onSubmit) {
			onSubmit(beneficiaryData);
		}
	}, [form, send, onSubmit]);

	useImperativeHandle(
		ref,
		() => ({
			form,
			isDirty: formState.isDirty,
			save: saveToXState,
		}),
		[form, formState.isDirty, saveToXState],
	);

	return <BeneficiaryForm defaultValues={formData} onSubmit={saveToXState} />;
});

BeneficiarySection.displayName = "BeneficiarySection";
