import { create } from "zustand";

export interface BaseSheetState {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

export const createSheet = <T = void>() => {
	type SheetState = BaseSheetState & {
		data: T | undefined;
		setData: (data: T) => void;
	};

	return create<SheetState>((set) => ({
		isOpen: false,
		onOpen: () => set((state) => ({ ...state, isOpen: true })),
		onClose: () => set((state) => ({ ...state, isOpen: false })),
		data: undefined,
		setData: (data: T) => set((state) => ({ ...state, data })),
	}));
};
