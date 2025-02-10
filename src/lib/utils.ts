import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | undefined): string {
	if (!date) return "N/A";
	return new Date(date).toLocaleDateString();
}
