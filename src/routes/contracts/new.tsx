import { Button } from "@/components/ui/button";
import { ContractController } from "@/features/contracts/controllers/ContractController";
import { ContractForm } from "@/features/contracts/ui/ContractForm";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contracts/new")({
	component: NewContractPage,
});

function NewContractPage() {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (
		data: Parameters<typeof ContractController.createContract>[0],
	) => {
		try {
			setIsLoading(true);
			setError(null);
			await ContractController.createContract(data);
			navigate({ to: "/contracts" });
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to create contract",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">New Contract</h1>
				<Button variant="ghost" onClick={() => navigate({ to: "/contracts" })}>
					Cancel
				</Button>
			</div>

			{error && (
				<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
					{error}
				</div>
			)}

			<ContractForm onSubmit={handleSubmit} isLoading={isLoading} />
		</div>
	);
}
