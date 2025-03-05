import { createFormHook } from "@tanstack/react-form";
import { lazy } from "react";
import {
	fieldContext,
	formContext,
	useFormContext,
} from "./useFormContext.tsx";
import { z } from "zod";

const TextField = lazy(() => import("../components/TextFields.tsx"));

function SubscribeButton({ label }: { label: string }) {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<button type="button" disabled={isSubmitting}>
					{label}
				</button>
			)}
		</form.Subscribe>
	);
}

// Helper for Zod validation
export function zodValidator<TSchema extends z.ZodType>(schema: TSchema) {
	return ({ value }: { value: unknown }) => {
		try {
			schema.parse(value);
			return null;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldErrors: Record<string, string> = {};

				for (const err of error.errors) {
					const path = err.path.join(".");
					fieldErrors[path] = err.message;
				}

				return {
					form: "Please fix the validation errors",
					fields: fieldErrors,
				};
			}
			return { form: "An unexpected error occurred" };
		}
	};
}

export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		TextField,
	},
	formComponents: {
		SubscribeButton,
	},
	fieldContext,
	formContext,
});
