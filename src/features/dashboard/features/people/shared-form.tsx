import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

// Define Zod schema for form validation
export const peopleFormSchema = z.object({
	id: z.string().optional(),
	fullName: z.string().min(1, "Full name is required"),
	email: z.string().email("Invalid email format").optional().or(z.literal("")),
	phone: z.string().min(1, "Phone is required"),
	address: z.object({
		line1: z.string().optional().or(z.literal("")),
		line2: z.string().optional().or(z.literal("")),
		city: z.string().optional().or(z.literal("")),
		state: z.string().optional().or(z.literal("")),
		zip: z.string().optional().or(z.literal("")),
	}),
	emergencyContact: z.object({
		fullName: z.string().min(1, "Emergency contact full name is required"),
		phone: z.string().min(1, "Emergency contact phone is required"),
	}),
});

// Infer TypeScript type from the Zod schema
export type PeopleFormType = z.infer<typeof peopleFormSchema>;

// Define the default values for the form
export const defaultPeopleFormValues: PeopleFormType = {
	id: undefined,
	fullName: "",
	email: "",
	phone: "",
	address: {
		line1: "",
		line2: "",
		city: "",
		state: "",
		zip: "",
	},
	emergencyContact: {
		fullName: "",
		phone: "",
	},
};

// Define the form options with Zod validation
export const peopleFormOpts = formOptions({
	defaultValues: defaultPeopleFormValues,
});
