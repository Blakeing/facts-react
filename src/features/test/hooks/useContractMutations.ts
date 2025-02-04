import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Contract } from "../types";
import { useToast } from "@/hooks/use-toast";

const API_URL = "http://localhost:3001";

export const useContractMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Contract, "id">) => {
      const { data: response } = await axios.post<Contract>(
        `${API_URL}/contracts`,
        data
      );
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch contracts query
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast({
        title: "Contract created",
        description: "Your contract has been saved successfully.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Contract) => {
      const { data: response } = await axios.put<Contract>(
        `${API_URL}/contracts/${data.id}`,
        data
      );
      return response;
    },
    onMutate: async (newContract) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["contracts"] });

      // Snapshot the previous value
      const previousContracts = queryClient.getQueryData<Contract[]>([
        "contracts",
      ]);

      // Optimistically update to the new value
      if (previousContracts) {
        queryClient.setQueryData<Contract[]>(["contracts"], (old) =>
          old?.map((contract) =>
            contract.id === newContract.id ? newContract : contract
          )
        );
      }

      return { previousContracts };
    },
    onSuccess: (_, variables) => {
      const action =
        variables.contractState === "executed"
          ? "executed"
          : variables.contractState === "void"
            ? "voided"
            : variables.contractState === "finalized"
              ? "finalized"
              : "updated";

      toast({
        title: `Contract ${action}`,
        description: `Your contract has been ${action} successfully.`,
        variant: action === "voided" ? "destructive" : "default",
      });
    },
    onError: (error, _newContract, context) => {
      // Log the error
      console.error("Error updating contract:", error);
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousContracts) {
        queryClient.setQueryData(["contracts"], context.previousContracts);
      }
      toast({
        title: "Error",
        description: "Failed to update contract. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });

  return {
    createMutation,
    updateMutation,
  };
};
