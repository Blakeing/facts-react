import { atNeedContractApi } from "@/features/contracts/at-need/api/atNeedContractApi";
import {
	AtNeedForm,
	type AtNeedFormValues,
} from "@/features/contracts/at-need/forms/at-need-form";
import type { AtNeedContract } from "@/features/contracts/at-need/types";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/contracts/at-need/new")({
	component: NewAtNeedContractPage,
});

export default function NewAtNeedContractPage() {
	const navigate = useNavigate();
	const createMutation = useMutation({
		mutationFn: (values: AtNeedFormValues) =>
			atNeedContractApi.createAtNeedContract(values),
		onSuccess: (contract: AtNeedContract) => {
			navigate({ to: `/contracts/at-need/${contract.id}` });
		},
	});

	const handleSubmit = async (values: AtNeedFormValues) => {
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
					New At-Need Contract
				</h1>
				<p className="text-muted-foreground">
					Create a new at-need contract by filling out the form below
				</p>
			</div>
			<div className="mx-auto max-w-2xl">
				<AtNeedForm
					onSubmit={handleSubmit}
					isSubmitting={createMutation.isPending}
				/>
			</div>
		</div>
	);
}
