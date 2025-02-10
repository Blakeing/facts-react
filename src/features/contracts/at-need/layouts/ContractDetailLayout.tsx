import { ContractDetailSidebar } from "../components/ContractDetailSidebar";

interface ContractDetailLayoutProps {
	contractNumber: string;
	currentSection: string;
	children: React.ReactNode;
}

export function ContractDetailLayout({
	contractNumber,
	currentSection,
	children,
}: ContractDetailLayoutProps) {
	return (
		<div className="flex h-full">
			<ContractDetailSidebar
				contractNumber={contractNumber}
				currentSection={currentSection}
			/>
			<main className="flex-1 p-6 overflow-auto">{children}</main>
		</div>
	);
}
