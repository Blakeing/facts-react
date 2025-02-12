import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";
import type { BuyerData } from "../machines/buyerMachine";
import type { BeneficiaryData } from "../types/contract";

interface PeopleSidebarProps {
	buyer: BuyerData | null;
	beneficiary: BeneficiaryData | null;
	currentSection: "buyer" | "beneficiary" | string;
	onSelect: (section: "buyer" | "beneficiary") => void;
}

export function PeopleSidebar({
	buyer,
	beneficiary,
	currentSection,
	onSelect,
}: PeopleSidebarProps) {
	return (
		<div className="pb-12 w-64 border-r">
			<div className="space-y-4 py-4">
				<ScrollArea className="px-1">
					<div className="space-y-4">
						{buyer && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onSelect("buyer")}
								className={cn(
									"w-full justify-start gap-2 ",
									currentSection === "buyer" &&
										"bg-accent text-accent-foreground",
								)}
							>
								<UserIcon className="h-4 w-4" />
								<div className="flex flex-col items-start">
									<span>
										{buyer.name.first} {buyer.name.last}
									</span>
									<span className="text-xs text-muted-foreground">(BUYER)</span>
								</div>
							</Button>
						)}
						{beneficiary && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onSelect("beneficiary")}
								className={cn(
									"w-full justify-start gap-2",
									currentSection === "beneficiary" &&
										"bg-accent text-accent-foreground",
								)}
							>
								<UserIcon className="h-4 w-4" />
								<div className="flex flex-col items-start">
									<span>
										{beneficiary.name.first} {beneficiary.name.last}
									</span>
									<span className="text-xs text-muted-foreground">
										(BENEFICIARY)
									</span>
								</div>
							</Button>
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
}
