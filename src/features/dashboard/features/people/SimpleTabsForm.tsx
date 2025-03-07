import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormMachine } from "./useFormMachine";
import { defaultPeopleFormValues, type PeopleFormType } from "./shared-form";
import {
	useEffect,
	useState,
	useCallback,
	useRef,
	useImperativeHandle,
	forwardRef,
} from "react";
import { zodValidator } from "../../hooks/useCreateForm.tsx";
import { peopleFormSchema } from "./shared-form.tsx";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchPeople } from "./api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Default empty form data
const EMPTY_FORM_DATA: PeopleFormType = {
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

// Helper functions for validation
async function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

// Async validation function to check if email is already in use
async function checkIfEmailExists(
	email: string,
	existingPeople: PeopleFormType[] = [],
	currentId?: string,
) {
	await sleep(Math.floor(Math.random() * 500));
	return existingPeople.some(
		(person) => person.email === email && person.id !== currentId,
	);
}

// Async validation function to check if phone is valid
async function validatePhoneNumber(phone: string) {
	await sleep(Math.floor(Math.random() * 300));
	// Simple validation - phone should be at least 10 digits
	return phone.replace(/\D/g, "").length >= 10;
}

// Simple form field component
const FormField = ({
	label,
	value = "",
	onChange,
	error,
}: {
	label: string;
	value?: string;
	onChange: (value: string) => void;
	error?: string;
}) => {
	const id = `field-${label.replace(/\s+/g, "-").toLowerCase()}`;

	return (
		<div className="grid gap-2">
			<label className="text-sm font-medium" htmlFor={id}>
				{label}
			</label>
			<input
				id={id}
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className={`w-full rounded-md border ${error ? "border-red-500" : "border-gray-300"} px-3 py-2 text-sm`}
			/>
			{error && <p className="text-xs text-red-500">{error}</p>}
		</div>
	);
};

// Personal Info Form Component
const PersonalInfoForm = ({
	data,
	onChange,
	errors,
}: {
	data: PeopleFormType;
	onChange: (data: PeopleFormType) => void;
	errors: Record<string, string>;
}) => {
	// Ensure data is not undefined
	const safeData = data || EMPTY_FORM_DATA;

	const handleChange = (field: keyof PeopleFormType, value: string) => {
		onChange({
			...safeData,
			[field]: value,
		});
	};

	return (
		<div className="grid gap-4">
			<h2 className="text-lg font-semibold">Personal Information</h2>
			<FormField
				label="Full Name"
				value={safeData.fullName}
				onChange={(value) => handleChange("fullName", value)}
				error={errors.fullName}
			/>
			<FormField
				label="Email"
				value={safeData.email}
				onChange={(value) => handleChange("email", value)}
				error={errors.email}
			/>
			<FormField
				label="Phone"
				value={safeData.phone}
				onChange={(value) => handleChange("phone", value)}
				error={errors.phone}
			/>
		</div>
	);
};

// Address Form Component
const AddressForm = ({
	data,
	onChange,
	errors,
}: {
	data: PeopleFormType;
	onChange: (data: PeopleFormType) => void;
	errors: Record<string, string>;
}) => {
	// Ensure data is not undefined
	const safeData = data || EMPTY_FORM_DATA;
	// Ensure address is not undefined
	const address = safeData.address || EMPTY_FORM_DATA.address;

	const handleChange = (field: string, value: string) => {
		onChange({
			...safeData,
			address: {
				...address,
				[field]: value,
			},
		});
	};

	return (
		<div className="grid gap-4">
			<h2 className="text-lg font-semibold">Address</h2>
			<FormField
				label="Address Line 1"
				value={address.line1}
				onChange={(value) => handleChange("line1", value)}
				error={errors["address.line1"]}
			/>
			<FormField
				label="Address Line 2"
				value={address.line2}
				onChange={(value) => handleChange("line2", value)}
				error={errors["address.line2"]}
			/>
			<FormField
				label="City"
				value={address.city}
				onChange={(value) => handleChange("city", value)}
				error={errors["address.city"]}
			/>
			<FormField
				label="State"
				value={address.state}
				onChange={(value) => handleChange("state", value)}
				error={errors["address.state"]}
			/>
			<FormField
				label="ZIP Code"
				value={address.zip}
				onChange={(value) => handleChange("zip", value)}
				error={errors["address.zip"]}
			/>
		</div>
	);
};

// Emergency Contact Form Component
const EmergencyContactForm = ({
	data,
	onChange,
	errors,
}: {
	data: PeopleFormType;
	onChange: (data: PeopleFormType) => void;
	errors: Record<string, string>;
}) => {
	// Ensure data is not undefined
	const safeData = data || EMPTY_FORM_DATA;
	// Ensure emergencyContact is not undefined
	const emergencyContact =
		safeData.emergencyContact || EMPTY_FORM_DATA.emergencyContact;

	const handleChange = (field: string, value: string) => {
		onChange({
			...safeData,
			emergencyContact: {
				...emergencyContact,
				[field]: value,
			},
		});
	};

	return (
		<div className="grid gap-4">
			<h2 className="text-lg font-semibold">Emergency Contact</h2>
			<FormField
				label="Full Name"
				value={emergencyContact.fullName}
				onChange={(value) => handleChange("fullName", value)}
				error={errors["emergencyContact.fullName"]}
			/>
			<FormField
				label="Phone"
				value={emergencyContact.phone}
				onChange={(value) => handleChange("phone", value)}
				error={errors["emergencyContact.phone"]}
			/>
		</div>
	);
};

// Update the FormHeader to include both cancel and save buttons
const FormHeader = ({
	title,
	onSave,
	onCancel,
	isSubmitting,
}: {
	title: string;
	onSave: () => void;
	onCancel: () => void;
	isSubmitting: boolean;
}) => {
	// Log when the component renders with isSubmitting
	// This is just for debugging
	console.log("FormHeader rendering with isSubmitting:", isSubmitting);

	return (
		<div className="flex items-center justify-between mb-6 pb-4 border-b">
			<h1 className="text-2xl font-bold">{title}</h1>
			<div className="space-x-2">
				<Button
					variant="outline"
					onClick={onCancel}
					disabled={isSubmitting}
					className="min-w-[80px]"
				>
					Cancel
				</Button>
				<Button
					onClick={onSave}
					disabled={isSubmitting}
					className="bg-green-600 hover:bg-green-700 min-w-[120px]"
				>
					{isSubmitting ? (
						<div className="flex items-center justify-center">
							<Loader2 className="h-4 w-4 animate-spin mr-2" />
							<span>Saving...</span>
						</div>
					) : (
						"Save"
					)}
				</Button>
			</div>
		</div>
	);
};

// Update the FormFooter to include only navigation buttons
const FormFooter = ({
	currentStep,
	onPrev,
	onNext,
	showPrev = true,
	showNext = true,
}: {
	currentStep: string;
	onPrev: () => void;
	onNext: () => void;
	showPrev?: boolean;
	showNext?: boolean;
}) => {
	return (
		<div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between mt-8 z-40">
			<div>
				{showPrev && currentStep !== "personalInfo" && (
					<Button variant="outline" onClick={onPrev} className="min-w-[80px]">
						Previous
					</Button>
				)}
			</div>
			<div>
				{showNext && currentStep !== "emergencyContact" && (
					<Button onClick={onNext} className="min-w-[80px]">
						Next
					</Button>
				)}
			</div>
		</div>
	);
};

interface SimpleTabsFormProps {
	initialData?: PeopleFormType;
	onSubmit: (data: PeopleFormType) => Promise<void>;
	onSuccess?: () => void;
	showHeader?: boolean;
	onCancel?: () => void;
	onChange?: (data: PeopleFormType) => void;
}

export const SimpleTabsForm = forwardRef<
	{ submit: () => void } | null,
	SimpleTabsFormProps
>(
	(
		{ initialData, onSubmit, onSuccess, showHeader = true, onCancel, onChange },
		ref,
	) => {
		// Get the query client
		const queryClient = useQueryClient();

		// Initialize form data with defaults and initial data
		const [formData, setFormData] = useState<PeopleFormType>({
			...EMPTY_FORM_DATA,
			...(initialData || {}),
			address: {
				...EMPTY_FORM_DATA.address,
				...(initialData?.address || {}),
			},
			emergencyContact: {
				...EMPTY_FORM_DATA.emergencyContact,
				...(initialData?.emergencyContact || {}),
			},
		});

		// Create a local state for validation status
		const [localIsValid, setLocalIsValid] = useState({
			personalInfo: false,
			address: false,
			emergencyContact: false,
		});

		// Create a mutation for form submission
		const submitMutation = useMutation({
			mutationFn: (data: PeopleFormType) => onSubmit(data),
			onSuccess: () => {
				console.log("Mutation successful");
				onSuccess?.();
			},
			onError: (error) => {
				console.error("Mutation error:", error);
				toast.error(
					`Error: ${error instanceof Error ? error.message : "Unknown error"}`,
				);
			},
		});

		const {
			currentStep,
			formData: machineFormData,
			isValid,
			updateForm,
			validateStep,
			nextStep,
			prevStep,
			goToStep,
			submitForm,
			isSubmitting,
			isSuccess,
			isError,
		} = useFormMachine({ onSubmit, onSuccess });

		// Log isSubmitting state changes
		useEffect(() => {
			console.log("Form machine isSubmitting state:", isSubmitting);
		}, [isSubmitting]);

		// Use local validation state if isValid from the machine is undefined
		const validationState = isValid || localIsValid;

		// State for form errors
		const [errors, setErrors] = useState<Record<string, string>>({});

		// Initialize form data with initial data
		useEffect(() => {
			updateForm(formData);
		}, [formData, updateForm]);

		// Update form data when initialData changes
		useEffect(() => {
			if (initialData) {
				setFormData({
					...EMPTY_FORM_DATA,
					...initialData,
					address: {
						...EMPTY_FORM_DATA.address,
						...(initialData.address || {}),
					},
					emergencyContact: {
						...EMPTY_FORM_DATA.emergencyContact,
						...(initialData.emergencyContact || {}),
					},
				});
			}
		}, [initialData]);

		// Handle form validation for each step
		const handlePersonalInfoChange = (data: PeopleFormType) => {
			setFormData(data);
			updateForm(data);
			// Call the onChange callback if provided
			onChange?.(data);
		};

		const handleAddressChange = (data: PeopleFormType) => {
			setFormData(data);
			updateForm(data);
			// Call the onChange callback if provided
			onChange?.(data);
		};

		const handleEmergencyContactChange = (data: PeopleFormType) => {
			setFormData(data);
			updateForm(data);
			// Call the onChange callback if provided
			onChange?.(data);
		};

		// Handle form submission
		const handleSubmit = useCallback(async () => {
			console.log("handleSubmit called, current form data:", formData);

			// Validate all steps before submitting
			const isPersonalInfoValid = Boolean(
				formData?.fullName && formData?.phone,
			);
			const isAddressValid = true; // Address is always valid
			const isEmergencyContactValid = Boolean(
				formData?.emergencyContact?.fullName &&
					formData?.emergencyContact?.phone,
			);

			console.log("Validation results:", {
				isPersonalInfoValid,
				isAddressValid,
				isEmergencyContactValid,
			});

			// Update validation state
			validateStep("personalInfo", isPersonalInfoValid);
			validateStep("address", isAddressValid);
			validateStep("emergencyContact", isEmergencyContactValid);

			// Only submit if all steps are valid
			if (isPersonalInfoValid && isAddressValid && isEmergencyContactValid) {
				console.log("Form is valid, performing async validation...");

				try {
					// Fetch people data for validation
					const people = await queryClient.fetchQuery({
						queryKey: ["people"],
						queryFn: fetchPeople,
					});

					// Perform async validations
					const [isEmailAvailable, isPhoneValid] = await Promise.all([
						// Email validation logic:
						// 1. If no email provided, skip validation (email is optional)
						// 2. In edit mode, only validate if email changed from original
						// 3. Check if email is used by any other person
						formData.email
							? !(await checkIfEmailExists(formData.email, people, formData.id))
							: true,
						validatePhoneNumber(formData.phone || ""),
					]);

					// Check validation results
					if (!isEmailAvailable || !isPhoneValid) {
						console.log("Async validation failed", {
							isEmailAvailable,
							isPhoneValid,
						});

						// Show validation errors
						setErrors({
							...(!isEmailAvailable
								? { email: "This email is already in use" }
								: {}),
							...(!isPhoneValid ? { phone: "Phone number is invalid" } : {}),
						});

						// Navigate to the personal info step if there are errors
						goToStep("personalInfo");

						return;
					}

					console.log("Async validation passed, submitting form");

					// Make sure the form machine has the latest form data before submitting
					updateForm(formData);
					console.log("Updated form machine with latest form data");

					// Use the mutation to submit the form
					submitMutation.mutate(formData);
					console.log("Mutation initiated");
				} catch (error) {
					console.error("Validation error:", error);
					toast.error(
						`Error: ${error instanceof Error ? error.message : "Unknown error"}`,
					);
				}
			} else {
				console.log("Form is invalid, showing errors");
				// Show error message or navigate to the first invalid step
				if (!isPersonalInfoValid) {
					goToStep("personalInfo");
				} else if (!isEmergencyContactValid) {
					goToStep("emergencyContact");
				}

				// Show validation errors
				setErrors({
					...(isPersonalInfoValid
						? {}
						: {
								fullName: "Full name is required",
								phone: "Phone is required",
							}),
					...(isEmergencyContactValid
						? {}
						: {
								"emergencyContact.fullName":
									"Emergency contact name is required",
								"emergencyContact.phone": "Emergency contact phone is required",
							}),
				});
			}
		}, [
			formData,
			validateStep,
			goToStep,
			updateForm,
			queryClient,
			submitMutation,
		]);

		// Add a cancel handler
		const handleCancel = () => {
			// You might want to add confirmation if there are unsaved changes
			window.history.back();
		};

		// Use the provided onCancel handler if available, otherwise use the default
		const handleCancelAction = onCancel || handleCancel;

		// Determine the form title based on whether we're editing or creating
		const formTitle = initialData?.id ? "Edit Person" : "Add New Person";

		// Expose the handleSubmit function through the ref
		useImperativeHandle(
			ref,
			() => {
				console.log("Creating imperative handle");
				return {
					submit: handleSubmit,
				};
			},
			[handleSubmit],
		);

		return (
			<div className="space-y-6 relative pb-16">
				{/* Only show the header if showHeader is true */}
				{showHeader && (
					<FormHeader
						title={formTitle}
						onSave={handleSubmit}
						onCancel={handleCancelAction}
						isSubmitting={submitMutation.isPending} // Use React Query's isPending state
					/>
				)}

				<Tabs value={currentStep} onValueChange={goToStep} className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="personalInfo">Personal Info</TabsTrigger>
						<TabsTrigger value="address">Address</TabsTrigger>
						<TabsTrigger value="emergencyContact">
							Emergency Contact
						</TabsTrigger>
					</TabsList>

					<TabsContent value="personalInfo" className="mt-6">
						<PersonalInfoForm
							data={formData}
							onChange={handlePersonalInfoChange}
							errors={errors}
						/>
					</TabsContent>

					<TabsContent value="address" className="mt-6">
						<AddressForm
							data={formData}
							onChange={handleAddressChange}
							errors={errors}
						/>
					</TabsContent>

					<TabsContent value="emergencyContact" className="mt-6">
						<EmergencyContactForm
							data={formData}
							onChange={handleEmergencyContactChange}
							errors={errors}
						/>
					</TabsContent>
				</Tabs>

				{isError && (
					<div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
						An error occurred while submitting the form. Please try again.
					</div>
				)}

				{/* Keep the footer for navigation */}
				<FormFooter
					currentStep={currentStep}
					onPrev={prevStep}
					onNext={nextStep}
				/>
			</div>
		);
	},
);
