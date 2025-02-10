import { setup, assign } from "xstate";

export interface PeopleData {
  familyMembers: Array<{
    id: string;
    name: string;
  }>;
}

export interface PeopleContext {
  data: PeopleData | null;
}

export type PeopleEvent = { type: "SAVE"; data: PeopleData };

const createPeopleMachine = (initialContext?: Partial<PeopleContext>) => {
  const machine = setup({
    types: {
      context: {} as PeopleContext,
      events: {} as PeopleEvent,
    },
    actions: {
      saveData: assign(({ event }) => ({
        data: event.data,
      })),
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
        },
      },
    },
  });
};

export default createPeopleMachine;
