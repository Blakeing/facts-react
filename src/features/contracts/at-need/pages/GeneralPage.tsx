import {
	type UseMutationResult,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { atNeedContractApi } from "../api/atNeedContractApi";
import { GeneralForm } from "../components/GeneralForm";
import type { AtNeedContract, GeneralFormValues } from "../types";

interface GeneralPageProps {
	contract?: AtNeedContract;
	mutation?: UseMutationResult<AtNeedContract, Error, AtNeedContract>;
}

export function GeneralPage({ contract, mutation }: GeneralPageProps) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	// Map contract data to form values
	const getInitialValues = useCallback(
		(): Partial<GeneralFormValues> => ({
			serviceDate: contract?.serviceDate.split("T")[0] || "",
			contractSignDate: contract?.contractSignDate.split("T")[0] || "",
			prePrintedContractNumber: contract?.prePrintedContractNumber || "",
			funeralDirector: contract?.funeralDirector || "",
			atNeedType: contract?.atNeedType || "",
			contractType: contract?.contractType || "",
			campaign: contract?.campaign || "",
		}),
		[
			contract?.serviceDate,
			contract?.contractSignDate,
			contract?.prePrintedContractNumber,
			contract?.funeralDirector,
			contract?.atNeedType,
			contract?.contractType,
			contract?.campaign,
		],
	);

	const [defaultValues, setDefaultValues] = useState<
		Partial<GeneralFormValues>
	>(getInitialValues());

	// Reset form to original values
	const handleReset = useCallback(() => {
		setDefaultValues(getInitialValues());
		setHasUnsavedChanges(false);
	}, [getInitialValues]);

	const createMutation = useMutation({
		mutationFn: async (values: GeneralFormValues) => {
			const contract = await atNeedContractApi.createAtNeedContract({
				...values,
				status: "Pending",
			});
			return contract;
		},
		onSuccess: (contract) => {
			queryClient.invalidateQueries({ queryKey: ["at-need-contracts"] });
			navigate({ to: `/contracts/at-need/${contract.id}` });
			toast.success("Contract created successfully");
		},
		onError: (error) => {
			console.error("Create mutation error:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to create contract",
			);
		},
	});

	const updateMutation = useMutation({
		mutationFn: async (values: GeneralFormValues) => {
			if (!contract) throw new Error("No contract to update");
			console.log("Updating contract with values:", values);
			const updated = await atNeedContractApi.updateAtNeedContract(
				contract.id,
				values,
			);
			console.log("Update response:", updated);
			return updated;
		},
		onSuccess: (updatedContract) => {
			console.log("Update successful:", updatedContract);
			queryClient.invalidateQueries({
				queryKey: ["at-need-contract", contract?.id],
			});
			setHasUnsavedChanges(false);
			toast.success("Changes saved successfully");
		},
		onError: (error) => {
			console.error("Update mutation error:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to save changes",
			);
		},
	});

	const handleSubmit = async (values: GeneralFormValues) => {
		try {
			console.log("Form submitted with values:", values);
			if (contract) {
				await updateMutation.mutateAsync(values);
			} else if (mutation) {
				await mutation.mutateAsync(values as AtNeedContract);
			}
		} catch (error) {
			console.error("Form submission error:", error);
		}
	};

	const handleFieldChange = () => {
		setHasUnsavedChanges(true);
	};

	// Update defaultValues when contract changes
	useEffect(() => {
		setDefaultValues(getInitialValues());
	}, [getInitialValues]);

	// Warn about unsaved changes when navigating away
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				e.preventDefault();
				e.returnValue = "";
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [hasUnsavedChanges]);

	return (
		<GeneralForm
			defaultValues={defaultValues}
			onSubmit={handleSubmit}
			onReset={handleReset}
			onFieldChange={handleFieldChange}
			isSubmitting={createMutation.isPending || updateMutation.isPending}
			hasUnsavedChanges={hasUnsavedChanges}
			mode={contract ? "edit" : "create"}
		/>
	);
}
