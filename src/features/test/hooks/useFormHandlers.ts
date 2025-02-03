import { useCallback } from "react";
import type { FuneralContract, FuneralEvent } from "../types";
import type { UseContractMutationsReturn } from "./useContractMutations";

export function useFormHandlers(
  send: (event: FuneralEvent) => void,
  mutations: UseContractMutationsReturn,
  contractId?: string
) {
  const { saveContractMutation, updateContractStateMutation } = mutations;

  const handleGeneralSubmit = useCallback(
    (data: { clientName: string }) => {
      console.log("[useFormHandlers] handleGeneralSubmit called with:", data);
      console.log("[useFormHandlers] Using contract ID:", contractId);

      send({ type: "SAVE_GENERAL", data: { general: data } });
      if (!contractId) {
        console.error("[useFormHandlers] No contract ID available");
        return;
      }

      saveContractMutation.mutate({
        id: contractId,
        data: { general: data },
        section: "general",
      });
    },
    [contractId, send, saveContractMutation]
  );

  const handlePeopleSubmit = useCallback(
    (data: { familyMembers: string }) => {
      console.log("[useFormHandlers] handlePeopleSubmit called with:", data);
      console.log("[useFormHandlers] Using contract ID:", contractId);

      send({ type: "SAVE_PEOPLE", data: { people: data } });
      if (!contractId) {
        console.error("[useFormHandlers] No contract ID available");
        return;
      }

      saveContractMutation.mutate({
        id: contractId,
        data: { people: data },
        section: "people",
      });
    },
    [contractId, send, saveContractMutation]
  );

  const handlePaymentSubmit = useCallback(
    (data: { paymentMethod: "cash" | "credit" }) => {
      console.log("[useFormHandlers] handlePaymentSubmit called with:", data);
      console.log("[useFormHandlers] Using contract ID:", contractId);

      send({ type: "SAVE_PAYMENT", data: { payment: data } });
      if (!contractId) {
        console.error("[useFormHandlers] No contract ID available");
        return;
      }

      saveContractMutation.mutate({
        id: contractId,
        data: { payment: data },
        section: "payment",
      });
    },
    [contractId, send, saveContractMutation]
  );

  const handleCreateContract = async () => {
    console.log("[useFormHandlers] handleCreateContract called");
    try {
      const newContract = await saveContractMutation.mutateAsync({
        data: {},
        section: null,
      });

      console.log("[useFormHandlers] Contract created:", newContract);

      // Create the contract data with all fields explicitly set
      const contractData = {
        id: newContract.id,
        formData: {
          id: newContract.formData.id || "", // Ensure we have a string
          general: undefined,
          people: undefined,
          payment: undefined,
        },
        sectionsCompleted: {
          general: false,
          people: false,
          payment: false,
        },
        contractState: "draft" as const,
      };

      console.log(
        "[useFormHandlers] Loading contract with data:",
        contractData
      );

      // Load the contract into the state machine
      send({
        type: "LOAD_CONTRACT",
        data: contractData,
      });

      // No need to transition to general since we're already there
      console.log("[useFormHandlers] Contract loaded and ready for editing");
    } catch (error) {
      console.error("[useFormHandlers] Error creating contract:", error);
    }
  };

  const handleEditContract = useCallback(
    (contract: FuneralContract) => {
      console.log(
        "[useFormHandlers] handleEditContract called with:",
        contract.id
      );
      send({ type: "LOAD_CONTRACT", data: contract });

      if (
        contract.sectionsCompleted.general &&
        contract.sectionsCompleted.people &&
        contract.sectionsCompleted.payment
      ) {
        send({ type: "GO_TO_REVIEW" });
      } else if (
        contract.sectionsCompleted.general &&
        contract.sectionsCompleted.people
      ) {
        send({ type: "GO_TO_PAYMENT" });
      } else if (contract.sectionsCompleted.general) {
        send({ type: "GO_TO_PEOPLE" });
      } else {
        send({ type: "GO_TO_GENERAL" });
      }
    },
    [send]
  );

  const handleContractStateChange = useCallback(
    async (newState: FuneralContract["contractState"]) => {
      console.log(
        "[useFormHandlers] handleContractStateChange called with:",
        newState
      );
      if (!contractId) return;

      try {
        await updateContractStateMutation.mutateAsync({
          contractId,
          newState,
        });
        send({
          type: newState.toUpperCase() as "EXECUTE" | "FINALIZE" | "VOID",
        });
      } catch (error) {
        console.error(`Error updating contract state to ${newState}:`, error);
      }
    },
    [contractId, updateContractStateMutation, send]
  );

  return {
    handleGeneralSubmit,
    handlePeopleSubmit,
    handlePaymentSubmit,
    handleCreateContract,
    handleEditContract,
    handleContractStateChange,
  };
}
