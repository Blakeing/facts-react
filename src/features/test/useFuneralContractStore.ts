import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchContract, saveContract, updateContractState } from "./api";
import type {
  FuneralContract,
  FuneralContractFormData,
  ContractState,
  SectionsCompleted,
} from "./types";

export interface FuneralContractStore {
  formData: FuneralContractFormData;
  sectionsCompleted: SectionsCompleted;
  contractId: string | null;
  contractState: ContractState;
  setFormData: (
    section: keyof FuneralContractFormData,
    data: FuneralContractFormData[keyof FuneralContractFormData]
  ) => void;
  setContractId: (id: string) => void;
  setContractState: (state: ContractState) => void;
  setSectionsCompleted: (sections: SectionsCompleted) => void;
  reset: () => void;
}

export const useFuneralContractStore = create<FuneralContractStore>()(
  devtools((set) => ({
    formData: {},
    sectionsCompleted: {
      general: false,
      people: false,
      payment: false,
    },
    contractId: null,
    contractState: "draft",
    setFormData: (section, data) =>
      set((state) => ({
        formData: {
          ...state.formData,
          [section]: data,
        },
      })),
    setContractId: (id) => set({ contractId: id }),
    setContractState: (state) => set({ contractState: state }),
    setSectionsCompleted: (sections) => set({ sectionsCompleted: sections }),
    reset: () =>
      set({
        formData: {},
        sectionsCompleted: {
          general: false,
          people: false,
          payment: false,
        },
        contractId: null,
        contractState: "draft",
      }),
  }))
);

// Fetch contract using React Query
export const useFetchContract = (contractId: string | null) => {
  return useQuery({
    queryKey: ["contract", contractId],
    queryFn: async () => (contractId ? await fetchContract(contractId) : null),
    enabled: !!contractId,
  });
};

// Save contract using React Query
export const useSaveContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contract: FuneralContract) =>
      await saveContract(contract),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["contract", data?.id] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
};

// Update contract state using React Query
export const useUpdateContractState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contractId,
      contractState,
    }: {
      contractId: string;
      contractState: ContractState;
    }) => await updateContractState(contractId, contractState),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["contract", variables.contractId],
      });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
};
