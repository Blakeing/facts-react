import { setup, assign } from "xstate";
import type { ActorRefFrom } from "xstate";
import createGeneralMachine from "./generalMachine";
import type { GeneralData } from "./generalMachine";
import createPeopleMachine from "./peopleMachine";
import type { PeopleData } from "./peopleMachine";
import createPaymentMachine from "./paymentMachine";
import type { PaymentData } from "./paymentMachine";

type ContractState = "draft" | "executed" | "finalized" | "void";

interface FormData {
  general: GeneralData | null;
  people: PeopleData | null;
  payment: PaymentData | null;
}

type GeneralMachineType = ReturnType<typeof createGeneralMachine>;
type PeopleMachineType = ReturnType<typeof createPeopleMachine>;
type PaymentMachineType = ReturnType<typeof createPaymentMachine>;

interface ContractContext {
  id: string | null;
  contractState: ContractState;
  formData: FormData;
  generalRef: ActorRefFrom<GeneralMachineType> | null;
  peopleRef: ActorRefFrom<PeopleMachineType> | null;
  paymentRef: ActorRefFrom<PaymentMachineType> | null;
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
  | { type: "VOID" };

const createContractMachine = () => {
  const machine = setup({
    types: {
      context: {} as ContractContext,
      events: {} as ContractEvent,
    },
    actions: {
      initializeMachines: assign(({ spawn }) => ({
        generalRef: spawn(createGeneralMachine()),
        peopleRef: spawn(createPeopleMachine()),
        paymentRef: spawn(createPaymentMachine()),
      })),
      loadContract: assign(({ event, spawn }) => {
        if (event.type !== "LOAD_CONTRACT") return {};

        return {
          id: event.data.id,
          contractState: event.data.contractState,
          formData: event.data.formData,
          generalRef: spawn(
            createGeneralMachine({ data: event.data.formData.general })
          ),
          peopleRef: spawn(
            createPeopleMachine({ data: event.data.formData.people })
          ),
          paymentRef: spawn(
            createPaymentMachine({ data: event.data.formData.payment })
          ),
        };
      }),
      updateContractState: assign(({ event }) => {
        if (!["EXECUTE", "FINALIZE", "VOID"].includes(event.type)) return {};
        return {
          contractState: event.type.toLowerCase() as ContractState,
        };
      }),
    },
  });

  return machine.createMachine({
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
      generalRef: null,
      peopleRef: null,
      paymentRef: null,
    },
    entry: "initializeMachines",
    states: {
      draft: {
        on: {
          LOAD_CONTRACT: {
            actions: "loadContract",
          },
          GO_TO_PEOPLE: "people",
          GO_TO_PAYMENT: "payment",
          GO_TO_REVIEW: "review",
        },
      },
      people: {
        on: {
          LOAD_CONTRACT: {
            actions: "loadContract",
          },
          GO_TO_GENERAL: "draft",
          GO_TO_PAYMENT: "payment",
          GO_TO_REVIEW: "review",
        },
      },
      payment: {
        on: {
          LOAD_CONTRACT: {
            actions: "loadContract",
          },
          GO_TO_GENERAL: "draft",
          GO_TO_PEOPLE: "people",
          GO_TO_REVIEW: "review",
        },
      },
      review: {
        on: {
          LOAD_CONTRACT: {
            actions: "loadContract",
          },
          GO_TO_GENERAL: "draft",
          GO_TO_PEOPLE: "people",
          GO_TO_PAYMENT: "payment",
          EXECUTE: {
            target: "executed",
            actions: "updateContractState",
          },
        },
      },
      executed: {
        on: {
          LOAD_CONTRACT: {
            actions: "loadContract",
          },
          FINALIZE: {
            target: "finalized",
            actions: "updateContractState",
          },
          VOID: {
            target: "void",
            actions: "updateContractState",
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
