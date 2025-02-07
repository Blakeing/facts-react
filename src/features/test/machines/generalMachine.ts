import { setup, assign } from "xstate";

export interface GeneralData {
	serviceDate: Date;
	contractSignDate: Date;
	prePrintedContractNumber?: string;
	funeralDirector: string;
	atNeedType: string;
	contractType: string;
	campaign: string;
}

export interface GeneralContext {
	data: GeneralData | null;
}

export type GeneralEvent = { type: "UPDATE_GENERAL"; data: GeneralData };

const createGeneralMachine = (initialContext?: Partial<GeneralContext>) => {
	const machine = setup({
		types: {
			context: {} as GeneralContext,
			events: {} as GeneralEvent,
		},
		actions: {
			saveData: assign(({ event }) => {
				if (event.type !== "UPDATE_GENERAL") return {};
				return {
					data: event.data,
				};
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
					UPDATE_GENERAL: {
						actions: "saveData",
					},
				},
			},
		},
	});
};

export default createGeneralMachine;
