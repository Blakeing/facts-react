import { memo } from "react";
import type { ActorRefFrom } from "xstate";
import { useSelector } from "@xstate/react";
import type createContractMachine from "../../machines/contractMachine";
import type { BeneficiaryData } from "../../types/contract";
import { BeneficiaryForm } from "../../forms/beneficiary-form";

type ContractActor = ActorRefFrom<ReturnType<typeof createContractMachine>>;

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

		return (
			<BeneficiaryForm
				defaultValues={formData}
				onSubmit={(data) => {
					send({ type: "UPDATE_BENEFICIARY", data });
					if (onSubmit) {
						onSubmit(data);
					}
				}}
			/>
		);
	},
);

BeneficiarySection.displayName = "BeneficiarySection";
