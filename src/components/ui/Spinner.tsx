import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const spinnerVariants = cva(
	"animate-spin rounded-full border-primary border-t-transparent",
	{
		variants: {
			size: {
				sm: "h-4 w-4 border-2",
				md: "h-8 w-8 border-4",
				lg: "h-12 w-12 border-4",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
	className?: string;
}

export function Spinner({ size, className }: SpinnerProps) {
	return (
		<div
			className={cn(spinnerVariants({ size }), className)}
			role="status"
			aria-label="Loading"
		/>
	);
}
