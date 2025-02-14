import * as z from "zod";

// Define phone types as a literal union
const PhoneType = z.enum(["Mobile", "Home", "Work"]);
export type PhoneType = z.infer<typeof PhoneType>;

export const nameSchema = z.object({
	first: z.string().min(1, "First name is required"),
	last: z.string().min(1, "Last name is required"),
	prefix: z
		.string()
		.optional()
		.transform((v) => v || undefined),
	middle: z
		.string()
		.optional()
		.transform((v) => v || undefined),
	suffix: z
		.string()
		.optional()
		.transform((v) => v || undefined),
	companyName: z
		.string()
		.optional()
		.transform((v) => v || undefined),
	nickname: z
		.string()
		.optional()
		.transform((v) => v || undefined),
	maiden: z
		.string()
		.optional()
		.transform((v) => v || undefined),
	gender: z
		.string()
		.optional()
		.transform((v) => v || undefined),
});
export type Name = z.infer<typeof nameSchema>;

export const addressSchema = z.object({
	street: z.string().min(1, "Street address is required"),
	city: z.string().min(1, "City is required"),
	state: z.string().min(1, "State is required"),
	postalCode: z.string().min(1, "Postal code is required"),
	country: z.string().min(1, "Country is required").default("United States"),
});
export type Address = z.infer<typeof addressSchema>;

export const identificationSchema = z.object({
	stateIdNumber: z.string().min(1, "State ID number is required"),
	issuer: z.string().min(1, "Issuer is required"),
});
export type Identification = z.infer<typeof identificationSchema>;

export const datesSchema = z.object({
	dateOfBirth: z
		.string()
		.optional()
		.transform((v) => v || undefined),
	dateOfDeath: z
		.string()
		.optional()
		.transform((v) => v || undefined),
	isDeceased: z.boolean().default(false),
});
export type Dates = z.infer<typeof datesSchema>;

export const phoneSchema = z.object({
	number: z.string().min(1, "Phone number is required"),
	type: PhoneType,
	isPreferred: z.boolean().default(false),
});
export type Phone = z.infer<typeof phoneSchema>;

export const emailSchema = z.object({
	address: z.string().email("Invalid email address"),
	isPreferred: z.boolean().default(false),
});
export type Email = z.infer<typeof emailSchema>;

export const beneficiaryFormSchema = z.object({
	name: nameSchema,
	physicalAddress: addressSchema,
	mailingAddressSameAsPhysical: z.boolean().default(true),
	mailingAddress: addressSchema.optional(),
	identification: identificationSchema,
	dates: datesSchema,
	role: z
		.string()
		.optional()
		.transform((v) => v || undefined),
	ethnicity: z
		.string()
		.optional()
		.transform((v) => v || undefined),
	race: z
		.string()
		.optional()
		.transform((v) => v || undefined),
	isVeteran: z.boolean().default(false),
	phones: z.array(phoneSchema).min(1, "At least one phone number is required"),
	emails: z.array(emailSchema).min(1, "At least one email is required"),
	optOutOfFutureMarketing: z.boolean().default(false),
});

// The form values type is now derived directly from the schema
export type BeneficiaryFormValues = z.infer<typeof beneficiaryFormSchema>;

// We can also export the input type (before transformations) if needed
export type BeneficiaryFormInput = z.input<typeof beneficiaryFormSchema>;
