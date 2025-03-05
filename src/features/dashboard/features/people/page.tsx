import { useAppForm } from "../../hooks/useCreateForm.tsx";
import { AddressFields } from "./address-fields.tsx";
import {
	peopleFormOpts,
	peopleFormSchema,
	type PeopleFormType,
	defaultPeopleFormValues,
} from "./shared-form.tsx";
import { cn } from "@/lib/utils";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createPerson,
	fetchPeople,
	updatePerson,
	deletePerson,
} from "./api.ts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { zodValidator } from "../../hooks/useCreateForm.tsx";
import { useState, useEffect } from "react";

// Helper function to simulate server validation delay
async function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

// Async validation function to check if email is already in use
async function checkIfEmailExists(
	email: string,
	existingPeople: PeopleFormType[] = [],
) {
	await sleep(Math.floor(Math.random() * 500));
	return existingPeople.some((person) => person.email === email);
}

// Async validation function to check if phone is valid
async function validatePhoneNumber(phone: string) {
	await sleep(Math.floor(Math.random() * 300));
	// Simple validation - phone should be at least 10 digits
	return phone.replace(/\D/g, "").length >= 10;
}

export const PeoplePage = () => {
	const queryClient = useQueryClient();
	const [editMode, setEditMode] = useState(false);
	// Store the current person being edited
	const [editPerson, setEditPerson] = useState<PeopleFormType | null>(null);

	// Query to fetch people data
	const { data: people, isLoading } = useQuery({
		queryKey: ["people"],
		queryFn: fetchPeople,
	});

	// Mutation to create a new person
	const createPersonMutation = useMutation({
		mutationFn: createPerson,
		onSuccess: () => {
			// Invalidate the people query to refetch the data
			queryClient.invalidateQueries({ queryKey: ["people"] });
			toast.success("Person created successfully!");
			form.reset();
		},
		onError: (error) => {
			toast.error(`Error creating person: ${error.message}`);
		},
	});

	// Mutation to update a person
	const updatePersonMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: PeopleFormType }) =>
			updatePerson(id, data),
		onSuccess: () => {
			// Invalidate the people query to refetch the data
			queryClient.invalidateQueries({ queryKey: ["people"] });
			toast.success("Person updated successfully!");
			form.reset();
			setEditMode(false);
		},
		onError: (error) => {
			toast.error(`Error updating person: ${error.message}`);
		},
	});

	// Mutation to delete a person
	const deletePersonMutation = useMutation({
		mutationFn: deletePerson,
		onSuccess: () => {
			// Invalidate the people query to refetch the data
			queryClient.invalidateQueries({ queryKey: ["people"] });
			toast.success("Person deleted successfully!");
		},
		onError: (error) => {
			toast.error(`Error deleting person: ${error.message}`);
		},
	});

	const form = useAppForm({
		...peopleFormOpts,
		validators: {
			// Use the Zod validator helper
			onSubmit: zodValidator(peopleFormSchema),
			// Asynchronous validation
			onSubmitAsync: async ({ value }) => {
				try {
					// Run multiple validations in parallel
					const [isEmailAvailable, isPhoneValid] = await Promise.all([
						// Email validation logic:
						// 1. If no email provided, skip validation (email is optional)
						// 2. In edit mode, only validate if email changed from original
						// 3. Check if email is used by any other person
						value.email
							? (editMode && editPerson?.email === value.email) ||
								!(await checkIfEmailExists(
									value.email,
									people?.filter((p) => p.id !== value.id) || [],
								))
							: true,
						validatePhoneNumber(value.phone),
					]);

					if (!isEmailAvailable || !isPhoneValid) {
						return {
							form: "Validation failed",
							fields: {
								...(!isEmailAvailable
									? { email: "This email is already in use" }
									: {}),
								...(!isPhoneValid ? { phone: "Phone number is invalid" } : {}),
							},
						};
					}

					return null;
				} catch (error) {
					return {
						form: `Validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
					};
				}
			},
		},
		onSubmit: async ({ value }) => {
			try {
				if (editMode && value.id) {
					await updatePersonMutation.mutateAsync({ id: value.id, data: value });
				} else {
					await createPersonMutation.mutateAsync(value);
				}
			} catch (error) {
				console.error(error);
			}
		},
	});

	// Effect to ensure form is reset when edit mode changes
	useEffect(() => {
		// Only reset the form if we have the current person data and we're in edit mode
		if (editPerson && !isLoading && editMode) {
			form.reset(editPerson);
		}
	}, [editMode, editPerson, isLoading, form]);

	// Function to handle edit button click
	const handleEdit = (person: PeopleFormType) => {
		// First set edit mode
		setEditMode(true);
		// Set the current person being edited
		setEditPerson(person);
	};

	// Function to handle cancel edit
	const handleCancelEdit = () => {
		form.reset(defaultPeopleFormValues);
		setEditMode(false);
		setEditPerson(null);
	};

	// Function to handle delete button click
	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this person?")) {
			await deletePersonMutation.mutateAsync(id);
		}
	};

	if (isLoading) {
		return <div>Loading people data...</div>;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
			{/* Form Column */}
			<div>
				<h2 className="text-xl font-semibold mb-4">
					{editMode ? "Edit Person" : "Add New Person"}
				</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						void form.handleSubmit();
					}}
				>
					<div className="grid gap-4">
						<form.AppField
							name="fullName"
							validators={{
								onSubmit: ({ value }) =>
									!value ? "Full name is required" : null,
							}}
							children={(field) => <field.TextField label="Full Name" />}
						/>

						<form.AppField
							name="email"
							validators={{
								onSubmit: ({ value }) => {
									if (value && !value.includes("@"))
										return "Invalid email format";
									return null;
								},
							}}
							children={(field) => <field.TextField label="Email" />}
						/>

						<form.AppField
							name="phone"
							validators={{
								onSubmit: ({ value }) => (!value ? "Phone is required" : null),
							}}
							children={(field) => <field.TextField label="Phone" />}
						/>

						<AddressFields form={form} />

						{/* Emergency Contact Fields */}
						<div className="mt-4">
							<h2 className="text-xl font-semibold mb-2">Emergency Contact</h2>
							<div className="grid gap-4">
								<form.AppField
									name="emergencyContact.fullName"
									validators={{
										onSubmit: ({ value }) =>
											!value ? "Emergency contact name is required" : null,
									}}
									children={(field) => <field.TextField label="Full Name" />}
								/>

								<form.AppField
									name="emergencyContact.phone"
									validators={{
										onSubmit: ({ value }) =>
											!value ? "Emergency contact phone is required" : null,
									}}
									children={(field) => <field.TextField label="Phone" />}
								/>
							</div>
						</div>
					</div>

					{/* Form-level error display */}
					<form.Subscribe
						selector={(state) => [state.errorMap]}
						children={([errorMap]) =>
							errorMap?.onSubmit ? (
								<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
									<p className="text-red-600 text-sm">
										{String(errorMap.onSubmit)}
									</p>
								</div>
							) : null
						}
					/>

					{/* Submit and Reset buttons */}
					<div className="mt-6 flex gap-2">
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
							children={([canSubmit, isSubmitting]) => (
								<>
									<Button type="submit" disabled={!canSubmit || isSubmitting}>
										{isSubmitting
											? "Submitting..."
											: editMode
												? "Update"
												: "Submit"}
									</Button>
									{editMode ? (
										<Button
											type="button"
											variant="outline"
											onClick={handleCancelEdit}
										>
											Cancel
										</Button>
									) : (
										<Button
											type="button"
											variant="outline"
											onClick={() => form.reset()}
										>
											Reset
										</Button>
									)}
								</>
							)}
						/>
					</div>
				</form>
			</div>

			{/* Data Display Column */}
			<div className="space-y-6">
				{/* Form Data Debugger */}
				<div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
					<h2 className="text-xl font-semibold mb-4">Form Data Debugger</h2>
					<div className="overflow-auto max-h-[300px]">
						<form.Subscribe
							selector={(state) => [
								state.values,
								state.errors,
								state.isSubmitting,
								state.isValid,
								state.isDirty,
								state.canSubmit,
							]}
							children={([
								values,
								errors,
								isSubmitting,
								isValid,
								isDirty,
								canSubmit,
							]) => (
								<pre
									className={cn(
										"text-sm bg-slate-100 dark:bg-slate-800 p-4 rounded-md",
										"overflow-x-auto whitespace-pre-wrap break-words",
									)}
								>
									{JSON.stringify(
										{
											values,
											errors,
											isSubmitting,
											isValid,
											isDirty,
											canSubmit,
										},
										null,
										2,
									)}
								</pre>
							)}
						/>
					</div>
				</div>

				{/* People List */}
				<div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
					<h2 className="text-xl font-semibold mb-4">People List</h2>
					<div className="overflow-auto max-h-[300px]">
						{people && people.length > 0 ? (
							<ul className="space-y-2">
								{people.map((person) => (
									<li
										key={person.id}
										className="p-3 bg-white dark:bg-slate-800 rounded-md shadow-sm"
									>
										<div className="font-medium">{person.fullName}</div>
										<div className="text-sm text-muted-foreground">
											{person.email}
										</div>
										<div className="text-sm">{person.phone}</div>
										<div className="mt-2 flex gap-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() => handleEdit(person)}
											>
												Edit
											</Button>
											<Button
												size="sm"
												variant="destructive"
												onClick={() => handleDelete(person.id as string)}
											>
												Delete
											</Button>
										</div>
									</li>
								))}
							</ul>
						) : (
							<p className="text-muted-foreground">No people found.</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
