import { atNeedContractApi } from "@/features/contracts/at-need/api/atNeedContractApi";
import { ContractDetailLayout } from "@/features/contracts/at-need/layouts/ContractDetailLayout";
import { GeneralPage } from "@/features/contracts/at-need/pages/GeneralPage";
import type { AtNeedContract } from "@/features/contracts/at-need/types";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/contracts/at-need/new")({
	component: NewAtNeedContractPage,
});

export default function NewAtNeedContractPage() {
	const navigate = useNavigate();
	const createMutation = useMutation({
		mutationFn: (values: AtNeedContract) =>
			atNeedContractApi.createAtNeedContract(values),
		onSuccess: (contract: AtNeedContract) => {
			navigate({ to: `/contracts/at-need/${contract.id}` });
		},
	});

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="border-b bg-background">
				<div className="container py-4">
					<div className="flex items-start justify-between">
						<div>
							<h1 className="text-2xl font-bold">New At-Need Contract</h1>
							<p className="mt-2 text-sm text-muted-foreground">
								Create a new at-need contract by filling out the required
								information
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Content with Layout */}
			<div className="flex-1">
				<ContractDetailLayout contractId="new" currentSection="general">
					<GeneralPage />
				</ContractDetailLayout>
			</div>
		</div>
	);
}
