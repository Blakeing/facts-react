import { setup, assign } from "xstate";
import type {
  SectionsCompleted,
  ContractState,
  FuneralContract,
} from "./types";

// Define machine context type
interface FuneralContext {
  formData: {
    id?: string | undefined;
    general?: { clientName: string } | undefined;
    people?: { familyMembers: string } | undefined;
    payment?: { paymentMethod: "cash" | "credit" } | undefined;
  };
  sectionsCompleted: SectionsCompleted;
  contractState: ContractState;
  currentFormData: {
    id?: string | undefined;
    general?: { clientName: string } | undefined;
    people?: { familyMembers: string } | undefined;
    payment?: { paymentMethod: "cash" | "credit" } | undefined;
  };
}

// Define event types for the machine
type FuneralEvent =
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

type MachineSetup = {
  context: FuneralContext;
  events: FuneralEvent;
};

export const createFuneralContractMachine = (
  initialContext: FuneralContext
) => {
  const machine = setup({
    types: {} as MachineSetup,
    actions: {
      loadContract: assign(({ context, event }) => {
        if (event.type !== "LOAD_CONTRACT") return context;
        console.log(
          "[funeralContractMachine] Loading contract, current context:",
          JSON.stringify(context, null, 2)
        );
        console.log(
          "[funeralContractMachine] Loading contract, event data:",
          JSON.stringify(event.data, null, 2)
        );

        // Ensure we have the contract data
        if (!event.data?.formData?.id) {
          console.error(
            "[funeralContractMachine] No contract ID in data:",
            event.data
          );
          return context;
        }

        // Create the updated form data
        const updatedFormData = {
          id: event.data.id,
          formDataId: event.data.formData.id,
          general: event.data.formData.general || undefined,
          people: event.data.formData.people || undefined,
          payment: event.data.formData.payment || undefined,
        };

        console.log(
          "[funeralContractMachine] Created updated form data:",
          JSON.stringify(updatedFormData, null, 2)
        );

        // Return the new context
        return {
          formData: updatedFormData,
          currentFormData: { ...updatedFormData },
          sectionsCompleted: { ...event.data.sectionsCompleted },
          contractState: event.data.contractState,
        };
      }),
      saveGeneral: assign(({ context, event }) => {
        if (event.type !== "SAVE_GENERAL" || !event.data.general)
          return context;

        const { general } = event.data;
        return {
          ...context,
          formData: { ...context.formData, general },
          currentFormData: { ...context.currentFormData, general },
          sectionsCompleted: { ...context.sectionsCompleted, general: true },
        };
      }),
      savePeople: assign(({ context, event }) => {
        if (event.type !== "SAVE_PEOPLE" || !event.data.people) return context;

        console.log("[funeralContractMachine] Saving people data:", {
          currentFormData: context.formData,
          newPeopleData: event.data.people,
        });

        const { people } = event.data;
        const updatedFormData = {
          ...context.formData,
          people,
        };

        console.log(
          "[funeralContractMachine] Updated form data:",
          updatedFormData
        );

        return {
          ...context,
          formData: updatedFormData,
          currentFormData: { ...updatedFormData },
          sectionsCompleted: { ...context.sectionsCompleted, people: true },
        };
      }),
      savePayment: assign(({ context, event }) => {
        if (event.type !== "SAVE_PAYMENT" || !event.data.payment)
          return context;

        console.log("[funeralContractMachine] Saving payment data:", {
          currentFormData: context.formData,
          newPaymentData: event.data.payment,
        });

        const { payment } = event.data;
        const updatedFormData = {
          ...context.formData,
          payment,
        };

        console.log(
          "[funeralContractMachine] Updated form data:",
          updatedFormData
        );

        return {
          ...context,
          formData: updatedFormData,
          currentFormData: { ...updatedFormData },
          sectionsCompleted: { ...context.sectionsCompleted, payment: true },
        };
      }),
      updateContractState: assign(({ context, event }) => {
        if (!["EXECUTE", "FINALIZE", "VOID"].includes(event.type))
          return context;

        return {
          ...context,
          contractState: event.type.toLowerCase() as ContractState,
        };
      }),
    },
    guards: {
      canAccessPayment: ({ context }) => context.sectionsCompleted.people,
      allSectionsCompleted: ({ context }) =>
        Object.values(context.sectionsCompleted).every(Boolean),
    },
  });

  return machine.createMachine({
    id: "funeralContract",
    initial: "general",
    context: initialContext,
    entry: ({ context }) => {
      console.log(
        "[funeralContractMachine] Machine initialized with context:",
        context
      );
    },
    states: {
      general: {
        entry: ({ context }) => {
          console.log(
            "[funeralContractMachine] Entering general state with context:",
            JSON.stringify(context, null, 2)
          );
        },
        exit: ({ context }) => {
          console.log(
            "[funeralContractMachine] Exiting general state with context:",
            JSON.stringify(context, null, 2)
          );
        },
        on: {
          LOAD_CONTRACT: {
            target: "general",
            actions: ["loadContract"],
            reenter: true,
          },
          SAVE_GENERAL: {
            actions: ["saveGeneral"],
          },
          GO_TO_PEOPLE: {
            target: "people",
            guard: ({ context }) => context.sectionsCompleted.general,
          },
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
          LOAD_CONTRACT: {
            actions: ["loadContract"],
          },
          SAVE_PEOPLE: { actions: "savePeople" },
          GO_TO_GENERAL: "general",
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
      payment: {
        on: {
          LOAD_CONTRACT: {
            actions: ["loadContract"],
          },
          SAVE_PAYMENT: { actions: "savePayment" },
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
          LOAD_CONTRACT: {
            actions: ["loadContract"],
          },
          GO_TO_GENERAL: "general",
          GO_TO_PEOPLE: "people",
          GO_TO_PAYMENT: "payment",
          EXECUTE: {
            target: "executed",
            guard: "allSectionsCompleted",
            actions: "updateContractState",
          },
        },
      },
      executed: {
        on: {
          GO_TO_GENERAL: "general",
          GO_TO_PEOPLE: "people",
          GO_TO_PAYMENT: "payment",
          GO_TO_REVIEW: "review",
          FINALIZE: {
            target: "finalized",
            actions: "updateContractState",
          },
          VOID: {
            target: "voided",
            actions: "updateContractState",
          },
        },
      },
      finalized: {
        type: "final",
      },
      voided: {
        type: "final",
      },
    },
  });
};
