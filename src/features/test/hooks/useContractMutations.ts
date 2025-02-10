import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import type { Contract } from "../types";

const API_URL = "http://localhost:3001";

export const useContractMutations = () => {
	const queryClient = useQueryClient();

	const createMutation = useMutation({
		mutationFn: async (data: Omit<Contract, "id">) => {
			const { data: response } = await axios.post<Contract>(
				`${API_URL}/contracts`,
				data,
			);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["contracts"] });
			toast.success("Contract created successfully");
		},
		onError: (error) => {
			toast.error("Failed to create contract");
		},
	});

	const updateMutation = useMutation({
		mutationFn: async (data: Contract) => {
			const { data: response } = await axios.put<Contract>(
				`${API_URL}/contracts/${data.id}`,
				data,
			);
			return response;
		},
		onMutate: async (newContract) => {
			await queryClient.cancelQueries({
				queryKey: ["contracts", newContract.id],
			});
			await queryClient.cancelQueries({ queryKey: ["contracts"] });

			// Snapshot the previous value
			const previousContract = queryClient.getQueryData<Contract>([
				"contracts",
				newContract.id,
			]);
			const previousContracts = queryClient.getQueryData<Contract[]>([
				"contracts",
			]);

			// Optimistically update both the individual contract and the list
			if (previousContract) {
				queryClient.setQueryData<Contract>(
					["contracts", newContract.id],
					newContract,
				);
			}
			if (previousContracts) {
				queryClient.setQueryData<Contract[]>(["contracts"], (old) =>
					old?.map((contract) =>
						contract.id === newContract.id ? newContract : contract,
					),
				);
			}

			return { previousContract, previousContracts };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["contracts"] });
			toast.success("Contract updated successfully");
		},
		onError: (error) => {
			toast.error("Failed to update contract");
		},
		onSettled: (data) => {
			// Always refetch after error or success to ensure data is in sync
			if (data?.id) {
				queryClient.invalidateQueries({ queryKey: ["contracts", data.id] });
			}
			queryClient.invalidateQueries({ queryKey: ["contracts"] });
		},
	});

	return {
		createMutation,
		updateMutation,
	};
};
