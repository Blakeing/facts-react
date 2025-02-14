import { useSelector } from "@xstate/react";
import { memo } from "react";
import type { ActorRefFrom } from "xstate";
import { BuyerForm } from "../../forms/buyer-form";
import {
	buyerFormSchema,
	type BuyerFormValues,
} from "../../forms/schemas/buyer-form";
import type createContractMachine from "../../machines/contractMachine";

type BuyerSectionProps = {
	actor: ActorRefFrom<ReturnType<typeof createContractMachine>>;
	onSubmit?: (data: BuyerFormValues) => void;
};

const defaultBuyerData: BuyerFormValues = {
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
	context: { formData: { buyer: BuyerFormValues | null } };
}) => {
	const buyerData = state.context.formData.buyer;
	if (!buyerData) return defaultBuyerData;

	// Parse the buyer data through our schema to ensure it matches our form values type
	const result = buyerFormSchema.safeParse(buyerData);
	return result.success ? result.data : defaultBuyerData;
};

export const BuyerSection = memo(({ actor, onSubmit }: BuyerSectionProps) => {
	const send = actor.send;
	const formData = useSelector(actor, buyerDataSelector);

	const handleChange = (data: BuyerFormValues) => {
		send({ type: "UPDATE_BUYER", data });
		if (onSubmit) {
			onSubmit(data);
		}
	};

	return <BuyerForm defaultValues={formData} onSubmit={handleChange} />;
});

BuyerSection.displayName = "BuyerSection";
