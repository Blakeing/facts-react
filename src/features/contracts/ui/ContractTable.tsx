import type { Contract } from "@/api/contractApi";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";
import { Link } from "@tanstack/react-router";

interface ContractTableProps {
	contracts: Contract[];
	onSign?: (id: string) => void;
	onCancel?: (id: string) => void;
}

export function ContractTable({
	contracts,
	onSign,
	onCancel,
}: ContractTableProps) {
	return (
		<div className="relative overflow-x-auto rounded-lg border bg-card">
			<table className="w-full text-left text-sm">
				<thead className="bg-muted text-muted-foreground">
					<tr>
						<th scope="col" className="px-6 py-3 font-medium">
							Title
						</th>
						<th scope="col" className="px-6 py-3 font-medium">
							Status
						</th>
						<th scope="col" className="px-6 py-3 font-medium">
							Created
						</th>
						<th scope="col" className="px-6 py-3 font-medium">
							Parties
						</th>
						<th scope="col" className="px-6 py-3 font-medium">
							Actions
						</th>
					</tr>
				</thead>
				<tbody className="divide-y">
					{contracts.map((contract) => (
						<tr key={contract.id} className="bg-background hover:bg-muted/50">
							<td className="px-6 py-4">
								<Link
									to="/contracts/$contractId"
									params={{ contractId: contract.id }}
									className="font-medium hover:underline"
								>
									{contract.title}
								</Link>
								{contract.description && (
									<p className="mt-1 text-xs text-muted-foreground">
										{contract.description}
									</p>
								)}
							</td>
							<td className="px-6 py-4">
								<span
									className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
										contract.status === "active"
											? "bg-green-100 text-green-800"
											: contract.status === "draft"
												? "bg-gray-100 text-gray-800"
												: contract.status === "completed"
													? "bg-blue-100 text-blue-800"
													: "bg-red-100 text-red-800"
									}`}
								>
									{contract.status}
								</span>
							</td>
							<td className="px-6 py-4 text-muted-foreground">
								{formatDate(contract.createdAt)}
							</td>
							<td className="px-6 py-4">
								<div className="flex -space-x-2">
									{contract.parties.map((party) => (
										<div
											key={party.id}
											className="relative h-8 w-8 rounded-full bg-primary text-primary-foreground"
											title={`${party.name} (${party.role})`}
										>
											<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium">
												{party.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</span>
										</div>
									))}
								</div>
							</td>
							<td className="px-6 py-4">
								<div className="flex space-x-2">
									{onSign && contract.status === "draft" && (
										<Button size="sm" onClick={() => onSign(contract.id)}>
											Sign
										</Button>
									)}
									{onCancel && contract.status === "active" && (
										<Button
											size="sm"
											variant="destructive"
											onClick={() => onCancel(contract.id)}
										>
											Cancel
										</Button>
									)}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
