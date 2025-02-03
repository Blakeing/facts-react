import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import type { FuneralContract } from "../types";

type SaveContractData = {
  id?: string;
  data: Partial<FuneralContract["formData"]>;
  section: keyof FuneralContract["sectionsCompleted"] | null;
};

type UpdateContractStateData = {
  contractId: string;
  newState: FuneralContract["contractState"];
};

export type UseContractMutationsReturn = {
  saveContractMutation: ReturnType<
    typeof useMutation<FuneralContract, Error, SaveContractData>
  >;
  updateContractStateMutation: ReturnType<
    typeof useMutation<FuneralContract, Error, UpdateContractStateData>
  >;
};

export function useContractMutations(): UseContractMutationsReturn {
  const queryClient = useQueryClient();

  const saveContractMutation = useMutation<
    FuneralContract,
    Error,
    SaveContractData
  >({
    mutationFn: async ({ id, data, section }) => {
      const contractId = id || uuidv4();
      const formDataId = uuidv4();

      // If we have an ID, fetch the existing contract first
      let existingContract: FuneralContract | null = null;
      if (id) {
        const response = await fetch(`/api/contracts/${id}`);
        if (response.ok) {
          existingContract = await response.json();
        }
      }

      const newContract = id
        ? {
            ...existingContract,
            formData: {
              ...existingContract?.formData,
              ...data,
            },
            sectionsCompleted: {
              ...existingContract?.sectionsCompleted,
              [section as string]: true,
            },
          }
        : {
            id: contractId,
            formData: {
              id: formDataId,
              general: undefined,
              people: undefined,
              payment: undefined,
              ...data,
            },
            contractState: "draft",
            sectionsCompleted: {
              general: section === "general" || false,
              people: section === "people" || false,
              payment: section === "payment" || false,
            },
          };

      console.log(
        "[useContractMutations] Creating/updating contract:",
        newContract
      );

      const response = await fetch(`/api/contracts${id ? `/${id}` : ""}`, {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContract),
      });

      if (!response.ok) {
        throw new Error("Failed to save contract");
      }

      const savedContract = await response.json();
      console.log("[useContractMutations] Saved contract:", savedContract);
      return savedContract;
    },
    onSuccess: () => {
      // Invalidate the contracts query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });

  const updateContractStateMutation = useMutation<
    FuneralContract,
    Error,
    UpdateContractStateData
  >({
    mutationFn: async ({ contractId, newState }) => {
      // First, fetch the existing contract
      const getResponse = await fetch(`/api/contracts/${contractId}`);
      if (!getResponse.ok) {
        throw new Error("Failed to fetch contract");
      }
      const existingContract = await getResponse.json();

      // Update the contract with the new state
      const updatedContract = {
        ...existingContract,
        contractState: newState,
      };

      console.log(
        "[useContractMutations] Updating contract state:",
        contractId,
        newState,
        updatedContract
      );

      // Update the entire contract
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContract),
      });

      if (!response.ok) {
        throw new Error("Failed to update contract state");
      }

      const savedContract = await response.json();
      console.log("[useContractMutations] Updated contract:", savedContract);
      return savedContract;
    },
    onSuccess: () => {
      // Invalidate the contracts query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });

  return {
    saveContractMutation,
    updateContractStateMutation,
  };
}
