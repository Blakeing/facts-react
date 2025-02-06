import type { AxiosError } from "axios";

export type ApiErrorCode =
	| "SAVE_FAILED"
	| "UPDATE_FAILED"
	| "INVALID_STATE"
	| "UNKNOWN_ERROR";

export interface ApiErrorData {
	code: ApiErrorCode;
	data?: unknown;
}

export type ContractApiError = AxiosError<ApiErrorData>;

export const isContractApiError = (
	error: unknown,
): error is ContractApiError => {
	return (
		error instanceof Error &&
		"isAxiosError" in error &&
		error.isAxiosError === true
	);
};
