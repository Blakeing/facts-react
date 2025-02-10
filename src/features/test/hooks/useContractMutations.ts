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
          newContract
        );
      }
      if (previousContracts) {
        queryClient.setQueryData<Contract[]>(["contracts"], (old) =>
          old?.map((contract) =>
            contract.id === newContract.id ? newContract : contract
          )
        );
      }

      return { previousContract, previousContracts };
    },
    onSuccess: (_, variables) => {
      // Only use state-specific messages when the state is explicitly changing
      const isStateChange = variables.contractState !== "draft";

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

      toast({
        title: "Changes Saved",
        description: "Your changes have been saved successfully.",
        variant: "default",
      });
    },
    onError: (error, newContract, context) => {
      // Revert optimistic updates on error
      if (context?.previousContract) {
        queryClient.setQueryData(
          ["contracts", newContract.id],
          context.previousContract
        );
      }
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
