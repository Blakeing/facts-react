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
}

function BaseSheet({
	isOpen,
	onClose,
	title,
	description,
	children,
}: BaseSheetProps) {
	return (
		<Sheet open={isOpen} onOpenChange={onClose}>
			<SheetContent>
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
