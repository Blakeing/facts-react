import { memo } from "react";
import type { ActorRefFrom } from "xstate";
import { useSelector } from "@xstate/react";
import type createContractMachine from "../../machines/contractMachine";
import type { BuyerData } from "../../machines/buyerMachine";
import { BuyerForm } from "../../forms/buyer-form";
import type { BuyerFormValues } from "../../forms/schemas/buyer-form";

type BuyerSectionProps = {
	actor: ActorRefFrom<ReturnType<typeof createContractMachine>>;
	onSubmit?: (data: BuyerData) => void;
};

const defaultBuyerData: BuyerData = {
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

const buyerDataSelector = (state: {
	context: { formData: { buyer: BuyerData | null } };
}) => state.context.formData.buyer || defaultBuyerData;

export const BuyerSection = memo(({ actor, onSubmit }: BuyerSectionProps) => {
	const send = actor.send;
	const formData = useSelector(actor, buyerDataSelector);

	const handleChange = (data: BuyerFormValues) => {
		const buyerData: BuyerData = {
			...data,
			mailingAddress: data.mailingAddress || undefined,
		};
		send({ type: "UPDATE_BUYER", data: buyerData });
		if (onSubmit) {
			onSubmit(buyerData);
		}
	};

	return <BuyerForm defaultValues={formData} onSubmit={handleChange} />;
});

BuyerSection.displayName = "BuyerSection";
