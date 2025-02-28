export interface Property {
	id: number;
	name: string;
	location: string;
	description: string;
}

export interface Section {
	id: number;
	name: string;
	propertyId: number;
	description: string;
}

export interface Lot {
	id: number;
	name: string;
	sectionId: number;
	description: string;
}

export interface Block {
	id: number;
	name: string;
	lotId: number;
	description: string;
}

export interface Grave {
	id: number;
	name: string;
	blockId: number;
	status: string;
	locationNotes: string;
	price: number;
	size: string;
}

// API response types
export type PropertiesResponse = Property[];
export type SectionsResponse = Section[];
export type LotsResponse = Lot[];
export type BlocksResponse = Block[];
export type GravesResponse = Grave[];
