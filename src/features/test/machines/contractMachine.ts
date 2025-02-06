import { setup, assign } from "xstate";
import type { GeneralData } from "./generalMachine";
import type { PeopleData } from "./peopleMachine";
import type { PaymentData } from "./paymentMachine";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Contract } from "../types";

type ContractState = "draft" | "executed" | "finalized" | "void";

interface FormData {
  general: GeneralData | null;
  people: PeopleData | null;
  payment: PaymentData | null;
}

interface ContractContext {
  id: string | null;
  contractState: ContractState;
  formData: FormData;
}

interface LoadContractData {
  id: string;
  contractState: ContractState;
  formData: FormData;
}

type ContractEvent =
  | { type: "LOAD_CONTRACT"; data: LoadContractData }
  | { type: "GO_TO_GENERAL" }
  | { type: "GO_TO_PEOPLE" }
  | { type: "GO_TO_PAYMENT" }
  | { type: "GO_TO_REVIEW" }
  | { type: "EXECUTE" }
  | { type: "FINALIZE" }
  | { type: "VOID" }
  | { type: "SAVE_CONTRACT" }
  | { type: "UPDATE_GENERAL"; data: GeneralData }
  | { type: "UPDATE_PEOPLE"; data: PeopleData }
  | { type: "UPDATE_PAYMENT"; data: PaymentData };

interface ContractServices {
  mutations: {
    updateMutation: UseMutationResult<any, Error, Contract>;
    createMutation: UseMutationResult<any, Error, Omit<Contract, "id">>;
  };
}

const createContractMachine = () => {
  return setup({
    types: {} as {
      context: ContractContext;
      events: ContractEvent;
      input: ContractServices;
    },
    actions: {
      loadContract: assign(({ event }) => {
        if (event.type !== "LOAD_CONTRACT") return {};
        return {
          id: event.data.id,
          contractState: event.data.contractState,
          formData: event.data.formData,
        };
      }),
      updateGeneralData: assign({
        formData: ({ context, event }) => {
          if (event.type !== "UPDATE_GENERAL") return context.formData;
          return {
            ...context.formData,
            general: event.data,
          };
        },
      }),
      updatePeopleData: assign({
        formData: ({ context, event }) => {
          if (event.type !== "UPDATE_PEOPLE") return context.formData;
          return {
            ...context.formData,
            people: event.data,
          };
        },
      }),
      updatePaymentData: assign({
        formData: ({ context, event }) => {
          if (event.type !== "UPDATE_PAYMENT") return context.formData;
          return {
            ...context.formData,
            payment: event.data,
          };
        },
      }),
      updateContractState: assign(({ event }) => {
        if (!["EXECUTE", "FINALIZE", "VOID"].includes(event.type)) return {};
        return {
          contractState: event.type.toLowerCase() as ContractState,
        };
      }),
    },
  }).createMachine({
    id: "contract",
    initial: "draft",
    context: {
      id: null,
      contractState: "draft",
      formData: {
        general: null,
        people: null,
        payment: null,
      },
    },
    states: {
      draft: {
        on: {
          LOAD_CONTRACT: {
            actions: ["loadContract"],
          },
          UPDATE_GENERAL: {
            actions: ["updateGeneralData"],
          },
          GO_TO_PEOPLE: "people",
          GO_TO_PAYMENT: "payment",
          GO_TO_REVIEW: "review",
        },
      },
      people: {
        on: {
          LOAD_CONTRACT: {
            actions: ["loadContract"],
          },
          UPDATE_PEOPLE: {
            actions: ["updatePeopleData"],
          },
          GO_TO_GENERAL: "draft",
          GO_TO_PAYMENT: "payment",
          GO_TO_REVIEW: "review",
        },
      },
      payment: {
        on: {
          LOAD_CONTRACT: {
            actions: ["loadContract"],
          },
          UPDATE_PAYMENT: {
            actions: ["updatePaymentData"],
          },
          GO_TO_GENERAL: "draft",
          GO_TO_PEOPLE: "people",
          GO_TO_REVIEW: "review",
        },
      },
      review: {
        on: {
          LOAD_CONTRACT: {
            actions: ["loadContract"],
          },
          GO_TO_GENERAL: "draft",
          GO_TO_PEOPLE: "people",
          GO_TO_PAYMENT: "payment",
          EXECUTE: {
            target: "executed",
            actions: ["updateContractState"],
          },
        },
      },
      executed: {
        on: {
          LOAD_CONTRACT: {
            actions: ["loadContract"],
          },
          FINALIZE: {
            target: "finalized",
            actions: ["updateContractState"],
          },
          VOID: {
            target: "void",
            actions: ["updateContractState"],
          },
        },
      },
      finalized: {
        type: "final",
      },
      void: {
        type: "final",
      },
    },
  });
};

export default createContractMachine;
