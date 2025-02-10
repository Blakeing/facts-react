import { produce } from "immer";
import { assign, setup } from "xstate";

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

const createBuyerMachine = (initialContext?: Partial<BuyerContext>) => {
	return setup({
		types: {
			context: {} as BuyerContext,
			events: {} as
				| { type: "UPDATE_BUYER"; data: BuyerData }
				| { type: "UPDATE_NAME"; data: Partial<Name> }
				| {
						type: "UPDATE_ADDRESS";
						data: Partial<Address>;
						addressType: "physical" | "mailing";
				  }
				| { type: "UPDATE_PHONE"; data: Phone; index: number }
				| { type: "ADD_PHONE"; data: Phone }
				| { type: "REMOVE_PHONE"; index: number },
		},
		actions: {
			saveData: assign({
				data: ({ event }) => {
					if (event.type !== "UPDATE_BUYER") return null;
					return event.data;
				},
			}),
			updateName: assign({
				data: ({ context, event }) => {
					if (event.type !== "UPDATE_NAME" || !context.data)
						return context.data;
					return produce(context.data, (draft) => {
						Object.assign(draft.name, event.data);
					});
				},
			}),
			updateAddress: assign({
				data: ({ context, event }) => {
					if (event.type !== "UPDATE_ADDRESS" || !context.data)
						return context.data;
					return produce(context.data, (draft) => {
						if (event.addressType === "physical") {
							Object.assign(draft.physicalAddress, event.data);
						} else {
							if (!draft.mailingAddress) {
								draft.mailingAddress = {} as Address;
							}
							Object.assign(draft.mailingAddress, event.data);
						}
					});
				},
			}),
			updatePhone: assign({
				data: ({ context, event }) => {
					if (event.type !== "UPDATE_PHONE" || !context.data)
						return context.data;
					return produce(context.data, (draft) => {
						draft.phones[event.index] = event.data;
					});
				},
			}),
			addPhone: assign({
				data: ({ context, event }) => {
					if (event.type !== "ADD_PHONE" || !context.data) return context.data;
					return produce(context.data, (draft) => {
						draft.phones.push(event.data);
					});
				},
			}),
			removePhone: assign({
				data: ({ context, event }) => {
					if (event.type !== "REMOVE_PHONE" || !context.data)
						return context.data;
					return produce(context.data, (draft) => {
						draft.phones.splice(event.index, 1);
					});
				},
			}),
		},
	}).createMachine({
		/** @xstate-layout N4IgpgJg5mDOIC5QCMCuBPMAnAymAxgC4CWA9gHYB0xEANmAMQCqACgCICCAKgKID6AISYBNHgCUA2gAYAuolAAHUrGIkK8kAA9EAVgBMlPXoBsO43p0AaEOl3GAjJQAcATinmdAX0-W0mXARqVDT0zOzc-AByHACyPNJySCBKKkEa2gg6OpQAzE56TvYW1rYIACymzkVePiB+2HhEZMF0jKycvHwcbGxiPDg4CRopqs3piGV6JYg5xi6UAOw5ZTkLNb4YDYHN1K1hHfwsABIA8pHxssPKo+pJGTpSlC4Lph7TCHpLlK8W3hv+jSCu1C3TYfGOZwuiUU1zSd0QxjK3wW9ica3e9gWC0oOgWhV+tXqASaFGBjD6MROADVDqdzkMkiM4aAMmV5vYcgVqu9CjjvLVyKQIHANETAWNGbCJSzEABaYzveV-OqbYlAkJgK6paVaRAuJyGKQ5bk2BHmJ7GNE1bxAA */
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
					UPDATE_NAME: {
						actions: "updateName",
					},
					UPDATE_ADDRESS: {
						actions: "updateAddress",
					},
					UPDATE_PHONE: {
						actions: "updatePhone",
					},
					ADD_PHONE: {
						actions: "addPhone",
					},
					REMOVE_PHONE: {
						actions: "removePhone",
					},
				},
			},
		},
	});
};

export default createBuyerMachine;
