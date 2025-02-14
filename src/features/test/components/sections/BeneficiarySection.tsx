import { memo } from "react";
import type { ActorRefFrom } from "xstate";
import { useSelector } from "@xstate/react";
import type createContractMachine from "../../machines/contractMachine";
import { BeneficiaryForm } from "../../forms/beneficiary-form";
import {
	beneficiaryFormSchema,
	type BeneficiaryFormValues,
} from "../../forms/schemas/beneficiary-form";
import type { BeneficiaryData } from "../../types/contract";
import { produce } from "immer";

type BeneficiarySectionProps = {
	actor: ActorRefFrom<ReturnType<typeof createContractMachine>>;
	onSubmit?: (data: BeneficiaryData) => void;
};

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

const beneficiaryDataSelector = (state: {
	context: { formData: { beneficiary: BeneficiaryData | null } };
}) => {
	const beneficiaryData = state.context.formData.beneficiary;
	if (!beneficiaryData)
		return produce(defaultBeneficiaryData, (draft) => draft);

	// Parse the beneficiary data through our schema to ensure it matches our form values type
	const result = beneficiaryFormSchema.safeParse(beneficiaryData);
	// Create a mutable copy of the data
	return produce(
		result.success ? result.data : defaultBeneficiaryData,
		(draft) => draft,
	);
};

export const BeneficiarySection = memo(
	({ actor, onSubmit }: BeneficiarySectionProps) => {
		const send = actor.send;
		const formData = useSelector(actor, beneficiaryDataSelector);

		const handleChange = (data: BeneficiaryFormValues) => {
			const beneficiaryData = produce(
				data,
				(draft) => draft,
			) as BeneficiaryData;
			send({ type: "UPDATE_BENEFICIARY", data: beneficiaryData });
			if (onSubmit) {
				onSubmit(beneficiaryData);
			}
		};

		return <BeneficiaryForm defaultValues={formData} onSubmit={handleChange} />;
	},
);

BeneficiarySection.displayName = "BeneficiarySection";
