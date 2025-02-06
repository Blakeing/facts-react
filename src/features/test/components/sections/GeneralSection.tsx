import { useSelector } from "@xstate/react";
import type { ActorRefFrom } from "xstate";
import type createContractMachine from "../../machines/contractMachine";
import type { GeneralData } from "../../machines/generalMachine";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { memo, useCallback, useMemo } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const generalFormSchema = z.object({
	clientName: z.string().min(2, "Client name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email address"),
});

type GeneralFormValues = z.infer<typeof generalFormSchema>;

type ContractActor = ActorRefFrom<ReturnType<typeof createContractMachine>>;

interface GeneralSectionProps {
	actor: ContractActor;
}

const generalDataSelector = (state: {
	context: { formData: { general: GeneralData | null } };
}) => state.context.formData.general || { clientName: "", email: "" };

const GeneralSection = memo(({ actor }: GeneralSectionProps) => {
	const send = actor.send;
	const selector = useMemo(() => generalDataSelector, []);
	const formData = useSelector(actor, selector);

	const form = useForm<GeneralFormValues>({
		resolver: zodResolver(generalFormSchema),
		values: formData,
		mode: "onTouched",
	});

	const handleFieldChange = useCallback(
		(field: keyof GeneralFormValues, value: string) => {
			form.setValue(field, value);
			const values = form.getValues();
			send({
				type: "UPDATE_GENERAL",
				data: values,
			});
		},
		[form, send],
	);

	return (
		<Card>
			<CardContent className="pt-6">
				<Form {...form}>
					<form className="grid w-full items-center gap-4">
						<FormField
							control={form.control}
							name="clientName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Client Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											onChange={(e) =>
												handleFieldChange("clientName", e.target.value)
											}
										/>
									</FormControl>
									<FormMessage />
									<pre className="mt-2 text-xs text-muted-foreground">
										XState value: {formData.clientName}
									</pre>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => {
								const placeholder = "Select a verified email";
								return (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<Select
											onValueChange={(value) =>
												handleFieldChange("email", value)
											}
											defaultValue={field.value || placeholder}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue>
														{field.value || placeholder}
													</SelectValue>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="m@example.com">
													m@example.com
												</SelectItem>
												<SelectItem value="m@google.com">
													m@google.com
												</SelectItem>
												<SelectItem value="m@support.com">
													m@support.com
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
										<pre className="mt-2 text-xs text-muted-foreground">
											XState value: {formData.email}
										</pre>
									</FormItem>
								);
							}}
						/>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
});

GeneralSection.displayName = "GeneralSection";

export default GeneralSection;
