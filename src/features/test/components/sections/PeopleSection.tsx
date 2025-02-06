import { useSelector } from "@xstate/react";
import type { ActorRefFrom } from "xstate";
import type createContractMachine from "../../machines/contractMachine";
import type { PeopleData } from "../../machines/peopleMachine";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { memo, useCallback, useEffect, useMemo } from "react";

const peopleFormSchema = z.object({
	familyMembers: z
		.array(
			z.object({
				id: z.string(),
				name: z.string().min(2, "Name must be at least 2 characters"),
			}),
		)
		.min(1, "At least one family member is required"),
});

type PeopleFormValues = z.infer<typeof peopleFormSchema>;

type ContractActor = ActorRefFrom<ReturnType<typeof createContractMachine>>;

interface PeopleSectionProps {
	actor: ContractActor;
}

const peopleDataSelector = (state: {
	context: { formData: { people: PeopleData | null } };
}) => ({
	familyMembers: state.context.formData.people?.familyMembers ?? [],
});

const PeopleSection = memo(({ actor }: PeopleSectionProps) => {
	if (!actor) return null;

	const send = actor.send;
	const selector = useMemo(() => peopleDataSelector, []);
	const { familyMembers } = useSelector(actor, selector);

	const form = useForm<PeopleFormValues>({
		resolver: zodResolver(peopleFormSchema),
		defaultValues: {
			familyMembers: [],
		},
		mode: "onTouched",
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "familyMembers",
	});

	useEffect(() => {
		form.reset({ familyMembers });
	}, [familyMembers, form]);

	const handleFieldChange = useCallback(
		(index: number, value: string) => {
			form.setValue(`familyMembers.${index}.name`, value);
			const values = form.getValues();
			send({
				type: "UPDATE_PEOPLE",
				data: values,
			});
		},
		[form, send],
	);

	const addFamilyMember = useCallback(() => {
		append({ id: crypto.randomUUID(), name: "" });
	}, [append]);

	const removeFamilyMember = useCallback(
		(index: number) => {
			remove(index);
			const values = form.getValues();
			send({
				type: "UPDATE_PEOPLE",
				data: values,
			});
		},
		[remove, form, send],
	);

	return (
		<Card>
			<CardContent className="pt-6">
				<Form {...form}>
					<form className="grid w-full items-center gap-4">
						{fields.map((field, index) => (
							<FormField
								key={field.id}
								control={form.control}
								name={`familyMembers.${index}.name`}
								render={({ field: nameField }) => (
									<FormItem>
										<div className="flex items-center gap-2">
											<div className="flex-1">
												<FormLabel>Family Member</FormLabel>
												<FormControl>
													<Input
														{...nameField}
														required
														onChange={(e) =>
															handleFieldChange(index, e.target.value)
														}
													/>
												</FormControl>
												<FormMessage />
											</div>
											<Button
												type="button"
												variant="destructive"
												size="icon"
												onClick={() => removeFamilyMember(index)}
												className="self-end"
											>
												<Minus className="h-4 w-4" />
											</Button>
										</div>
									</FormItem>
								)}
							/>
						))}
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={addFamilyMember}
							className="w-8 h-8"
						>
							<Plus className="h-4 w-4" />
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
});

PeopleSection.displayName = "PeopleSection";

export default PeopleSection;
