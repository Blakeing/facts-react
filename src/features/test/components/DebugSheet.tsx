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

interface DebugData {
	xstateContext: ContractContext;
	rhfForms: Record<string, UseFormReturn<FieldValues>>;
}

const useDebugSheet = createSheet<DebugData>();
export { useDebugSheet };

const FORM_KEYS = {
	GENERAL: "general",
	BUYER: "buyer",
	BENEFICIARY: "beneficiary",
	PAYMENT: "payment",
	FINANCING: "financing",
} as const;

function DebugSheet() {
	const { isOpen, onClose, data } = useDebugSheet();

	if (!data) return null;

	const description = (
		<ScrollArea className="h-screen">
			<div className="space-y-6">
				<Accordion type="single" collapsible className="w-full">
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
										{
											values: form.getValues(),
											errors: form.formState.errors,
											isDirty: form.formState.isDirty,
											isValid: form.formState.isValid,
											isSubmitting: form.formState.isSubmitting,
											isSubmitted: form.formState.isSubmitted,
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
	);

	return (
		<BaseSheet
			isOpen={isOpen}
			onClose={onClose}
			title="Debug Information"
			description={description}
			className="sm:max-w-3xl"
		/>
	);
}

export default DebugSheet;
