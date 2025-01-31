import type { Contract } from "@/api/contractApi";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/utils/formatDate";
import { Link } from "@tanstack/react-router";

interface ContractCardProps {
	contract: Contract;
	onSign?: (id: string) => void;
	onCancel?: (id: string) => void;
	disabled?: {
		sign?: boolean;
		cancel?: boolean;
	};
}

export function ContractCard({
	contract,
	onSign,
	onCancel,
	disabled = {},
}: ContractCardProps) {
	const statusColors = {
		draft: "bg-gray-100 text-gray-800",
		active: "bg-green-100 text-green-800",
		completed: "bg-blue-100 text-blue-800",
		cancelled: "bg-red-100 text-red-800",
	};

	return (
		<div className="rounded-lg border bg-card p-6 shadow-sm">
			<div className="flex items-start justify-between">
				<div>
					<Link
						to="/contracts/$contractId"
						params={{ contractId: contract.id }}
						className="text-lg font-semibold hover:underline"
					>
						{contract.title}
					</Link>
					<div className="mt-1 text-sm text-muted-foreground">
						Created {formatDate(contract.createdAt)}
					</div>
				</div>
				<div
					className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
						statusColors[contract.status]
					}`}
				>
					{contract.status}
				</div>
			</div>

			{contract.description && (
				<p className="mt-4 text-sm text-muted-foreground">
					{contract.description}
				</p>
			)}

			<div className="mt-4">
				<h4 className="text-sm font-medium">Parties</h4>
				<div className="mt-2 space-y-2">
					{contract.parties.map((party) => (
						<div
							key={`${contract.id}-${party.id}`}
							className="flex items-center justify-between text-sm"
						>
							<div className="flex items-center space-x-2">
								<div
									className={`h-2 w-2 rounded-full ${
										party.role === "owner"
											? "bg-blue-500"
											: party.role === "signer"
												? "bg-yellow-500"
												: "bg-gray-500"
									}`}
								/>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<span>{party.name}</span>
										</TooltipTrigger>
										<TooltipContent>
											<p>{party.email}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
							<span className="text-xs text-muted-foreground capitalize">
								{party.role}
							</span>
						</div>
					))}
				</div>
			</div>

			{(onSign || onCancel) && (
				<div className="mt-6 flex space-x-2">
					{onSign && contract.status === "draft" && (
						<Button
							size="sm"
							onClick={() => onSign(contract.id)}
							className="w-full"
							disabled={disabled.sign}
						>
							{disabled.sign ? "Signing..." : "Sign Contract"}
						</Button>
					)}
					{onCancel && contract.status === "active" && (
						<Button
							size="sm"
							variant="destructive"
							onClick={() => onCancel(contract.id)}
							className="w-full"
							disabled={disabled.cancel}
						>
							{disabled.cancel ? "Cancelling..." : "Cancel Contract"}
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
