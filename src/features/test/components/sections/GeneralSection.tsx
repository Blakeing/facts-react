import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
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
import { useSelector } from "@xstate/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { ActorRefFrom } from "xstate";
import * as z from "zod";
import type createContractMachine from "../../machines/contractMachine";
import type { GeneralData } from "../../machines/generalMachine";

const generalFormSchema = z.object({
	serviceDate: z.date({
		required_error: "Service date is required",
	}),
	contractSignDate: z.date({
		required_error: "Contract/Sign date is required",
	}),
	prePrintedContractNumber: z.string().optional(),
	funeralDirector: z.string({
		required_error: "Funeral director is required",
	}),
	atNeedType: z.string({
		required_error: "At-Need type is required",
	}),
	contractType: z.string({
		required_error: "Contract type is required",
	}),
	campaign: z.string({
		required_error: "Campaign is required",
	}),
});

type GeneralFormValues = z.infer<typeof generalFormSchema>;

type ContractActor = ActorRefFrom<ReturnType<typeof createContractMachine>>;

interface GeneralSectionProps {
	actor: ContractActor;
}

const generalDataSelector = (state: {
	context: { formData: { general: GeneralData | null } };
}) =>
	state.context.formData.general || {
		serviceDate: new Date(),
		contractSignDate: new Date(),
		funeralDirector: "",
		atNeedType: "",
		contractType: "",
		campaign: "",
	};

const GeneralSection = memo(({ actor }: GeneralSectionProps) => {
	const send = actor.send;
	const selector = useMemo(() => generalDataSelector, []);
	const formData = useSelector(actor, selector);

	const form = useForm<GeneralFormValues>({
		resolver: zodResolver(generalFormSchema),
		values: {
			...formData,
			prePrintedContractNumber: formData.prePrintedContractNumber || "",
		},
		mode: "onTouched",
	});

	const handleFieldChange = useCallback(
		(field: keyof GeneralFormValues, value: string | Date) => {
			form.setValue(field, value);
			const values = form.getValues();
			const formattedValues: GeneralData = {
				serviceDate: values.serviceDate,
				contractSignDate: values.contractSignDate,
				funeralDirector: values.funeralDirector,
				atNeedType: values.atNeedType,
				contractType: values.contractType,
				campaign: values.campaign,
				...(values.prePrintedContractNumber
					? { prePrintedContractNumber: values.prePrintedContractNumber }
					: {}),
			};
			send({
				type: "UPDATE_GENERAL",
				data: formattedValues,
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
							name="serviceDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Service Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
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
										onValueChange={(value) =>
											handleFieldChange("funeralDirector", value)
										}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder={
														field.value || "Select a funeral director"
													}
												/>
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
										onValueChange={(value) =>
											handleFieldChange("atNeedType", value)
										}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder={field.value || "Select at-need type"}
												/>
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
										onValueChange={(value) =>
											handleFieldChange("contractType", value)
										}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder={field.value || "Select contract type"}
												/>
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
										onValueChange={(value) =>
											handleFieldChange("campaign", value)
										}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder={field.value || "Select campaign"}
												/>
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
			</CardContent>
		</Card>
	);
});

GeneralSection.displayName = "GeneralSection";

export default GeneralSection;
