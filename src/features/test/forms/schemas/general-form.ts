import { z } from "zod";

export const generalFormSchema = z.object({
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
		required_error: "At-need type is required",
	}),
	contractType: z.string({
		required_error: "Contract type is required",
	}),
	campaign: z.string({
		required_error: "Campaign is required",
	}),
});

export type GeneralFormValues = z.infer<typeof generalFormSchema>;

export const defaultGeneralFormValues: GeneralFormValues = {
	serviceDate: new Date(),
	contractSignDate: new Date(),
	prePrintedContractNumber: "",
	funeralDirector: "",
	atNeedType: "",
	contractType: "",
	campaign: "",
};
