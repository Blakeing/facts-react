export interface FuneralContractFormData {
  general?: {
    clientName: string;
  };
  people?: {
    familyMembers: string;
  };
  payment?: {
    paymentMethod: "cash" | "credit";
  };
}

export interface SectionsCompleted {
  general: boolean;
  people: boolean;
  payment: boolean;
}

export type ContractState = "draft" | "executed" | "finalized" | "voided";

export interface FuneralContract {
  id?: string;
  formData: FuneralContractFormData;
  contractState: ContractState;
  sectionsCompleted: SectionsCompleted;
}
