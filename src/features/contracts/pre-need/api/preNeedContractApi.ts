import { axiosInstance } from "@/lib/axios";
import type { PreNeedContract } from "../types";

export interface CreatePreNeedContractDTO {
	customerName: string;
	totalAmount: number;
	monthlyPayment: number;
	nextPaymentDate: string;
	status?: PreNeedContract["status"];
}

export interface UpdatePreNeedContractDTO {
	customerName?: string;
	totalAmount?: number;
	monthlyPayment?: number;
	nextPaymentDate?: string;
	status?: PreNeedContract["status"];
}

export const preNeedContractApi = {
	getPreNeedContracts: async (): Promise<PreNeedContract[]> => {
		const { data } = await axiosInstance.get<PreNeedContract[]>(
			"/pre-need-contracts",
		);
		return data;
	},

	getPreNeedContract: async (id: string): Promise<PreNeedContract> => {
		const { data } = await axiosInstance.get<PreNeedContract>(
			`/pre-need-contracts/${id}`,
		);
		return data;
	},

	createPreNeedContract: async (
		contract: CreatePreNeedContractDTO,
	): Promise<PreNeedContract> => {
		try {
			const { data } = await axiosInstance.post<PreNeedContract>(
				"/pre-need-contracts",
				{
					...contract,
					status: contract.status || "draft",
					contractNumber: `PN-${new Date().getFullYear()}-${Math.floor(
						Math.random() * 10000,
					)
						.toString()
						.padStart(4, "0")}`,
					createdAt: new Date().toISOString(),
				},
			);
			return data;
		} catch (error) {
			console.error("API: Error creating pre-need contract:", error);
			throw error;
		}
	},

	updatePreNeedContract: async (
		id: string,
		updates: UpdatePreNeedContractDTO,
	): Promise<PreNeedContract> => {
		const { data } = await axiosInstance.patch<PreNeedContract>(
			`/pre-need-contracts/${id}`,
			updates,
		);
		return data;
	},

	deletePreNeedContract: async (id: string): Promise<void> => {
		await axiosInstance.delete(`/pre-need-contracts/${id}`);
	},

	// Contract actions
	signPreNeedContract: async (id: string): Promise<PreNeedContract> => {
		const { data } = await axiosInstance.post<PreNeedContract>(
			`/pre-need-contracts/${id}/sign`,
		);
		return data;
	},

	cancelPreNeedContract: async (
		id: string,
		reason: string,
	): Promise<PreNeedContract> => {
		const { data } = await axiosInstance.post<PreNeedContract>(
			`/pre-need-contracts/${id}/cancel`,
			{ reason },
		);
		return data;
	},
};
