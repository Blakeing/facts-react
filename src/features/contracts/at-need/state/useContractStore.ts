import type { Contract } from "@/api/contractApi";
import { create } from "zustand";
import type { StateCreator } from "zustand";
import { contractService } from "../services/contractService";

interface ContractState {
	contracts: Contract[];
	selectedContract: Contract | null;
	isLoading: boolean;
	error: string | null;
	// Actions
	fetchContracts: () => Promise<void>;
	fetchContract: (id: string) => Promise<void>;
	createContract: (
		data: Parameters<typeof contractService.createContract>[0],
	) => Promise<void>;
	updateContract: (
		id: string,
		data: Parameters<typeof contractService.updateContract>[1],
	) => Promise<void>;
	deleteContract: (id: string) => Promise<void>;
	signContract: (id: string) => Promise<void>;
	cancelContract: (id: string, reason: string) => Promise<void>;
	clearError: () => void;
}

type ContractStore = StateCreator<ContractState>;

export const useContractStore = create<ContractState>((set) => ({
	contracts: [],
	selectedContract: null,
	isLoading: false,
	error: null,

	fetchContracts: async () => {
		try {
			set({ isLoading: true, error: null });
			const contracts = await contractService.getContracts();
			set({ contracts, isLoading: false });
		} catch (error) {
			set({
				error:
					error instanceof Error ? error.message : "Failed to fetch contracts",
				isLoading: false,
			});
		}
	},

	fetchContract: async (id: string) => {
		try {
			set({ isLoading: true, error: null });
			const contract = await contractService.getContract(id);
			set({ selectedContract: contract, isLoading: false });
		} catch (error) {
			set({
				error:
					error instanceof Error ? error.message : "Failed to fetch contract",
				isLoading: false,
			});
		}
	},

	createContract: async (data) => {
		try {
			set({ isLoading: true, error: null });
			const contract = await contractService.createContract(data);
			set((state) => ({
				contracts: [...state.contracts, contract],
				isLoading: false,
			}));
		} catch (error) {
			set({
				error:
					error instanceof Error ? error.message : "Failed to create contract",
				isLoading: false,
			});
		}
	},

	updateContract: async (id, data) => {
		try {
			set({ isLoading: true, error: null });
			const contract = await contractService.updateContract(id, data);
			set((state) => ({
				contracts: state.contracts.map((c) =>
					c.id === contract.id ? contract : c,
				),
				selectedContract:
					state.selectedContract?.id === contract.id
						? contract
						: state.selectedContract,
				isLoading: false,
			}));
		} catch (error) {
			set({
				error:
					error instanceof Error ? error.message : "Failed to update contract",
				isLoading: false,
			});
		}
	},

	deleteContract: async (id) => {
		try {
			set({ isLoading: true, error: null });
			await contractService.deleteContract(id);
			set((state) => ({
				contracts: state.contracts.filter((c) => c.id !== id),
				selectedContract:
					state.selectedContract?.id === id ? null : state.selectedContract,
				isLoading: false,
			}));
		} catch (error) {
			set({
				error:
					error instanceof Error ? error.message : "Failed to delete contract",
				isLoading: false,
			});
		}
	},

	signContract: async (id) => {
		try {
			set({ isLoading: true, error: null });
			const contract = await contractService.signContract(id);
			set((state) => ({
				contracts: state.contracts.map((c) =>
					c.id === contract.id ? contract : c,
				),
				selectedContract:
					state.selectedContract?.id === contract.id
						? contract
						: state.selectedContract,
				isLoading: false,
			}));
		} catch (error) {
			set({
				error:
					error instanceof Error ? error.message : "Failed to sign contract",
				isLoading: false,
			});
		}
	},

	cancelContract: async (id, reason) => {
		try {
			set({ isLoading: true, error: null });
			const contract = await contractService.cancelContract(id, reason);
			set((state) => ({
				contracts: state.contracts.map((c) =>
					c.id === contract.id ? contract : c,
				),
				selectedContract:
					state.selectedContract?.id === contract.id
						? contract
						: state.selectedContract,
				isLoading: false,
			}));
		} catch (error) {
			set({
				error:
					error instanceof Error ? error.message : "Failed to cancel contract",
				isLoading: false,
			});
		}
	},

	clearError: () => set({ error: null }),
}));
