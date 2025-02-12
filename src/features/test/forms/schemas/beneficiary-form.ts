import * as z from "zod";

export const nameSchema = z
	.object({
		first: z.string().min(1, "First name is required"),
		last: z.string().min(1, "Last name is required"),
		prefix: z.string().default(""),
		middle: z.string().default(""),
		suffix: z.string().default(""),
		companyName: z.string().default(""),
		nickname: z.string().default(""),
		maiden: z.string().default(""),
		gender: z.string().default(""),
	})
	.transform((data) => ({
		...data,
		prefix: data.prefix || undefined,
		middle: data.middle || undefined,
		suffix: data.suffix || undefined,
		companyName: data.companyName || undefined,
		nickname: data.nickname || undefined,
		maiden: data.maiden || undefined,
		gender: data.gender || undefined,
	}));

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

export const datesSchema = z
	.object({
		dateOfBirth: z.string().default(""),
		dateOfDeath: z.string().default(""),
		isDeceased: z.boolean(),
	})
	.transform((data) => ({
		...data,
		dateOfBirth: data.dateOfBirth || undefined,
		dateOfDeath: data.dateOfDeath || undefined,
	}));

export const phoneSchema = z.object({
	number: z.string().min(1, "Phone number is required"),
	type: z.string().min(1, "Phone type is required"),
	isPreferred: z.boolean(),
});

export const emailSchema = z.object({
	address: z.string().email("Invalid email address"),
	isPreferred: z.boolean(),
});

export const beneficiaryFormSchema = z
	.object({
		name: nameSchema,
		physicalAddress: addressSchema,
		mailingAddressSameAsPhysical: z.boolean(),
		mailingAddress: addressSchema.optional(),
		identification: identificationSchema,
		dates: datesSchema,
		role: z.string().default(""),
		ethnicity: z.string().default(""),
		race: z.string().default(""),
		isVeteran: z.boolean(),
		phones: z
			.array(phoneSchema)
			.min(1, "At least one phone number is required"),
		emails: z.array(emailSchema).min(1, "At least one email is required"),
		optOutOfFutureMarketing: z.boolean(),
	})
	.transform((data) => ({
		...data,
		role: data.role || undefined,
		ethnicity: data.ethnicity || undefined,
		race: data.race || undefined,
	}));

export type BeneficiaryFormValues = z.infer<typeof beneficiaryFormSchema>;
