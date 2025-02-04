import { setup, assign } from "xstate";

export interface PeopleData {
  familyMembers: Array<{
    id: string;
    name: string;
  }>;
  // Add other people-related fields
}

export interface PeopleContext {
  data: PeopleData | null;
}

type PeopleEvent =
  | { type: "SAVE"; data: PeopleData }
  | { type: "RESET" }
  | { type: "LOAD"; data: PeopleData };

const createPeopleMachine = (initialContext?: Partial<PeopleContext>) => {
  const machine = setup({
    types: {
      context: {} as PeopleContext,
      events: {} as PeopleEvent,
    },
    actions: {
      saveData: assign(({ event }) => {
        if (event.type !== "SAVE" && event.type !== "LOAD") return {};
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
    id: "peopleSection",
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

export default createPeopleMachine;
