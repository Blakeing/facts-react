import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormMachine } from "./useFormMachine";
import { AddressFields } from "./address-fields";
import { defaultPeopleFormValues, type PeopleFormType } from "./shared-form";
import { useEffect, useState } from "react";
import { useAppForm } from "../../hooks/useCreateForm.tsx";
import { peopleFormOpts } from "./shared-form.tsx";

// Personal Info Form Component
const PersonalInfoForm = ({
	data,
	onChange,
}: {
	data: PeopleFormType;
	onChange: (data: PeopleFormType) => void;
}) => {
	const form = useAppForm({
		...peopleFormOpts,
		defaultValues: data,
		onSubmit: async (values) => {
			onChange(values);
		},
	});

	// Use local state to track form values
	const [formValues, setFormValues] = useState(data);

	// Update parent form when form values change
	useEffect(() => {
		// Set initial form values
		form.reset(data);
	}, [data, form]);

	// Handle form field changes
	const handleFieldChange = (field: string, value: any) => {
		const updatedValues = {
			...formValues,
			[field]: value,
		};
		setFormValues(updatedValues);
		onChange(updatedValues);
	};

	return (
		<div className="grid gap-4">
			<h2>Personal Information</h2>
			<form.AppField
				name="fullName"
				children={(field) => (
					<field.TextField
						label="Full Name"
						onChange={(e) => handleFieldChange("fullName", e.target.value)}
					/>
				)}
			/>
			<form.AppField
				name="email"
				children={(field) => (
					<field.TextField
						label="Email"
						onChange={(e) => handleFieldChange("email", e.target.value)}
					/>
				)}
			/>
			<form.AppField
				name="phone"
				children={(field) => (
					<field.TextField
						label="Phone"
						onChange={(e) => handleFieldChange("phone", e.target.value)}
					/>
				)}
			/>
		</div>
	);
};

// Emergency Contact Form Component
const EmergencyContactForm = ({
	data,
	onChange,
}: {
	data: PeopleFormType;
	onChange: (data: PeopleFormType) => void;
}) => {
	const form = useAppForm({
		...peopleFormOpts,
		defaultValues: data,
		onSubmit: async (values) => {
			onChange(values);
		},
	});

	// Use local state to track form values
	const [formValues, setFormValues] = useState(data);

	// Update form with initial data
	useEffect(() => {
		form.reset(data);
	}, [data, form]);

	// Handle emergency contact field changes
	const handleEmergencyContactChange = (field: string, value: any) => {
		const updatedValues = {
			...formValues,
			emergencyContact: {
				...formValues.emergencyContact,
				[field]: value,
			},
		};
		setFormValues(updatedValues);
		onChange(updatedValues);
	};

	return (
		<div className="grid gap-4">
			<h2>Emergency Contact</h2>
			<form.AppField
				name="emergencyContact.fullName"
				children={(field) => (
					<field.TextField
						label="Full Name"
						onChange={(e) =>
							handleEmergencyContactChange("fullName", e.target.value)
						}
					/>
				)}
			/>
			<form.AppField
				name="emergencyContact.phone"
				children={(field) => (
					<field.TextField
						label="Phone"
						onChange={(e) =>
							handleEmergencyContactChange("phone", e.target.value)
						}
					/>
				)}
			/>
		</div>
	);
};

// Custom wrapper for AddressFields to match our interface
const AddressFormWrapper = ({
	data,
	onChange,
}: {
	data: PeopleFormType;
	onChange: (data: PeopleFormType) => void;
}) => {
	// Use local state to track form values
	const [formValues, setFormValues] = useState(data);

	// Handle address field changes
	const handleAddressChange = (updatedData: PeopleFormType) => {
		setFormValues(updatedData);
		onChange(updatedData);
	};

	return (
		<AddressFields
			form={{
				defaultValues: data,
				onValuesChange: handleAddressChange,
			}}
		/>
	);
};

interface TabsFormProps {
	initialData?: PeopleFormType;
	onSubmit: (data: PeopleFormType) => Promise<void>;
	onSuccess?: () => void;
}

export function TabsForm({
	initialData = defaultPeopleFormValues,
	onSubmit,
	onSuccess,
}: TabsFormProps) {
	const {
		currentStep,
		formData,
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

	// Initialize form data with initial data
	useEffect(() => {
		updateForm(initialData);
	}, [initialData, updateForm]);

	// Handle form validation for each step
	const handlePersonalInfoChange = (data: PeopleFormType) => {
		updateForm(data);
		const isPersonalInfoValid = Boolean(data.fullName && data.phone);
		validateStep("personalInfo", isPersonalInfoValid);
	};

	const handleAddressChange = (data: PeopleFormType) => {
		updateForm(data);
		// Address is always valid as all fields are optional
		validateStep("address", true);
	};

	const handleEmergencyContactChange = (data: PeopleFormType) => {
		updateForm(data);
		const isEmergencyContactValid = Boolean(
			data.emergencyContact?.fullName && data.emergencyContact?.phone,
		);
		validateStep("emergencyContact", isEmergencyContactValid);
	};

	return (
		<div className="space-y-6">
			<Tabs value={currentStep} onValueChange={goToStep} className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger
						value="personalInfo"
						disabled={!isValid.personalInfo && currentStep !== "personalInfo"}
					>
						Personal Info
					</TabsTrigger>
					<TabsTrigger
						value="address"
						disabled={
							!isValid.personalInfo ||
							(!isValid.address && currentStep !== "address")
						}
					>
						Address
					</TabsTrigger>
					<TabsTrigger
						value="emergencyContact"
						disabled={
							!isValid.personalInfo ||
							!isValid.address ||
							(!isValid.emergencyContact && currentStep !== "emergencyContact")
						}
					>
						Emergency Contact
					</TabsTrigger>
				</TabsList>

				<TabsContent value="personalInfo" className="mt-6">
					<PersonalInfoForm
						data={formData}
						onChange={handlePersonalInfoChange}
					/>
					<div className="mt-6 flex justify-end">
						<Button onClick={nextStep} disabled={!isValid.personalInfo}>
							Next
						</Button>
					</div>
				</TabsContent>

				<TabsContent value="address" className="mt-6">
					<AddressFormWrapper data={formData} onChange={handleAddressChange} />
					<div className="mt-6 flex justify-between">
						<Button variant="outline" onClick={prevStep}>
							Previous
						</Button>
						<Button onClick={nextStep} disabled={!isValid.address}>
							Next
						</Button>
					</div>
				</TabsContent>

				<TabsContent value="emergencyContact" className="mt-6">
					<EmergencyContactForm
						data={formData}
						onChange={handleEmergencyContactChange}
					/>
					<div className="mt-6 flex justify-between">
						<Button variant="outline" onClick={prevStep}>
							Previous
						</Button>
						<Button
							onClick={submitForm}
							disabled={!isValid.emergencyContact || isSubmitting}
						>
							{isSubmitting ? "Submitting..." : "Submit"}
						</Button>
					</div>
				</TabsContent>
			</Tabs>

			{isError && (
				<div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
					An error occurred while submitting the form. Please try again.
				</div>
			)}
		</div>
	);
}
