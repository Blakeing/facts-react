import { v4 as uuidv4 } from "uuid";
import type { FuneralContract } from "./types";
import type { ContractState } from "./types";

const API_URL = "http://localhost:3001/contracts";

// Fetch a contract by ID
export const fetchContract = async (
  contractId: string
): Promise<FuneralContract> => {
  const response = await fetch(`${API_URL}/${contractId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch contract");
  }
  return response.json();
};

// Save (create or update) a contract
export const saveContract = async (
  contract: FuneralContract
): Promise<FuneralContract> => {
  console.log("Saving contract:", contract);

  if (contract.id) {
    console.log("Updating existing contract");
    const response = await fetch(`${API_URL}/${contract.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contract),
    });

    if (!response.ok) {
      throw new Error("Failed to update contract");
    }

    return response.json();
  }

  console.log("Creating new contract");
  const newContract = {
    ...contract,
    id: uuidv4(),
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newContract),
  });

  if (!response.ok) {
    throw new Error("Failed to create contract");
  }

  return response.json();
};

// Update only the contract state
export const updateContractState = async (
  contractId: string,
  contractState: ContractState
): Promise<FuneralContract> => {
  console.log("Updating contract state:", { contractId, contractState });
  const response = await fetch(`${API_URL}/${contractId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contractState }),
  });

  if (!response.ok) {
    throw new Error("Failed to update contract state");
  }

  return response.json();
};
