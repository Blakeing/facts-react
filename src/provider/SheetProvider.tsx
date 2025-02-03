import { useMountedState } from "react-use";
import { TestSheet } from "@/components/sheets/TestSheet";

export const SheetProvider = () => {
	const isMounted = useMountedState();

	if (!isMounted) return null;

	return (
		<>
			<TestSheet />
		</>
	);
};
