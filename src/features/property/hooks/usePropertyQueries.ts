import {
	useQuery,
	useMutation,
	useQueryClient,
	type UseQueryResult,
	type UseMutationResult,
} from "@tanstack/react-query";
import {
	getProperties,
	getProperty,
	createProperty,
	updateProperty,
	deleteProperty,
	getSections,
	getSection,
	createSection,
	updateSection,
	deleteSection,
	getLots,
	getLot,
	createLot,
	updateLot,
	deleteLot,
	getBlocks,
	getBlock,
	createBlock,
	updateBlock,
	deleteBlock,
	getGraves,
	getGrave,
	createGrave,
	updateGrave,
	deleteGrave,
} from "../api/propertyApi";
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

// Query keys
export const queryKeys = {
	properties: ["properties"],
	property: (id: number) => ["properties", id],
	sections: (propertyId?: number) =>
		propertyId ? ["sections", { propertyId }] : ["sections"],
	section: (id: number) => ["sections", id],
	lots: (sectionId?: number) =>
		sectionId ? ["lots", { sectionId }] : ["lots"],
	lot: (id: number) => ["lots", id],
	blocks: (lotId?: number) => (lotId ? ["blocks", { lotId }] : ["blocks"]),
	block: (id: number) => ["blocks", id],
	graves: (blockId?: number) =>
		blockId ? ["graves", { blockId }] : ["graves"],
	grave: (id: number) => ["graves", id],
};

// Property hooks
export const useProperties = (): UseQueryResult<PropertiesResponse, Error> => {
	return useQuery({
		queryKey: queryKeys.properties,
		queryFn: () => getProperties(),
	});
};

export const useProperty = (id: number): UseQueryResult<Property, Error> => {
	return useQuery({
		queryKey: queryKeys.property(id),
		queryFn: () => getProperty(id),
		enabled: !!id,
	});
};

export const useCreateProperty = (): UseMutationResult<
	Property,
	Error,
	Omit<Property, "id">
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (property: Omit<Property, "id">) => createProperty(property),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.properties });
		},
	});
};

export const useUpdateProperty = (): UseMutationResult<
	Property,
	Error,
	Property
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (property: Property) => updateProperty(property),
		onSuccess: (updatedProperty) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.properties });
			queryClient.invalidateQueries({
				queryKey: queryKeys.property(updatedProperty.id),
			});
		},
	});
};

export const useDeleteProperty = (): UseMutationResult<void, Error, number> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteProperty(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.properties });
			queryClient.invalidateQueries({ queryKey: queryKeys.property(id) });
		},
	});
};

// Section hooks
export const useSections = (
	propertyId?: number,
): UseQueryResult<SectionsResponse, Error> => {
	return useQuery({
		queryKey: queryKeys.sections(propertyId),
		queryFn: () => getSections(propertyId),
	});
};

export const useSection = (id: number): UseQueryResult<Section, Error> => {
	return useQuery({
		queryKey: queryKeys.section(id),
		queryFn: () => getSection(id),
		enabled: !!id,
	});
};

export const useCreateSection = (): UseMutationResult<
	Section,
	Error,
	Omit<Section, "id">
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (section: Omit<Section, "id">) => createSection(section),
		onSuccess: (newSection) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.sections() });
			queryClient.invalidateQueries({
				queryKey: queryKeys.sections(newSection.propertyId),
			});
		},
	});
};

export const useUpdateSection = (): UseMutationResult<
	Section,
	Error,
	Section
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (section: Section) => updateSection(section),
		onSuccess: (updatedSection) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.sections() });
			queryClient.invalidateQueries({
				queryKey: queryKeys.sections(updatedSection.propertyId),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.section(updatedSection.id),
			});
		},
	});
};

export const useDeleteSection = (): UseMutationResult<void, Error, number> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteSection(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.sections() });
			queryClient.invalidateQueries({ queryKey: queryKeys.section(id) });
		},
	});
};

// Lot hooks
export const useLots = (
	sectionId?: number,
): UseQueryResult<LotsResponse, Error> => {
	return useQuery({
		queryKey: queryKeys.lots(sectionId),
		queryFn: () => getLots(sectionId),
	});
};

export const useLot = (id: number): UseQueryResult<Lot, Error> => {
	return useQuery({
		queryKey: queryKeys.lot(id),
		queryFn: () => getLot(id),
		enabled: !!id,
	});
};

export const useCreateLot = (): UseMutationResult<
	Lot,
	Error,
	Omit<Lot, "id">
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (lot: Omit<Lot, "id">) => createLot(lot),
		onSuccess: (newLot) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lots() });
			queryClient.invalidateQueries({
				queryKey: queryKeys.lots(newLot.sectionId),
			});
		},
	});
};

export const useUpdateLot = (): UseMutationResult<Lot, Error, Lot> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (lot: Lot) => updateLot(lot),
		onSuccess: (updatedLot) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lots() });
			queryClient.invalidateQueries({
				queryKey: queryKeys.lots(updatedLot.sectionId),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.lot(updatedLot.id),
			});
		},
	});
};

export const useDeleteLot = (): UseMutationResult<void, Error, number> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteLot(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lots() });
			queryClient.invalidateQueries({ queryKey: queryKeys.lot(id) });
		},
	});
};

// Block queries
export const useBlocks = (
	lotId?: number,
): UseQueryResult<BlocksResponse, Error> => {
	return useQuery({
		queryKey: queryKeys.blocks(lotId),
		queryFn: () => getBlocks(lotId),
	});
};

export const useBlock = (id?: number): UseQueryResult<Block, Error> => {
	return useQuery({
		queryKey: queryKeys.block(id as number),
		queryFn: () => getBlock(id as number),
		enabled: !!id,
	});
};

export const useCreateBlock = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createBlock,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blocks"] });
		},
	});
};

export const useUpdateBlock = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateBlock,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["blocks"] });
			queryClient.invalidateQueries({ queryKey: ["block", data.id] });
		},
	});
};

export const useDeleteBlock = (): UseMutationResult<void, Error, number> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteBlock(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.blocks() });
			queryClient.invalidateQueries({ queryKey: queryKeys.block(id) });
		},
	});
};

// Grave hooks
export const useGraves = (
	blockId?: number,
): UseQueryResult<GravesResponse, Error> => {
	return useQuery({
		queryKey: queryKeys.graves(blockId),
		queryFn: () => getGraves(blockId),
	});
};

export const useGrave = (id: number): UseQueryResult<Grave, Error> => {
	return useQuery({
		queryKey: queryKeys.grave(id),
		queryFn: () => getGrave(id),
		enabled: !!id,
	});
};

export const useCreateGrave = (): UseMutationResult<
	Grave,
	Error,
	Omit<Grave, "id">
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (grave: Omit<Grave, "id">) => createGrave(grave),
		onSuccess: (newGrave) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.graves() });
			queryClient.invalidateQueries({
				queryKey: queryKeys.graves(newGrave.blockId),
			});
		},
	});
};

export const useUpdateGrave = (): UseMutationResult<Grave, Error, Grave> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (grave: Grave) => updateGrave(grave),
		onSuccess: (updatedGrave) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.graves() });
			queryClient.invalidateQueries({
				queryKey: queryKeys.graves(updatedGrave.blockId),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.grave(updatedGrave.id),
			});
		},
	});
};

export const useDeleteGrave = (): UseMutationResult<void, Error, number> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteGrave(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.graves() });
			queryClient.invalidateQueries({ queryKey: queryKeys.grave(id) });
		},
	});
};
