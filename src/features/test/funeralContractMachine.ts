import { setup } from "xstate";
import type {
  FuneralContractFormData,
  SectionsCompleted,
  ContractState,
} from "./types";

// Define machine context type
interface FuneralContext {
  formData: FuneralContractFormData;
  sectionsCompleted: SectionsCompleted;
  contractState: ContractState;
}

// Define event types for the machine
type FuneralEvent =
  | { type: "GO_TO_GENERAL" }
  | { type: "GO_TO_PEOPLE" }
  | { type: "GO_TO_PAYMENT" }
  | { type: "GO_TO_REVIEW" }
  | { type: "SAVE_GENERAL"; data: FuneralContractFormData }
  | { type: "SAVE_PEOPLE"; data: FuneralContractFormData }
  | { type: "SAVE_PAYMENT"; data: FuneralContractFormData }
  | { type: "EXECUTE" }
  | { type: "FINALIZE" }
  | { type: "VOID" };

export const createFuneralContractMachine = (
  initialContext: FuneralContext
) => {
  return setup({
    types: {
      context: {} as FuneralContext,
      events: {} as FuneralEvent,
      input: {} as { type: never },
    },
    guards: {
      canAccessPayment: ({ context }) => context.sectionsCompleted.people,
      allSectionsCompleted: ({ context }) => {
        console.log("Checking sections completed:", context.sectionsCompleted);
        return (
          context.sectionsCompleted.general &&
          context.sectionsCompleted.people &&
          context.sectionsCompleted.payment
        );
      },
    },
    actions: {
      saveGeneral: ({ context }, event: FuneralEvent) => {
        if (event.type === "SAVE_GENERAL") {
          context.formData = event.data;
          context.sectionsCompleted.general = true;
        }
      },
      savePeople: ({ context }, event: FuneralEvent) => {
        if (event.type === "SAVE_PEOPLE") {
          context.formData = event.data;
          context.sectionsCompleted.people = true;
        }
      },
      savePayment: ({ context }, event: FuneralEvent) => {
        if (event.type === "SAVE_PAYMENT") {
          context.formData = event.data;
          context.sectionsCompleted.payment = true;
        }
      },
    },
  }).createMachine({
    id: "funeralContract",
    initial: "general",
    context: initialContext,
    states: {
      general: {
        on: {
          SAVE_GENERAL: {
            actions: ({ context, event }) => {
              if (event.type === "SAVE_GENERAL") {
                context.formData = event.data;
                context.sectionsCompleted.general = true;
              }
            },
          },
          GO_TO_PEOPLE: "people",
          GO_TO_PAYMENT: {
            target: "payment",
            guard: "canAccessPayment",
          },
          GO_TO_REVIEW: {
            target: "review",
            guard: "allSectionsCompleted",
          },
        },
      },
      people: {
        on: {
          SAVE_PEOPLE: {
            actions: ({ context, event }) => {
              if (event.type === "SAVE_PEOPLE") {
                context.formData = event.data;
                context.sectionsCompleted.people = true;
              }
            },
          },
          GO_TO_GENERAL: "general",
          GO_TO_PAYMENT: "payment",
          GO_TO_REVIEW: {
            target: "review",
            guard: "allSectionsCompleted",
          },
        },
      },
      payment: {
        on: {
          SAVE_PAYMENT: {
            actions: ({ context, event }) => {
              if (event.type === "SAVE_PAYMENT") {
                context.formData = event.data;
                context.sectionsCompleted.payment = true;
              }
            },
          },
          GO_TO_GENERAL: "general",
          GO_TO_PEOPLE: "people",
          GO_TO_REVIEW: {
            target: "review",
            guard: "allSectionsCompleted",
          },
        },
      },
      review: {
        on: {
          GO_TO_GENERAL: "general",
          GO_TO_PEOPLE: "people",
          GO_TO_PAYMENT: "payment",
          EXECUTE: {
            target: "executed",
            guard: "allSectionsCompleted",
          },
        },
      },
      executed: {
        on: {
          GO_TO_GENERAL: "general",
          GO_TO_PEOPLE: "people",
          GO_TO_PAYMENT: "payment",
          GO_TO_REVIEW: "review",
          FINALIZE: "finalized",
          VOID: "voided",
        },
      },
      finalized: {
        type: "final",
        on: {
          GO_TO_GENERAL: "general",
          GO_TO_PEOPLE: "people",
          GO_TO_PAYMENT: "payment",
          GO_TO_REVIEW: "review",
        },
      },
      voided: {
        type: "final",
        on: {
          GO_TO_GENERAL: "general",
          GO_TO_PEOPLE: "people",
          GO_TO_PAYMENT: "payment",
          GO_TO_REVIEW: "review",
        },
      },
    },
  });
};
