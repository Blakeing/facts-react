import { useSelector } from "@xstate/react";
import { memo } from "react";
import type { ActorRefFrom } from "xstate";
import { BuyerForm } from "../../forms/buyer-form";
import type { BuyerFormValues } from "../../forms/schemas/buyer-form";
import type createContractMachine from "../../machines/contractMachine";
import type { BuyerData } from "../../types/buyer";

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
			name: {
				...data.name,
				prefix: data.name.prefix ?? undefined,
				middle: data.name.middle ?? undefined,
				suffix: data.name.suffix ?? undefined,
				companyName: data.name.companyName ?? undefined,
				nickname: data.name.nickname ?? undefined,
				maiden: data.name.maiden ?? undefined,
				gender: data.name.gender ?? undefined,
			},
			dates: {
				...data.dates,
				dateOfBirth: data.dates.dateOfBirth ?? undefined,
				dateOfDeath: data.dates.dateOfDeath ?? undefined,
			},
			role: data.role ?? undefined,
			ethnicity: data.ethnicity ?? undefined,
			race: data.race ?? undefined,
		};
		send({ type: "UPDATE_BUYER", data: buyerData });
		if (onSubmit) {
			onSubmit(buyerData);
		}
	};

	return <BuyerForm defaultValues={formData} onSubmit={handleChange} />;
});

BuyerSection.displayName = "BuyerSection";
