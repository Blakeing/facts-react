import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Contract } from "../types";
import { api } from "../api";

export function useContractMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: api.create,
    onSuccess: (newContract) => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.setQueryData(["contract", newContract.id], newContract);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: Contract) => api.update(id, data as Contract),
    onSuccess: (updatedContract) => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.setQueryData(
        ["contract", updatedContract.id],
        updatedContract
      );
    },
  });

  return {
    createMutation,
    updateMutation,
  };
}
