import { useParams } from "@tanstack/react-router";
import { ContractDetailSidebar } from "../components/ContractDetailSidebar";
import { GeneralForm } from "../components/GeneralForm";

export function ContractDetailPage() {
	const { contractId, section = "general" } = useParams({
		from: "/contracts/at-need/$contractId/$section",
	});

	const handleSubmit = async (values: any) => {
		console.log(values);
		// TODO: Implement form submission
	};

	return (
		<div className="flex h-full">
			<ContractDetailSidebar contractId={contractId} currentSection={section} />

			<main className="flex-1 p-6 overflow-auto">
				{section === "general" && (
					<GeneralForm
						defaultValues={{
							serviceDate: "",
							contractSignDate: "",
							prePrintedContractNumber: "",
							funeralDirector: "",
							atNeedType: "",
							contractType: "",
							campaign: "",
						}}
						onSubmit={handleSubmit}
					/>
				)}
				{/* Add other sections here */}
			</main>
		</div>
	);
}
