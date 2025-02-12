import { memo } from "react";
import type { ActorRefFrom } from "xstate";
import { useSelector } from "@xstate/react";
import type createContractMachine from "../../machines/contractMachine";
import type { BeneficiaryData } from "../../types/contract";
import { BeneficiaryForm } from "../../forms/beneficiary-form";

type BeneficiarySectionProps = {
	actor: ActorRefFrom<ReturnType<typeof createContractMachine>>;
	onSubmit?: (data: BeneficiaryData) => void;
};

const beneficiaryDataSelector = (state: {
	context: { formData: { beneficiary: BeneficiaryData | null } };
}) =>
	state.context.formData.beneficiary || {
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

export const BeneficiarySection = memo(
	({ actor, onSubmit }: BeneficiarySectionProps) => {
		const send = actor.send;
		const formData = useSelector(actor, beneficiaryDataSelector);

		const handleChange = (data: BeneficiaryData) => {
			const beneficiaryData: BeneficiaryData = {
				name: {
					first: data.name.first,
					last: data.name.last,
					prefix: data.name.prefix || undefined,
					middle: data.name.middle || undefined,
					suffix: data.name.suffix || undefined,
					companyName: data.name.companyName || undefined,
					nickname: data.name.nickname || undefined,
					maiden: data.name.maiden || undefined,
					gender: data.name.gender || undefined,
				},
				physicalAddress: data.physicalAddress,
				mailingAddressSameAsPhysical: data.mailingAddressSameAsPhysical,
				mailingAddress: data.mailingAddress || undefined,
				identification: data.identification,
				dates: {
					isDeceased: data.dates.isDeceased,
					dateOfBirth: data.dates.dateOfBirth || undefined,
					dateOfDeath: data.dates.dateOfDeath || undefined,
				},
				role: data.role || undefined,
				ethnicity: data.ethnicity || undefined,
				race: data.race || undefined,
				isVeteran: data.isVeteran,
				phones: data.phones,
				emails: data.emails,
				optOutOfFutureMarketing: data.optOutOfFutureMarketing,
			};
			send({ type: "UPDATE_BENEFICIARY", data: beneficiaryData });
			if (onSubmit) {
				onSubmit(beneficiaryData);
			}
		};

		return <BeneficiaryForm defaultValues={formData} onSubmit={handleChange} />;
	},
);

BeneficiarySection.displayName = "BeneficiarySection";
