// Form data types
type GeneralData = { clientName: string } | null;
type FamilyMember = { id: string; name: string };
type PaymentData = { paymentMethod: "cash" | "credit"; amount: number } | null;

export type ContractState = "draft" | "executed" | "finalized" | "void";

export interface Contract {
  id: string;
  contractState: ContractState;
  formData: {
    general: GeneralData;
    people: { familyMembers: FamilyMember[] } | null;
    payment: PaymentData;
  };
}
