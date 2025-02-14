import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

import type { ReactNode } from "react";

interface BaseSheetProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description?: ReactNode;
	children?: ReactNode;
	className?: string;
}

function BaseSheet({
	isOpen,
	onClose,
	title,
	description,
	children,
	className,
}: BaseSheetProps) {
	return (
		<Sheet open={isOpen} onOpenChange={onClose}>
			<SheetContent className={className}>
				<SheetHeader>
					<SheetTitle>{title}</SheetTitle>
					{description && <SheetDescription>{description}</SheetDescription>}
				</SheetHeader>
				{children}
			</SheetContent>
		</Sheet>
	);
}

export { BaseSheet, type BaseSheetProps };
