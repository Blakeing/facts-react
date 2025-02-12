import * as z from "zod";

export const nameSchema = z.object({
	first: z.string().min(1, "First name is required"),
	last: z.string().min(1, "Last name is required"),
	prefix: z.string().optional(),
	middle: z.string().optional(),
	suffix: z.string().optional(),
	companyName: z.string().optional(),
	nickname: z.string().optional(),
	maiden: z.string().optional(),
	gender: z.string().optional(),
});

export const addressSchema = z.object({
	street: z.string().min(1, "Street address is required"),
	city: z.string().min(1, "City is required"),
	state: z.string().min(1, "State is required"),
	postalCode: z.string().min(1, "Postal code is required"),
	country: z.string().min(1, "Country is required"),
});

export const identificationSchema = z.object({
	stateIdNumber: z.string().min(1, "State ID number is required"),
	issuer: z.string().min(1, "Issuer is required"),
});

export const datesSchema = z.object({
	dateOfBirth: z.string().optional(),
	dateOfDeath: z.string().optional(),
	isDeceased: z.boolean(),
});

export const phoneSchema = z.object({
	number: z.string().min(1, "Phone number is required"),
	type: z.string().min(1, "Phone type is required"),
	isPreferred: z.boolean(),
});

export const emailSchema = z.object({
	address: z.string().email("Invalid email address"),
	isPreferred: z.boolean(),
});

export const beneficiaryFormSchema = z.object({
	name: nameSchema,
	physicalAddress: addressSchema,
	mailingAddressSameAsPhysical: z.boolean(),
	mailingAddress: addressSchema.optional(),
	identification: identificationSchema,
	dates: datesSchema,
	role: z.string().optional(),
	ethnicity: z.string().optional(),
	race: z.string().optional(),
	isVeteran: z.boolean(),
	phones: z.array(phoneSchema).min(1, "At least one phone number is required"),
	emails: z.array(emailSchema).min(1, "At least one email is required"),
	optOutOfFutureMarketing: z.boolean(),
});

export type BeneficiaryFormValues = z.infer<typeof beneficiaryFormSchema>;
