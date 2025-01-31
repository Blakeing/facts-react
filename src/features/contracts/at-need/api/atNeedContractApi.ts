import { axiosInstance } from "@/lib/axios";
import type { AtNeedContract } from "../types";

export interface CreateAtNeedContractDTO {
	deceasedName: string;
	dateOfDeath: string;
	totalAmount: number;
	status?: AtNeedContract["status"];
}

export interface UpdateAtNeedContractDTO {
	deceasedName?: string;
	dateOfDeath?: string;
	totalAmount?: number;
	status?: AtNeedContract["status"];
}

export const atNeedContractApi = {
	getAtNeedContracts: async (): Promise<AtNeedContract[]> => {
		const { data } =
			await axiosInstance.get<AtNeedContract[]>("/at-need-contracts");
		return data;
	},

	getAtNeedContract: async (id: string): Promise<AtNeedContract> => {
		const { data } = await axiosInstance.get<AtNeedContract>(
			`/at-need-contracts/${id}`,
		);
		return data;
	},

	createAtNeedContract: async (
		contract: CreateAtNeedContractDTO,
	): Promise<AtNeedContract> => {
		try {
			const { data } = await axiosInstance.post<AtNeedContract>(
				"/at-need-contracts",
				{
					...contract,
					status: contract.status || "draft",
					contractNumber: `AN-${new Date().getFullYear()}-${Math.floor(
						Math.random() * 10000,
					)
						.toString()
						.padStart(4, "0")}`,
					createdAt: new Date().toISOString(),
				},
			);
			return data;
		} catch (error) {
			console.error("API: Error creating at-need contract:", error);
			throw error;
		}
	},

	updateAtNeedContract: async (
		id: string,
		updates: UpdateAtNeedContractDTO,
	): Promise<AtNeedContract> => {
		const { data } = await axiosInstance.patch<AtNeedContract>(
			`/at-need-contracts/${id}`,
			updates,
		);
		return data;
	},

	deleteAtNeedContract: async (id: string): Promise<void> => {
		await axiosInstance.delete(`/at-need-contracts/${id}`);
	},

	signAtNeedContract: async (id: string): Promise<AtNeedContract> => {
		const { data } = await axiosInstance.post<AtNeedContract>(
			`/at-need-contracts/${id}/sign`,
		);
		return data;
	},

	cancelAtNeedContract: async (
		id: string,
		reason: string,
	): Promise<AtNeedContract> => {
		const { data } = await axiosInstance.post<AtNeedContract>(
			`/at-need-contracts/${id}/cancel`,
			{ reason },
		);
		return data;
	},
};
