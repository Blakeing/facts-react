import {
	type CreatePreNeedContractDTO,
	type UpdatePreNeedContractDTO,
	preNeedContractApi,
} from "../api/preNeedContractApi";
import type { PreNeedContract } from "../types";

class PreNeedContractService {
	async getContracts() {
		try {
			const contracts = await preNeedContractApi.getPreNeedContracts();
			return this.sortContractsByDate(contracts);
		} catch (error) {
			console.error("Service: Error fetching pre-need contracts:", error);
			throw error;
		}
	}

	async getContract(id: string) {
		try {
			return await preNeedContractApi.getPreNeedContract(id);
		} catch (error) {
			console.error(`Service: Error fetching pre-need contract ${id}:`, error);
			throw error;
		}
	}

	async createContract(data: CreatePreNeedContractDTO) {
		try {
			// Add business logic validation here
			if (data.monthlyPayment > data.totalAmount) {
				throw new Error("Monthly payment cannot exceed total amount");
			}

			return await preNeedContractApi.createPreNeedContract(data);
		} catch (error) {
			console.error("Service: Error creating pre-need contract:", error);
			throw error;
		}
	}

	async updateContract(id: string, data: UpdatePreNeedContractDTO) {
		try {
			// Add business logic validation here
			if (
				data.monthlyPayment &&
				data.totalAmount &&
				data.monthlyPayment > data.totalAmount
			) {
				throw new Error("Monthly payment cannot exceed total amount");
			}

			return await preNeedContractApi.updatePreNeedContract(id, data);
		} catch (error) {
			console.error(`Service: Error updating pre-need contract ${id}:`, error);
			throw error;
		}
	}

	async deleteContract(id: string) {
		try {
			await preNeedContractApi.deletePreNeedContract(id);
		} catch (error) {
			console.error(`Service: Error deleting pre-need contract ${id}:`, error);
			throw error;
		}
	}

	async signContract(id: string) {
		try {
			return await preNeedContractApi.signPreNeedContract(id);
		} catch (error) {
			console.error(`Service: Error signing pre-need contract ${id}:`, error);
			throw error;
		}
	}

	async cancelContract(id: string, reason: string) {
		try {
			return await preNeedContractApi.cancelPreNeedContract(id, reason);
		} catch (error) {
			console.error(`Service: Error canceling pre-need contract ${id}:`, error);
			throw error;
		}
	}

	private sortContractsByDate(contracts: PreNeedContract[]) {
		return [...contracts].sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);
	}
}

export const preNeedContractService = new PreNeedContractService();
