import axiosInstance from "./axiosInstance";

export interface Contract {
	id: string;
	title: string;
	description?: string;
	status: "draft" | "active" | "completed" | "cancelled";
	createdAt: string;
	updatedAt: string;
	ownerId: string;
	parties: {
		id: string;
		name: string;
		email: string;
		role: "owner" | "signer" | "viewer";
	}[];
}

export interface CreateContractDTO {
	title: string;
	description?: string;
	parties: {
		email: string;
		name: string;
		role: "signer" | "viewer";
	}[];
}

export interface UpdateContractDTO {
	title?: string;
	description?: string;
	status?: Contract["status"];
	parties?: Contract["parties"];
	updatedAt?: string;
}

export const contractApi = {
	getContracts: async (): Promise<Contract[]> => {
		const { data } = await axiosInstance.get<Contract[]>("/contracts");
		return data;
	},

	getContract: async (id: string): Promise<Contract> => {
		const { data } = await axiosInstance.get<Contract>(`/contracts/${id}`);
		return data;
	},

	createContract: async (contract: CreateContractDTO): Promise<Contract> => {
		const { data } = await axiosInstance.post<Contract>("/contracts", contract);
		return data;
	},

	updateContract: async (
		id: string,
		updates: UpdateContractDTO,
	): Promise<Contract> => {
		const { data } = await axiosInstance.patch<Contract>(
			`/contracts/${id}`,
			updates,
		);
		return data;
	},

	deleteContract: async (id: string): Promise<void> => {
		await axiosInstance.delete(`/contracts/${id}`);
	},

	// Contract actions
	signContract: async (id: string): Promise<Contract> => {
		const contract = await contractApi.getContract(id);
		const updates: UpdateContractDTO = {
			status: "active",
			updatedAt: new Date().toISOString(),
		};
		return contractApi.updateContract(id, updates);
	},

	cancelContract: async (id: string, reason: string): Promise<Contract> => {
		const contract = await contractApi.getContract(id);
		const updates: UpdateContractDTO = {
			status: "cancelled",
			updatedAt: new Date().toISOString(),
		};
		return contractApi.updateContract(id, updates);
	},

	// Contract sharing
	shareContract: async (
		id: string,
		email: string,
		role: "signer" | "viewer",
	): Promise<Contract> => {
		const contract = await contractApi.getContract(id);
		const updates: UpdateContractDTO = {
			parties: [
				...contract.parties,
				{
					id: Date.now().toString(),
					name: email.split("@")[0] || "Unknown User",
					email,
					role,
				},
			],
		};
		return contractApi.updateContract(id, updates);
	},

	removeParty: async (id: string, partyId: string): Promise<Contract> => {
		const contract = await contractApi.getContract(id);
		const updates: UpdateContractDTO = {
			parties: contract.parties.filter((p) => p.id !== partyId),
		};
		return contractApi.updateContract(id, updates);
	},
};
