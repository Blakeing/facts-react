import { setup, assign } from "xstate";

export interface GeneralData {
  clientName: string;
  // Add other general form fields
}

export interface GeneralContext {
  data: GeneralData | null;
}

export type GeneralEvent =
  | { type: "SAVE"; data: GeneralData }
  | { type: "RESET" }
  | { type: "LOAD"; data: GeneralData };

const createGeneralMachine = (initialContext?: Partial<GeneralContext>) => {
  const machine = setup({
    types: {
      context: {} as GeneralContext,
      events: {} as GeneralEvent,
    },
    actions: {
      saveData: assign(({ event }) => {
        if (event.type !== "SAVE" && event.type !== "LOAD") return {};
        console.log("[GeneralMachine] Saving data:", event.data);
        return {
          data: event.data,
        };
      }),
      reset: assign({
        data: null,
      }),
    },
  });

  return machine.createMachine({
    id: "generalSection",
    initial: "idle",
    context: {
      data: null,
      ...initialContext,
    },
    states: {
      idle: {
        on: {
          SAVE: {
            actions: "saveData",
          },
          LOAD: {
            actions: "saveData",
          },
          RESET: {
            actions: "reset",
          },
        },
      },
    },
  });
};

export default createGeneralMachine;
