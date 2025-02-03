import { TestSheet } from "@/components/sheets/TestSheet";
import { useMountedState } from "react-use";

export const SheetProvider = () => {
	const isMounted = useMountedState();

	if (!isMounted) return null;

	return (
		<>
			<TestSheet />
		</>
	);
};
