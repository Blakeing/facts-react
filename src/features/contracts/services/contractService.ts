import {
	type Contract,
	type CreateContractDTO,
	type UpdateContractDTO,
	contractApi,
} from "@/api/contractApi";

class ContractService {
	async getContracts(): Promise<Contract[]> {
		return contractApi.getContracts();
	}

	async getContract(id: string): Promise<Contract> {
		return contractApi.getContract(id);
	}

	async createContract(data: CreateContractDTO): Promise<Contract> {
		console.log("Creating contract with data:", data);

		// Validate contract data
		if (!data.title.trim()) {
			throw new Error("Contract title is required");
		}

		if (!data.parties?.length) {
			throw new Error("At least one party is required");
		}

		// Ensure unique emails
		const emails = new Set(data.parties.map((p) => p.email));
		if (emails.size !== data.parties.length) {
			throw new Error("Duplicate email addresses are not allowed");
		}

		try {
			const result = await contractApi.createContract(data);
			console.log("Contract created successfully:", result);
			return result;
		} catch (error) {
			console.error("Error in contractService.createContract:", error);
			throw error;
		}
	}

	async updateContract(
		id: string,
		updates: UpdateContractDTO,
	): Promise<Contract> {
		// Get current contract
		const current = await this.getContract(id);

		// Validate status transitions
		if (
			updates.status &&
			!this.isValidStatusTransition(current.status, updates.status)
		) {
			throw new Error(
				`Invalid status transition from ${current.status} to ${updates.status}`,
			);
		}

		// Ensure unique emails if updating parties
		if (updates.parties?.length) {
			const emails = new Set(updates.parties.map((p) => p.email));
			if (emails.size !== updates.parties.length) {
				throw new Error("Duplicate email addresses are not allowed");
			}
		}

		return contractApi.updateContract(id, updates);
	}

	async deleteContract(id: string): Promise<void> {
		const contract = await this.getContract(id);

		// Only allow deletion of draft contracts
		if (contract.status !== "draft") {
			throw new Error("Only draft contracts can be deleted");
		}

		return contractApi.deleteContract(id);
	}

	async signContract(id: string): Promise<Contract> {
		const contract = await this.getContract(id);

		// Validate contract can be signed
		if (contract.status !== "draft") {
			throw new Error("Only draft contracts can be signed");
		}

		return contractApi.signContract(id);
	}

	async cancelContract(id: string, reason: string): Promise<Contract> {
		const contract = await this.getContract(id);

		// Validate contract can be cancelled
		if (contract.status !== "active") {
			throw new Error("Only active contracts can be cancelled");
		}

		if (!reason.trim()) {
			throw new Error("Cancellation reason is required");
		}

		return contractApi.cancelContract(id, reason);
	}

	private isValidStatusTransition(
		from: Contract["status"],
		to: Contract["status"],
	): boolean {
		const allowedTransitions: Record<Contract["status"], Contract["status"][]> =
			{
				draft: ["active", "cancelled"],
				active: ["completed", "cancelled"],
				completed: [],
				cancelled: [],
			};

		return allowedTransitions[from].includes(to);
	}
}

export const contractService = new ContractService();
