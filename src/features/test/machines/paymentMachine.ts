import { setup, assign } from "xstate";

export interface PaymentData {
  paymentMethod: "cash" | "credit";
  amount: number;
  // Add other payment-related fields
}

export interface PaymentContext {
  data: PaymentData | null;
}

type PaymentEvent =
  | { type: "SAVE"; data: PaymentData }
  | { type: "RESET" }
  | { type: "LOAD"; data: PaymentData };

const createPaymentMachine = (initialContext?: Partial<PaymentContext>) => {
  const machine = setup({
    types: {
      context: {} as PaymentContext,
      events: {} as PaymentEvent,
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

export default createPaymentMachine;
