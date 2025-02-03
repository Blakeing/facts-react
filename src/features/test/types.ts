export interface FuneralContractFormData {
  id?: string;
  general?:
    | {
        clientName: string;
      }
    | undefined;
  people?:
    | {
        familyMembers: string;
      }
    | undefined;
  payment?:
    | {
        paymentMethod: "cash" | "credit";
      }
    | undefined;
}

export interface SectionsCompleted {
  general: boolean;
  people: boolean;
  payment: boolean;
}

export type ContractState = "draft" | "executed" | "finalized" | "voided";

export interface FuneralContract {
  id: string;
  formData: FuneralContractFormData;
  contractState: ContractState;
  sectionsCompleted: SectionsCompleted;
}

export type SaveContractInput = Omit<FuneralContract, "id"> & { id?: string };

// Type guards
export const isLoadContractEvent = (event: {
  type: string;
  data?: unknown;
}): event is { type: "LOAD_CONTRACT"; data: FuneralContract } => {
  return event.type === "LOAD_CONTRACT" && event.data !== undefined;
};

export const isSaveGeneralEvent = (event: {
  type: string;
  data?: unknown;
}): event is { type: "SAVE_GENERAL"; data: FuneralContractFormData } => {
  return event.type === "SAVE_GENERAL" && event.data?.general !== undefined;
};

export const isSavePeopleEvent = (event: {
  type: string;
  data?: unknown;
}): event is { type: "SAVE_PEOPLE"; data: FuneralContractFormData } => {
  return event.type === "SAVE_PEOPLE" && event.data?.people !== undefined;
};

export const isSavePaymentEvent = (event: {
  type: string;
  data?: unknown;
}): event is { type: "SAVE_PAYMENT"; data: FuneralContractFormData } => {
  return event.type === "SAVE_PAYMENT" && event.data?.payment !== undefined;
};

export type FuneralEvent =
  | { type: "GO_TO_GENERAL" }
  | { type: "GO_TO_PEOPLE" }
  | { type: "GO_TO_PAYMENT" }
  | { type: "GO_TO_REVIEW" }
  | { type: "SAVE_GENERAL"; data: { general: { clientName: string } } }
  | { type: "SAVE_PEOPLE"; data: { people: { familyMembers: string } } }
  | {
      type: "SAVE_PAYMENT";
      data: { payment: { paymentMethod: "cash" | "credit" } };
    }
  | { type: "LOAD_CONTRACT"; data: FuneralContract }
  | { type: "EXECUTE" }
  | { type: "FINALIZE" }
  | { type: "VOID" };
