import { memo, useState, useEffect, useCallback } from "react";
import type { ActorRefFrom } from "xstate";
import type createContractMachine from "../../machines/contractMachine";
import type { BuyerData } from "../../machines/buyerMachine";
import type { BeneficiaryData } from "../../types/contract";
import { PeopleSidebar } from "../PeopleSidebar";
import { BuyerSection } from "./BuyerSection";
import { BeneficiarySection } from "./BeneficiarySection";
import { useSelector } from "@xstate/react";

type ContractActor = ActorRefFrom<ReturnType<typeof createContractMachine>>;

interface PeopleSectionProps {
	actor: ContractActor;
	currentState: string;
	buyer: BuyerData | null;
	beneficiary: BeneficiaryData | null;
	onSelect: (section: "buyer" | "beneficiary") => void;
}

const formDataSelector = (state: {
	context: {
		formData: { buyer: BuyerData | null; beneficiary: BeneficiaryData | null };
	};
}) => state.context.formData;

export const PeopleSection = memo(
	({
		actor,
		currentState,
		buyer,
		beneficiary,
		onSelect,
	}: PeopleSectionProps) => {
		const [selectedPerson, setSelectedPerson] = useState<
			"buyer" | "beneficiary" | null
		>("buyer");

		const formData = useSelector(actor, formDataSelector);

		const handleSelect = (section: "buyer" | "beneficiary") => {
			setSelectedPerson(section);
		};

		const handleBuyerUpdate = useCallback(
			(data: BuyerData) => {
				actor.send({ type: "UPDATE_BUYER", data });
			},
			[actor],
		);

		const handleBeneficiaryUpdate = useCallback(
			(data: BeneficiaryData) => {
				actor.send({ type: "UPDATE_BENEFICIARY", data });
			},
			[actor],
		);

		// Keep local state in sync with machine state
		useEffect(() => {
			if (currentState === "buyer" || currentState === "beneficiary") {
				setSelectedPerson(currentState);
			}
		}, [currentState]);

		return (
			<div className="flex h-full">
				<div className="w-64 border-r">
					<div className="p-4 border-b">
						<h2 className="text-lg font-semibold">People</h2>
					</div>
					<PeopleSidebar
						buyer={formData.buyer}
						beneficiary={formData.beneficiary}
						currentSection={selectedPerson || ""}
						onSelect={handleSelect}
					/>
				</div>
				<div className="flex-1 p-4">
					{selectedPerson === "buyer" ? (
						<BuyerSection actor={actor} onSubmit={handleBuyerUpdate} />
					) : selectedPerson === "beneficiary" ? (
						<BeneficiarySection
							actor={actor}
							onSubmit={handleBeneficiaryUpdate}
						/>
					) : null}
				</div>
			</div>
		);
	},
);

PeopleSection.displayName = "PeopleSection";

export default PeopleSection;
