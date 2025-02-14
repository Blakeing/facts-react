import { useSelector } from "@xstate/react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ActorRefFrom } from "xstate";
import { BuyerForm, type BuyerFormRef } from "../../forms/buyer-form";
import {
	type BuyerFormValues,
	buyerFormSchema,
} from "../../forms/schemas/buyer-form";
import type createContractMachine from "../../machines/contractMachine";
import type { BuyerData } from "../../types/buyer";
import type { ContractContext } from "../../types/contract";

export interface BuyerSectionRef {
	form: UseFormReturn<BuyerFormValues>;
}

type BuyerSectionProps = {
	actor: ActorRefFrom<ReturnType<typeof createContractMachine>>;
	onSubmit?: (data: BuyerData) => void;
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
	({ actor, onSubmit }, ref) => {
		const buyerData = useSelector(
			actor,
			(state: { context: ContractContext }) =>
				state.context.draftData.buyer ?? defaultBuyerData,
		);

		const formRef = useRef<BuyerFormRef>(null);

		useImperativeHandle(
			ref,
			() => ({
				get form() {
					if (!formRef.current?.form) {
						throw new Error("Form not initialized");
					}
					return formRef.current.form;
				},
			}),
			[],
		);

		const handleSubmit = (data: BuyerFormValues) => {
			onSubmit?.(data as BuyerData);
		};

		return (
			<BuyerForm
				ref={formRef}
				defaultValues={buyerData}
				onSubmit={handleSubmit}
			/>
		);
	},
);

BuyerSection.displayName = "BuyerSection";
