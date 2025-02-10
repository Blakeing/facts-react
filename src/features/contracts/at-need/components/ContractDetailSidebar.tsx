import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

interface ContractDetailSidebarProps {
	contractNumber: string;
	currentSection: string;
}

const navigationItems = [
	{ id: "general", label: "GENERAL" },
	{ id: "buyers", label: "BUYER(S)" },
	{ id: "items", label: "ITEMS" },
	{ id: "people", label: "PEOPLE" },
	{ id: "summary", label: "SUMMARY" },
	{ id: "deceased", label: "DECEASED" },
	{ id: "services", label: "SERVICES" },
	{ id: "obituary", label: "OBITUARY" },
	{ id: "payments", label: "PAYMENTS" },
	{ id: "adjustments", label: "ADJUSTMENTS" },
	{ id: "forms", label: "FORMS" },
	{ id: "tracking", label: "TRACKING" },
];

export function ContractDetailSidebar({
	contractNumber,
	currentSection,
}: ContractDetailSidebarProps) {
	return (
		<div className="w-48 border-r">
			<nav className="flex flex-col space-y-1 p-2">
				{navigationItems.map((item) => (
					<Link
						key={item.id}
						to="/contracts/at-need/$contractNumber/$section"
						params={{ contractNumber, section: item.id }}
						className={cn(
							"px-4 py-2 text-sm font-medium rounded-md",
							currentSection === item.id
								? "bg-blue-100 text-blue-700"
								: "text-gray-600 hover:bg-gray-100",
						)}
					>
						{item.label}
					</Link>
				))}
			</nav>
		</div>
	);
}
