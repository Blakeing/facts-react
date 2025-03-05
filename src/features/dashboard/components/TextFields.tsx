import { useFieldContext } from "../hooks/useFormContext.tsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

// Create a FormItem-like component for TanStack Form
function FormItem({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="form-item"
			className={cn("grid gap-2", className)}
			{...props}
		/>
	);
}

// Create a FormLabel-like component for TanStack Form
function FormLabel({
	className,
	hasError,
	...props
}: React.ComponentProps<"label"> & { hasError?: boolean }) {
	return (
		<Label
			data-slot="form-label"
			data-error={hasError}
			className={cn("data-[error=true]:text-destructive", className)}
			{...props}
		/>
	);
}

// Create a FormControl-like component for TanStack Form
function FormControl({
	hasError,
	...props
}: React.ComponentProps<typeof Slot> & { hasError?: boolean }) {
	return <Slot data-slot="form-control" aria-invalid={hasError} {...props} />;
}

// Create a FormMessage-like component for TanStack Form
function FormMessage({
	className,
	errors,
	...props
}: React.ComponentProps<"div"> & { errors?: string[] }) {
	if (!errors || errors.length === 0) {
		return null;
	}

	return (
		<div
			data-slot="form-message"
			className={cn("text-destructive text-sm font-medium", className)}
			{...props}
		>
			{errors.map((error: string) => (
				<p key={error}>{error}</p>
			))}
		</div>
	);
}

export default function TextField({
	label,
	className,
	...props
}: {
	label: string;
	className?: string;
}) {
	const field = useFieldContext<string>();
	const errors = field.state.meta.errors;
	const hasErrors = errors.length > 0;
	const id = React.useId();

	return (
		<FormItem className="space-y-1">
			<FormLabel htmlFor={id} hasError={hasErrors}>
				{label}
			</FormLabel>
			<FormControl hasError={hasErrors}>
				<Input
					id={id}
					value={field.state.value}
					onChange={(e) => field.handleChange(e.target.value)}
					onBlur={field.handleBlur}
					className={cn(
						hasErrors && "border-destructive focus-visible:ring-destructive/20",
						className,
					)}
					{...props}
				/>
			</FormControl>
			<FormMessage errors={errors} />
		</FormItem>
	);
}
