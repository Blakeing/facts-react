import type { CreateContractDTO, UpdateContractDTO } from "@/api/contractApi";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ContractFormProps {
	initialData?: Partial<CreateContractDTO>;
	onSubmit: (data: CreateContractDTO) => void;
	isLoading?: boolean;
	mode?: "create" | "edit";
}

export function ContractForm({
	initialData,
	onSubmit,
	isLoading = false,
	mode = "create",
}: ContractFormProps) {
	const [formData, setFormData] = useState<CreateContractDTO>({
		title: "",
		description: "",
		parties: [],
		...initialData,
	} as CreateContractDTO);

	const [newParty, setNewParty] = useState<{
		email: string;
		name: string;
		role: "viewer" | "signer";
	}>({
		email: "",
		name: "",
		role: "viewer",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	const addParty = () => {
		if (newParty.email) {
			setFormData((prev) => ({
				...prev,
				parties: [...(prev.parties || []), newParty],
			}));
			setNewParty({ email: "", name: "", role: "viewer" });
		}
	};

	const removeParty = (email: string) => {
		setFormData((prev) => ({
			...prev,
			parties: prev.parties?.filter((p) => p.email !== email) || [],
		}));
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-4">
				<div>
					<label
						htmlFor="title"
						className="block text-sm font-medium text-foreground"
					>
						Title
					</label>
					<input
						type="text"
						id="title"
						value={formData.title}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, title: e.target.value }))
						}
						className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						required={mode === "create"}
					/>
				</div>

				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium text-foreground"
					>
						Description
					</label>
					<textarea
						id="description"
						value={formData.description}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, description: e.target.value }))
						}
						rows={3}
						className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					/>
				</div>

				<div>
					<label
						htmlFor="parties"
						className="block text-sm font-medium text-foreground"
					>
						Parties
					</label>
					<div id="parties" className="mt-2 space-y-2">
						{formData.parties?.map((party) => (
							<div
								key={party.email}
								className="flex items-center justify-between rounded-md border border-input bg-background p-2"
							>
								<div>
									<span className="text-sm font-medium">{party.name}</span>
									<span className="ml-2 text-sm text-muted-foreground">
										{party.email}
									</span>
									<span className="ml-2 text-xs text-muted-foreground">
										({party.role})
									</span>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => removeParty(party.email)}
								>
									Remove
								</Button>
							</div>
						))}
					</div>

					<div className="mt-2 flex gap-2">
						<input
							type="text"
							value={newParty.name}
							onChange={(e) =>
								setNewParty((prev) => ({ ...prev, name: e.target.value }))
							}
							placeholder="Name"
							className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						/>
						<input
							type="email"
							value={newParty.email}
							onChange={(e) =>
								setNewParty((prev) => ({ ...prev, email: e.target.value }))
							}
							placeholder="Email address"
							className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						/>
						<select
							value={newParty.role}
							onChange={(e) =>
								setNewParty((prev) => ({
									...prev,
									role: e.target.value as "signer" | "viewer",
								}))
							}
							className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<option value="viewer">Viewer</option>
							<option value="signer">Signer</option>
						</select>
						<Button type="button" onClick={addParty}>
							Add
						</Button>
					</div>
				</div>
			</div>

			<div className="flex justify-end">
				<Button type="submit" disabled={isLoading}>
					{isLoading
						? "Saving..."
						: mode === "create"
							? "Create Contract"
							: "Update Contract"}
				</Button>
			</div>
		</form>
	);
}
