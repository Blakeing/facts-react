import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Contract } from "../types";

const API_URL = "http://localhost:3001";

// Helper function to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useContracts = () => {
  return useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      // Simulate network delay (800ms)
      await delay(800);
      const { data } = await axios.get<Contract[]>(`${API_URL}/contracts`);
      return data;
    },
  });
};
