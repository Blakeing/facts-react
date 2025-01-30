"use client";

// Inspired by react-hot-toast library
import * as React from "react";

import type { ToastActionElement } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000;

type ToastState = {
	id: string;
	title?: React.ReactNode;
	description?: React.ReactNode;
	action?: ToastActionElement;
	open: boolean;
};

type State = {
	toasts: ToastState[];
};

const actionTypes = {
	ADD_TOAST: "ADD_TOAST",
	UPDATE_TOAST: "UPDATE_TOAST",
	DISMISS_TOAST: "DISMISS_TOAST",
	REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type Action =
	| {
			type: typeof actionTypes.ADD_TOAST;
			toast: ToastState;
	  }
	| {
			type: typeof actionTypes.UPDATE_TOAST;
			toast: Partial<ToastState>;
	  }
	| {
			type: typeof actionTypes.DISMISS_TOAST;
			toastId: string | undefined;
	  }
	| {
			type: typeof actionTypes.REMOVE_TOAST;
			toastId: string | undefined;
	  };

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
	if (toastTimeouts.has(toastId)) {
		return;
	}

	const timeout = setTimeout(() => {
		toastTimeouts.delete(toastId);
		dispatch({
			type: actionTypes.REMOVE_TOAST,
			toastId,
		});
	}, TOAST_REMOVE_DELAY);

	toastTimeouts.set(toastId, timeout);
};

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case actionTypes.ADD_TOAST:
			return {
				...state,
				toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
			};

		case actionTypes.UPDATE_TOAST:
			return {
				...state,
				toasts: state.toasts.map((t) =>
					t.id === action.toast.id ? { ...t, ...action.toast } : t,
				),
			};

		case actionTypes.DISMISS_TOAST: {
			const { toastId } = action;

			if (toastId) {
				addToRemoveQueue(toastId);
			} else {
				for (const toast of state.toasts) {
					addToRemoveQueue(toast.id);
				}
			}

			return {
				...state,
				toasts: state.toasts.map((t) =>
					t.id === toastId || toastId === undefined
						? {
								...t,
								open: false,
							}
						: t,
				),
			};
		}

		case actionTypes.REMOVE_TOAST:
			if (action.toastId === undefined) {
				return {
					...state,
					toasts: [],
				};
			}
			return {
				...state,
				toasts: state.toasts.filter((t) => t.id !== action.toastId),
			};
	}
};

const listeners: Array<React.Dispatch<React.SetStateAction<State>>> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
	memoryState = reducer(memoryState, action);
	for (const listener of listeners) {
		listener(memoryState);
	}
}

type Toast = Omit<ToastState, "id" | "open">;

function toast({ ...props }: Toast) {
	const id = Math.random().toString(36).slice(2, 9);

	const update = (props: Partial<ToastState>) =>
		dispatch({
			type: actionTypes.UPDATE_TOAST,
			toast: { ...props, id },
		});

	const dismiss = () =>
		dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

	dispatch({
		type: actionTypes.ADD_TOAST,
		toast: {
			...props,
			id,
			open: true,
		},
	});

	return {
		id,
		dismiss,
		update,
	};
}

function useToast() {
	const [state, setState] = React.useState<State>(memoryState);

	React.useEffect(() => {
		listeners.push(setState);
		return () => {
			const index = listeners.indexOf(setState);
			if (index > -1) {
				listeners.splice(index, 1);
			}
		};
	}, []);

	return {
		...state,
		toast,
		dismiss: (toastId?: string) =>
			dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
	};
}

export { toast, useToast };
