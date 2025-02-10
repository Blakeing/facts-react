import {
	PreNeedForm,
	type PreNeedFormValues,
} from "@/features/contracts/pre-need/forms/pre-need-form";
import { preNeedContractService } from "@/features/contracts/pre-need/services/preNeedContractService";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/contracts/pre-need/new")({
	component: NewPreNeedContractPage,
});

export default function NewPreNeedContractPage() {
	const navigate = useNavigate();
	const createMutation = useMutation({
		mutationFn: (values: PreNeedFormValues) =>
			preNeedContractService.createContract(values),
		onSuccess: (contract) => {
			navigate({ to: `/contracts/pre-need/${contract.id}` });
		},
	});

	const handleSubmit = async (values: PreNeedFormValues) => {
		try {
			await createMutation.mutateAsync(values);
		} catch (error) {
			console.error("Failed to create contract:", error);
		}
	};

	return (
		<div className="container mx-auto py-10">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">
					New Pre-Need Contract
				</h1>
				<p className="text-muted-foreground">
					Create a new pre-need contract by filling out the form below
				</p>
			</div>
			<div className="mx-auto max-w-2xl">
				<PreNeedForm
					onSubmit={handleSubmit}
					isSubmitting={createMutation.isPending}
				/>
			</div>
		</div>
	);
}
