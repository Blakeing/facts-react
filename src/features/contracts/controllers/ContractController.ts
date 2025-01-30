import type { CreateContractDTO, UpdateContractDTO } from "@/api/contractApi";
import { useContractStore } from "../state/useContractStore";

export namespace ContractController {
	export async function loadContracts() {
		return useContractStore.getState().fetchContracts();
	}

	export async function loadContract(id: string) {
		return useContractStore.getState().fetchContract(id);
	}

	export async function createContract(data: CreateContractDTO) {
		// Additional validation or business logic can be added here
		if (!data.title.trim()) {
			throw new Error("Contract title is required");
		}

		if (!data.parties?.length) {
			throw new Error("At least one party is required");
		}

		return useContractStore.getState().createContract(data);
	}

	export async function updateContract(id: string, data: UpdateContractDTO) {
		// Additional validation or business logic can be added here
		if (data.title && !data.title.trim()) {
			throw new Error("Contract title cannot be empty");
		}

		return useContractStore.getState().updateContract(id, data);
	}

	export async function deleteContract(id: string) {
		const contract = useContractStore
			.getState()
			.contracts.find((c) => c.id === id);
		if (!contract) {
			throw new Error("Contract not found");
		}

		// Additional validation or business logic can be added here
		if (contract.status !== "draft") {
			throw new Error("Only draft contracts can be deleted");
		}

		return useContractStore.getState().deleteContract(id);
	}

	export async function signContract(id: string) {
		const contract = useContractStore
			.getState()
			.contracts.find((c) => c.id === id);
		if (!contract) {
			throw new Error("Contract not found");
		}

		// Additional validation or business logic can be added here
		if (contract.status !== "draft") {
			throw new Error("Only draft contracts can be signed");
		}

		return useContractStore.getState().signContract(id);
	}

	export async function cancelContract(id: string, reason: string) {
		const contract = useContractStore
			.getState()
			.contracts.find((c) => c.id === id);
		if (!contract) {
			throw new Error("Contract not found");
		}

		// Additional validation or business logic can be added here
		if (contract.status !== "active") {
			throw new Error("Only active contracts can be cancelled");
		}

		if (!reason.trim()) {
			throw new Error("Cancellation reason is required");
		}

		return useContractStore.getState().cancelContract(id, reason);
	}

	export function getContractById(id: string) {
		return useContractStore.getState().contracts.find((c) => c.id === id);
	}

	export function getContractsByStatus(status: string) {
		return useContractStore
			.getState()
			.contracts.filter((c) => c.status === status);
	}

	export function getContractsByParty(email: string) {
		return useContractStore
			.getState()
			.contracts.filter((c) => c.parties.some((p) => p.email === email));
	}

	export function clearError() {
		return useContractStore.getState().clearError();
	}
}
