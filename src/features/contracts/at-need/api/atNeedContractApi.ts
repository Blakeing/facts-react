import { axiosInstance } from "@/lib/axios";
import type {
	AtNeedContract,
	CreateAtNeedContractDTO,
	UpdateAtNeedContractDTO,
} from "../types";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const atNeedContractApi = {
	getAtNeedContracts: async (): Promise<AtNeedContract[]> => {
		try {
			const { data } =
				await axiosInstance.get<AtNeedContract[]>("/at-need-contracts");
			return data;
		} catch (error) {
			console.error("API: Error fetching contracts:", error);
			throw error;
		}
	},

	getAtNeedContract: async (id: string): Promise<AtNeedContract> => {
		try {
			const { data } = await axiosInstance.get<AtNeedContract>(
				`/at-need-contracts/${id}`,
			);
			return data;
		} catch (error) {
			console.error("API: Error fetching contract:", { id, error });
			throw error;
		}
	},

	getAtNeedContractByNumber: async (
		contractNumber: string,
	): Promise<AtNeedContract> => {
		try {
			const { data } = await axiosInstance.get<AtNeedContract[]>(
				"/at-need-contracts",
				{
					params: { contractNumber },
				},
			);
			const contract = data.find((c) => c.contractNumber === contractNumber);
			if (!contract) {
				throw new Error(`Contract not found: ${contractNumber}`);
			}
			return contract;
		} catch (error) {
			console.error("API: Error fetching contract:", { contractNumber, error });
			throw error;
		}
	},

	createAtNeedContract: async (
		contract: CreateAtNeedContractDTO,
	): Promise<AtNeedContract> => {
		try {
			const now = new Date().toISOString();
			const newContract = {
				...contract,
				contractNumber: `AN-${new Date().getFullYear()}-${Math.floor(
					Math.random() * 10000,
				)
					.toString()
					.padStart(4, "0")}`,
				status: contract.status || "Pending",
				createdAt: now,
				updatedAt: now,
			};

			const { data } = await axiosInstance.post<AtNeedContract>(
				"/at-need-contracts",
				newContract,
			);
			console.log("API: Created contract:", data);
			return data;
		} catch (error) {
			console.error("API: Error creating contract:", { contract, error });
			throw error;
		}
	},

	updateAtNeedContract: async (
		id: string,
		updates: UpdateAtNeedContractDTO,
	): Promise<AtNeedContract> => {
		try {
			// Simulate network delay
			await delay(1000);

			const now = new Date().toISOString();
			const updatedContract = {
				...updates,
				updatedAt: now,
			};

			const { data } = await axiosInstance.patch<AtNeedContract>(
				`/at-need-contracts/${id}`,
				updatedContract,
			);

			console.log("API: Updated contract:", {
				id,
				updates: updatedContract,
				response: data,
			});

			return data;
		} catch (error) {
			console.error("API: Error updating contract:", { id, updates, error });
			throw error;
		}
	},

	deleteAtNeedContract: async (id: string): Promise<void> => {
		try {
			await axiosInstance.delete(`/at-need-contracts/${id}`);
			console.log("API: Deleted contract:", id);
		} catch (error) {
			console.error("API: Error deleting contract:", { id, error });
			throw error;
		}
	},

	signAtNeedContract: async (id: string): Promise<void> => {
		try {
			await axiosInstance.patch(`/at-need-contracts/${id}`, {
				status: "Active",
				updatedAt: new Date().toISOString(),
			});
			console.log("API: Signed contract:", id);
		} catch (error) {
			console.error("API: Error signing contract:", { id, error });
			throw error;
		}
	},

	cancelAtNeedContract: async (id: string, reason: string): Promise<void> => {
		try {
			await axiosInstance.patch(`/at-need-contracts/${id}`, {
				status: "Cancelled",
				updatedAt: new Date().toISOString(),
			});
			console.log("API: Cancelled contract:", { id, reason });
		} catch (error) {
			console.error("API: Error cancelling contract:", { id, reason, error });
			throw error;
		}
	},
};
