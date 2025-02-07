import { setup, assign } from "xstate";

export interface Name {
	first: string;
	last: string;
	prefix: string | undefined;
	middle: string | undefined;
	suffix: string | undefined;
	companyName: string | undefined;
	nickname: string | undefined;
	maiden: string | undefined;
	gender: string | undefined;
}

export interface Address {
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
}

export interface Identification {
	stateIdNumber: string;
	issuer: string;
}

export interface Dates {
	dateOfBirth: string | undefined;
	dateOfDeath: string | undefined;
	isDeceased: boolean;
}

export interface Phone {
	number: string;
	type: string;
	isPreferred: boolean;
}

export interface Email {
	address: string;
	isPreferred: boolean;
}

export interface BuyerData {
	name: Name;
	physicalAddress: Address;
	mailingAddressSameAsPhysical: boolean;
	mailingAddress: Address | undefined;
	identification: Identification;
	dates: Dates;
	role: string | undefined;
	ethnicity: string | undefined;
	race: string | undefined;
	isVeteran: boolean;
	phones: Phone[];
	emails: Email[];
	optOutOfFutureMarketing: boolean;
}

export interface BuyerContext {
	data: BuyerData | null;
}

export type BuyerEvent = { type: "UPDATE_BUYER"; data: BuyerData };

const createBuyerMachine = (initialContext?: Partial<BuyerContext>) => {
	const machine = setup({
		types: {
			context: {} as BuyerContext,
			events: {} as BuyerEvent,
		},
		actions: {
			saveData: assign(({ event }) => ({
				data: event.data,
			})),
		},
	});

	return machine.createMachine({
		id: "buyerSection",
		initial: "idle",
		context: {
			data: null,
			...initialContext,
		},
		states: {
			idle: {
				on: {
					UPDATE_BUYER: {
						actions: "saveData",
					},
				},
			},
		},
	});
};

export default createBuyerMachine;
