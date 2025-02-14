import { BaseSheet } from "@/components/sheets/BaseSheet";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createSheet } from "@/hooks/use-create-sheet";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { ContractContext } from "../types/contract";

interface FormDebugData {
	type: "form";
	values: Record<string, unknown>;
	isDirty: boolean;
	formState: {
		isDirty: boolean;
	};
}

interface RootFormDebugData {
	type: "root";
	values: Record<string, unknown>;
	formDirtyStates: Record<string, boolean>;
	hasUnsavedChanges: boolean;
	isNavigating: boolean;
}

interface DebugData {
	xstateContext: ContractContext;
	rhfForms: Record<string, FormDebugData | RootFormDebugData>;
}

const useDebugSheet = createSheet<DebugData>();
export { useDebugSheet };

function DebugSheet() {
	const { isOpen, onClose, data } = useDebugSheet();

	if (!data) return null;

	// Create array of all possible accordion values
	const accordionValues = ["xstate", ...Object.keys(data.rhfForms)];

	return (
		<BaseSheet
			isOpen={isOpen}
			onClose={onClose}
			title="Debug Information"
			description="Debug information showing XState context and form states"
			className="sm:max-w-3xl"
		>
			<ScrollArea className="h-screen">
				<div className="space-y-6 px-4">
					<Accordion
						type="multiple"
						className="w-full"
						defaultValue={accordionValues}
					>
						<AccordionItem value="xstate">
							<AccordionTrigger className="text-base font-medium">
								XState Context
							</AccordionTrigger>
							<AccordionContent>
								<pre className="bg-muted p-4 rounded-md overflow-x-auto">
									{JSON.stringify(data.xstateContext, null, 2)}
								</pre>
							</AccordionContent>
						</AccordionItem>
						{Object.entries(data.rhfForms).map(([formName, form]) => (
							<AccordionItem key={formName} value={formName}>
								<AccordionTrigger className="text-base font-medium">
									{formName.charAt(0).toUpperCase() + formName.slice(1)} Form
								</AccordionTrigger>
								<AccordionContent>
									<pre className="bg-muted p-4 rounded-md overflow-x-auto">
										{JSON.stringify(
											form.type === "form"
												? {
														values: form.values,
														isDirty: form.isDirty,
														formState: form.formState,
													}
												: {
														values: form.values,
														formDirtyStates: form.formDirtyStates,
														hasUnsavedChanges: form.hasUnsavedChanges,
														isNavigating: form.isNavigating,
													},
											null,
											2,
										)}
									</pre>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</ScrollArea>
		</BaseSheet>
	);
}

export default DebugSheet;
