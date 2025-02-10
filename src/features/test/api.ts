import type { Contract } from "./types";

const API_URL = "http://localhost:3001/contracts";

// Helper function to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function handleResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		throw new Error(`API Error: ${response.statusText}`);
	}
	return response.json();
}

export const api = {
	fetch: async (id: string) => {
		// Simulate network delay (1.5 seconds)
		// await delay(1500);
		return fetch(`${API_URL}/${id}`).then(handleResponse<Contract>);
	},

	fetchAll: () => fetch(API_URL).then(handleResponse<Contract[]>),

	create: (contract: Omit<Contract, "id">) =>
		fetch(API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...contract, id: crypto.randomUUID() }),
		}).then(handleResponse<Contract>),

	update: (id: string, contract: Contract) =>
		fetch(`${API_URL}/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(contract),
		}).then(handleResponse<Contract>),
};
