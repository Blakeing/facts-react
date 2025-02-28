import axios from "axios";
import { DB_CONFIG } from "@/config/db";
import type {
	Property,
	Section,
	Lot,
	Block,
	Grave,
	PropertiesResponse,
	SectionsResponse,
	LotsResponse,
	BlocksResponse,
	GravesResponse,
} from "../types";

// Update the API_URL to point to JSON Server with the property database
const API_URL = `${DB_CONFIG.baseUrl}`;

// Properties API
export const getProperties = async (): Promise<PropertiesResponse> => {
	const response = await axios.get<PropertiesResponse>(`${API_URL}/properties`);
	return response.data;
};

export const getProperty = async (id: number): Promise<Property> => {
	const response = await axios.get<Property>(`${API_URL}/properties/${id}`);
	return response.data;
};

export const createProperty = async (
	property: Omit<Property, "id">,
): Promise<Property> => {
	const response = await axios.post<Property>(
		`${API_URL}/properties`,
		property,
	);
	return response.data;
};

export const updateProperty = async (property: Property): Promise<Property> => {
	const response = await axios.put<Property>(
		`${API_URL}/properties/${property.id}`,
		property,
	);
	return response.data;
};

export const deleteProperty = async (id: number): Promise<void> => {
	await axios.delete(`${API_URL}/properties/${id}`);
};

// Sections API
export const getSections = async (
	propertyId?: number,
): Promise<SectionsResponse> => {
	const url = propertyId
		? `${API_URL}/sections?propertyId=${propertyId}`
		: `${API_URL}/sections`;
	const response = await axios.get<SectionsResponse>(url);
	return response.data;
};

export const getSection = async (id: number): Promise<Section> => {
	const response = await axios.get<Section>(`${API_URL}/sections/${id}`);
	return response.data;
};

export const createSection = async (
	section: Omit<Section, "id">,
): Promise<Section> => {
	const response = await axios.post<Section>(`${API_URL}/sections`, section);
	return response.data;
};

export const updateSection = async (section: Section): Promise<Section> => {
	const response = await axios.put<Section>(
		`${API_URL}/sections/${section.id}`,
		section,
	);
	return response.data;
};

export const deleteSection = async (id: number): Promise<void> => {
	await axios.delete(`${API_URL}/sections/${id}`);
};

// Lots API
export const getLots = async (sectionId?: number): Promise<LotsResponse> => {
	const url = sectionId
		? `${API_URL}/lots?sectionId=${sectionId}`
		: `${API_URL}/lots`;
	const response = await axios.get<LotsResponse>(url);
	return response.data;
};

export const getLot = async (id: number): Promise<Lot> => {
	const response = await axios.get<Lot>(`${API_URL}/lots/${id}`);
	return response.data;
};

export const createLot = async (lot: Omit<Lot, "id">): Promise<Lot> => {
	const response = await axios.post<Lot>(`${API_URL}/lots`, lot);
	return response.data;
};

export const updateLot = async (lot: Lot): Promise<Lot> => {
	const response = await axios.put<Lot>(`${API_URL}/lots/${lot.id}`, lot);
	return response.data;
};

export const deleteLot = async (id: number): Promise<void> => {
	await axios.delete(`${API_URL}/lots/${id}`);
};

// Blocks API
export const getBlocks = async (lotId?: number): Promise<BlocksResponse> => {
	const url = lotId ? `${API_URL}/blocks?lotId=${lotId}` : `${API_URL}/blocks`;
	const response = await axios.get<BlocksResponse>(url);
	return response.data;
};

export const getBlock = async (id: number): Promise<Block> => {
	const response = await axios.get<Block>(`${API_URL}/blocks/${id}`);
	return response.data;
};

export const createBlock = async (block: Omit<Block, "id">): Promise<Block> => {
	const response = await axios.post<Block>(`${API_URL}/blocks`, block);
	return response.data;
};

export const updateBlock = async (block: Block): Promise<Block> => {
	const response = await axios.put<Block>(
		`${API_URL}/blocks/${block.id}`,
		block,
	);
	return response.data;
};

export const deleteBlock = async (id: number): Promise<void> => {
	await axios.delete(`${API_URL}/blocks/${id}`);
};

// Graves API
export const getGraves = async (blockId?: number): Promise<GravesResponse> => {
	const url = blockId
		? `${API_URL}/graves?blockId=${blockId}`
		: `${API_URL}/graves`;
	const response = await axios.get<GravesResponse>(url);
	return response.data;
};

export const getGrave = async (id: number): Promise<Grave> => {
	const response = await axios.get<Grave>(`${API_URL}/graves/${id}`);
	return response.data;
};

export const createGrave = async (grave: Omit<Grave, "id">): Promise<Grave> => {
	const response = await axios.post<Grave>(`${API_URL}/graves`, grave);
	return response.data;
};

export const updateGrave = async (grave: Grave): Promise<Grave> => {
	const response = await axios.put<Grave>(
		`${API_URL}/graves/${grave.id}`,
		grave,
	);
	return response.data;
};

export const deleteGrave = async (id: number): Promise<void> => {
	await axios.delete(`${API_URL}/graves/${id}`);
};
