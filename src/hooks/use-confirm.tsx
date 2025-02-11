import { useState } from "react";
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
): [() => React.ReactNode, () => Promise<unknown>] => {
	const [promise, setPromise] = useState<{
		resolve: (value: boolean) => void;
	} | null>(null);

	const { proceed, reset, status } = useBlocker({
		shouldBlockFn: shouldBlock || (() => false),
		withResolver: true,
	});

	const confirm = () =>
		new Promise((resolve) => {
			setPromise({ resolve });
		});

	const handleClose = () => {
		setPromise(null);
		reset?.();
	};

	const handleConfirm = () => {
		promise?.resolve(true);
		proceed?.();
		handleClose();
	};

	const handleCancel = () => {
		promise?.resolve(false);
		reset?.();
		handleClose();
	};

	const ConfirmationDialog = () => (
		<Dialog open={promise !== null || status === "blocked"}>
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

	return [ConfirmationDialog, confirm];
};
