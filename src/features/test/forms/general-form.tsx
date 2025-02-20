import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { forwardRef, useCallback, useImperativeHandle, useEffect } from "react";
import { type UseFormReturn, useForm, useFormState } from "react-hook-form";
import type { ActorRefFrom } from "xstate";
import type createContractMachine from "../machines/contractMachine";
import type { GeneralData } from "../types/general";
import {
	defaultGeneralFormValues,
	generalFormSchema,
	type GeneralFormValues,
} from "./schemas/general-form";
import isEqual from "lodash/isEqual";

export interface GeneralFormRef {
	form: UseFormReturn<GeneralFormValues>;
	isDirty: boolean;
	save: () => void;
}

interface GeneralFormProps {
	actor: ActorRefFrom<ReturnType<typeof createContractMachine>>;
	defaultValues?: GeneralFormValues;
	onDirtyChange?: (isDirty: boolean) => void;
}

export const GeneralForm = forwardRef<GeneralFormRef, GeneralFormProps>(
	({ actor, defaultValues = defaultGeneralFormValues, onDirtyChange }, ref) => {
		const form = useForm<GeneralFormValues>({
			resolver: zodResolver(generalFormSchema),
			defaultValues,
		});

		const formState = useFormState({
			control: form.control,
		});

		// Reset form when defaultValues change and ensure XState is updated
		useEffect(() => {
			if (!isEqual(form.getValues(), defaultValues)) {
				form.reset(defaultValues);
				actor.send({
					type: "UPDATE_GENERAL",
					data: defaultValues as GeneralData,
					isValid: true,
				});
			}
		}, [form, defaultValues, actor]);

		const saveToXState = useCallback(() => {
			const data = form.getValues();
			actor.send({
				type: "UPDATE_GENERAL",
				data: data as GeneralData,
				isValid: true,
			});
		}, [form, actor]);

		useImperativeHandle(
			ref,
			() => ({
				form,
				isDirty: formState.isDirty,
				save: saveToXState,
			}),
			[form, formState.isDirty, saveToXState],
		);

		useEffect(() => {
			onDirtyChange?.(formState.isDirty);
		}, [formState.isDirty, onDirtyChange]);

		const handleFieldChange = useCallback(
			(field: keyof GeneralFormValues, value: string | Date) => {
				form.setValue(field, value, {
					shouldDirty: true,
					shouldTouch: true,
					shouldValidate: true,
				});

				const data = form.getValues();
				actor.send({
					type: "UPDATE_GENERAL",
					data: data as GeneralData,
					isValid: true,
				});
			},
			[form, actor],
		);

		return (
			<Form {...form}>
				<form
					className="grid w-full items-center gap-4"
					onSubmit={(e) => e.preventDefault()}
				>
					<FormField
						control={form.control}
						name="serviceDate"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Service Date</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												type="button"
												variant={"outline"}
												className={cn(
													"w-full pl-3 text-left font-normal",
													!field.value && "text-muted-foreground",
												)}
											>
												{field.value ? (
													format(field.value, "PPP")
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={(date) =>
												date && handleFieldChange("serviceDate", date)
											}
											disabled={(date) => date < new Date("1900-01-01")}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="contractSignDate"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Contract/Sign Date</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												type="button"
												variant={"outline"}
												className={cn(
													"w-full pl-3 text-left font-normal",
													!field.value && "text-muted-foreground",
												)}
											>
												{field.value ? (
													format(field.value, "PPP")
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={(date) =>
												date && handleFieldChange("contractSignDate", date)
											}
											disabled={(date) => date < new Date("1900-01-01")}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="prePrintedContractNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Pre-Printed Contract #</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value || ""}
										onChange={(e) =>
											handleFieldChange(
												"prePrintedContractNumber",
												e.target.value,
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="funeralDirector"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Funeral Director</FormLabel>
								<Select
									onValueChange={(value) => {
										if (!value && defaultValues.funeralDirector) {
											return;
										}
										handleFieldChange("funeralDirector", value);
									}}
									value={field.value}
									defaultValue={defaultValues.funeralDirector}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select funeral director" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="director1">Director 1</SelectItem>
										<SelectItem value="director2">Director 2</SelectItem>
										<SelectItem value="director3">Director 3</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="atNeedType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>At-Need Type</FormLabel>
								<Select
									onValueChange={(value) => {
										if (!value && defaultValues.atNeedType) {
											return;
										}
										handleFieldChange("atNeedType", value);
									}}
									value={field.value}
									defaultValue={defaultValues.atNeedType}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select at-need type" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="type1">Type 1</SelectItem>
										<SelectItem value="type2">Type 2</SelectItem>
										<SelectItem value="type3">Type 3</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="contractType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contract Type</FormLabel>
								<Select
									onValueChange={(value) => {
										if (!value && defaultValues.contractType) {
											return;
										}
										handleFieldChange("contractType", value);
									}}
									value={field.value}
									defaultValue={defaultValues.contractType}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select contract type" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="type1">Type 1</SelectItem>
										<SelectItem value="type2">Type 2</SelectItem>
										<SelectItem value="type3">Type 3</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="campaign"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Campaign</FormLabel>
								<Select
									onValueChange={(value) => {
										if (!value && defaultValues.campaign) {
											return;
										}
										handleFieldChange("campaign", value);
									}}
									value={field.value}
									defaultValue={defaultValues.campaign}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select campaign" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="campaign1">Campaign 1</SelectItem>
										<SelectItem value="campaign2">Campaign 2</SelectItem>
										<SelectItem value="campaign3">Campaign 3</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>
		);
	},
);

GeneralForm.displayName = "GeneralForm";
