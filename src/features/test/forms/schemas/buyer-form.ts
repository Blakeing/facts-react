import * as z from "zod";

export const nameSchema = z.object({
	first: z.string().min(1, "First name is required"),
	last: z.string().min(1, "Last name is required"),
	prefix: z.string().nullish(),
	middle: z.string().nullish(),
	suffix: z.string().nullish(),
	companyName: z.string().nullish(),
	nickname: z.string().nullish(),
	maiden: z.string().nullish(),
	gender: z.string().nullish(),
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
	dateOfBirth: z.string().nullish(),
	dateOfDeath: z.string().nullish(),
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

export const buyerFormSchema = z.object({
	name: nameSchema,
	physicalAddress: addressSchema,
	mailingAddressSameAsPhysical: z.boolean(),
	mailingAddress: addressSchema.nullish(),
	identification: identificationSchema,
	dates: datesSchema,
	role: z.string().nullish(),
	ethnicity: z.string().nullish(),
	race: z.string().nullish(),
	isVeteran: z.boolean(),
	phones: z.array(phoneSchema).min(1, "At least one phone number is required"),
	emails: z.array(emailSchema).min(1, "At least one email is required"),
	optOutOfFutureMarketing: z.boolean(),
});

export type BuyerFormValues = z.infer<typeof buyerFormSchema>;
