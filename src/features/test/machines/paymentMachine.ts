import { setup, assign } from "xstate";

export interface PaymentData {
  paymentMethod: "cash" | "credit";
  amount: number;
}

export interface PaymentContext {
  data: PaymentData | null;
}

export type PaymentEvent = { type: "SAVE"; data: PaymentData };

const createPaymentMachine = (initialContext?: Partial<PaymentContext>) => {
  const machine = setup({
    types: {
      context: {} as PaymentContext,
      events: {} as PaymentEvent,
    },
    actions: {
      saveData: assign(({ event }) => ({
        data: event.data,
      })),
    },
  });

  return machine.createMachine({
    id: "paymentSection",
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

export default createPaymentMachine;
