import type { AnyFieldApi } from "@tanstack/react-form";

export function FieldInfo({ field }: { field: AnyFieldApi }) {
	return (
		<>
			{field.state.meta.errors.length > 0 ? (
				<em className="text-destructive text-sm">
					{field.state.meta.errors.join(", ")}
				</em>
			) : null}
			{field.state.meta.isValidating ? (
				<span className="text-muted-foreground text-sm">Validating...</span>
			) : null}
		</>
	);
}
