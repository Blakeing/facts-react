import { useBlocker } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export const useConfirm = (
	title: string,
	message: string,
	shouldBlock?: () => boolean,
): (() => React.ReactNode) => {
	const { proceed, reset, status } = useBlocker({
		shouldBlockFn: shouldBlock || (() => false),
		withResolver: true,
	});

	const handleConfirm = () => {
		proceed?.();
	};

	const handleCancel = () => {
		reset?.();
	};

	const ConfirmationDialog = () => (
		<Dialog open={status === "blocked"}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{message}</DialogDescription>
				</DialogHeader>
				<DialogFooter className="pt-2">
					<Button onClick={handleCancel} variant="outline">
						Cancel
					</Button>
					<Button onClick={handleConfirm}>Confirm</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);

	return ConfirmationDialog;
};
