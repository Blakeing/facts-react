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
      // Only use state-specific messages when the state is explicitly changing
      const isStateChange =
        variables.contractState !== undefined &&
        variables.contractState !== "draft";

      if (isStateChange) {
        const messages = {
          executed: {
            title: "Contract Executed",
            description: "The contract has been executed successfully.",
          },
          void: {
            title: "Contract Voided",
            description: "The contract has been voided.",
          },
          finalized: {
            title: "Contract Finalized",
            description: "The contract has been finalized successfully.",
          },
          review: {
            title: "Contract Updated",
            description:
              "The contract has been updated and is ready for review.",
          },
        };

        const message =
          messages[variables.contractState as keyof typeof messages];
        if (message) {
          toast({
            title: message.title,
            description: message.description,
            variant:
              variables.contractState === "void" ? "destructive" : "default",
          });
          return;
        }
      }

      // Default message for regular saves
      toast({
        title: "Changes Saved",
        description: "Your changes have been saved successfully.",
        variant: "default",
      });
    },
    onError: (error, _newContract, context) => {
      console.error("Error updating contract:", error);
      if (context?.previousContracts) {
        queryClient.setQueryData(["contracts"], context.previousContracts);
      }
      toast({
        title: "Error Saving Contract",
        description:
          "There was a problem saving your changes. Please try again.",
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
