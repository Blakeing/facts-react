import {
	type CreateAtNeedContractDTO,
	type UpdateAtNeedContractDTO,
	atNeedContractApi,
} from "../api/atNeedContractApi";
import type { AtNeedContract } from "../types";

class AtNeedContractService {
	async getContracts() {
		try {
			const contracts = await atNeedContractApi.getAtNeedContracts();
			return this.sortContractsByDate(contracts);
		} catch (error) {
			console.error("Service: Error fetching at-need contracts:", error);
			throw error;
		}
	}

	async getContract(id: string) {
		try {
			return await atNeedContractApi.getAtNeedContract(id);
		} catch (error) {
			console.error(`Service: Error fetching at-need contract ${id}:`, error);
			throw error;
		}
	}

	async createContract(data: CreateAtNeedContractDTO) {
		try {
			return await atNeedContractApi.createAtNeedContract(data);
		} catch (error) {
			console.error("Service: Error creating at-need contract:", error);
			throw error;
		}
	}

	async updateContract(id: string, data: UpdateAtNeedContractDTO) {
		try {
			return await atNeedContractApi.updateAtNeedContract(id, data);
		} catch (error) {
			console.error(`Service: Error updating at-need contract ${id}:`, error);
			throw error;
		}
	}

	async deleteContract(id: string) {
		try {
			await atNeedContractApi.deleteAtNeedContract(id);
		} catch (error) {
			console.error(`Service: Error deleting at-need contract ${id}:`, error);
			throw error;
		}
	}

	async signContract(id: string) {
		try {
			return await atNeedContractApi.signAtNeedContract(id);
		} catch (error) {
			console.error(`Service: Error signing at-need contract ${id}:`, error);
			throw error;
		}
	}

	async cancelContract(id: string, reason: string) {
		try {
			return await atNeedContractApi.cancelAtNeedContract(id, reason);
		} catch (error) {
			console.error(`Service: Error canceling at-need contract ${id}:`, error);
			throw error;
		}
	}

	private sortContractsByDate(contracts: AtNeedContract[]) {
		return [...contracts].sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);
	}
}

export const atNeedContractService = new AtNeedContractService();
