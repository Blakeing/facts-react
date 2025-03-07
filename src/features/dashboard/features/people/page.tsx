import { useAppForm } from "../../hooks/useCreateForm.tsx";

import {
	peopleFormOpts,
	peopleFormSchema,
	type PeopleFormType,
	defaultPeopleFormValues,
} from "./shared-form.tsx";

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
import { useState, useEffect, useRef } from "react";

import { SimpleTabsForm } from "./SimpleTabsForm";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { isEqual } from "lodash";

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
	const { data: people = [], isLoading } = useQuery({
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

	// Store the original person data for comparison
	const originalPersonRef = useRef<PeopleFormType | null>(null);

	// Effect to store the original person data when entering edit mode
	useEffect(() => {
		if (editMode && editPerson) {
			originalPersonRef.current = { ...editPerson };
		} else {
			originalPersonRef.current = null;
		}
	}, [editMode, editPerson]);

	// Effect to ensure form is reset when edit mode changes
	useEffect(() => {
		// Only reset the form if we have the current person data and we're in edit mode
		if (editPerson && !isLoading && editMode) {
			form.reset(editPerson);
		}
	}, [editMode, editPerson, isLoading, form]);

	// Add state for delete confirmation dialog
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [personToDelete, setPersonToDelete] = useState<string | null>(null);

	// Add state for cancel confirmation dialog
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

	// Add state for tabs form cancel confirmation
	const [tabsCancelDialogOpen, setTabsCancelDialogOpen] = useState(false);

	// Add state to track form changes
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	// Add state to store the initial form data
	const [initialFormData, setInitialFormData] = useState<
		PeopleFormType | undefined
	>(undefined);

	// Function to complete the cancel edit action
	const completeCancelEdit = () => {
		// Reset form and exit edit mode
		form.reset(defaultPeopleFormValues);
		setEditMode(false);
		setEditPerson(null);
		setCancelDialogOpen(false);
	};

	// Function to handle cancel edit
	const handleCancelEdit = () => {
		// For simplicity, always show the confirmation dialog
		setCancelDialogOpen(true);
	};

	// Function to handle delete button click
	const handleDelete = (id: string) => {
		setPersonToDelete(id);
		setDeleteDialogOpen(true);
	};

	// Function to confirm delete
	const confirmDelete = async () => {
		if (personToDelete) {
			try {
				await deletePersonMutation.mutateAsync(personToDelete);
				// Toast is already shown in the mutation's onSuccess callback
			} catch (error) {
				// Error toast is already shown in the mutation's onError callback
			} finally {
				setDeleteDialogOpen(false);
				setPersonToDelete(null);
			}
		}
	};

	// Function to handle cancel tabs form
	const handleCancelTabsForm = () => {
		// Check if there are any changes by comparing with the original data
		// For simplicity, we'll just show the dialog every time
		setTabsCancelDialogOpen(true);
	};

	// Function to confirm tabs form cancel
	const confirmTabsFormCancel = () => {
		setTabsCancelDialogOpen(false);
		setShowTabsForm(false);
		setHasUnsavedChanges(false);
		setInitialFormData(undefined);
	};

	// Add this section to use the TabsForm component
	const [showTabsForm, setShowTabsForm] = useState(false);
	const [currentPerson, setCurrentPerson] = useState<
		PeopleFormType | undefined
	>(undefined);

	// Function to handle add with tabs
	const handleAddWithTabs = () => {
		const defaultValues = { ...defaultPeopleFormValues };
		setCurrentPerson(defaultValues);
		setInitialFormData(defaultValues);
		setShowTabsForm(true);
		setHasUnsavedChanges(false);
	};

	// Function to handle edit with tabs
	const handleEditWithTabs = (person: PeopleFormType) => {
		// Create a completely new object to avoid any reference issues
		const personCopy = {
			id: person.id,
			fullName: person.fullName || "",
			email: person.email || "",
			phone: person.phone || "",
			address: {
				line1: person.address?.line1 || "",
				line2: person.address?.line2 || "",
				city: person.address?.city || "",
				state: person.address?.state || "",
				zip: person.address?.zip || "",
			},
			emergencyContact: {
				fullName: person.emergencyContact?.fullName || "",
				phone: person.emergencyContact?.phone || "",
			},
		};

		// Set the current person and show the form
		setCurrentPerson(personCopy);
		setInitialFormData(personCopy);
		setShowTabsForm(true);
		setHasUnsavedChanges(false);
	};

	// Add a flag to track if a save operation is in progress
	const [isSaving, setIsSaving] = useState(false);
	const formSubmitRef = useRef<{ submit: () => void } | null>(null);

	// Update the handleTabsFormSubmit function to use the flag
	const handleTabsFormSubmit = async (data: PeopleFormType) => {
		// Prevent multiple submissions
		if (isSaving) return;

		try {
			setIsSaving(true);

			if (data.id) {
				const updatedPerson = await updatePersonMutation.mutateAsync({
					id: data.id,
					data,
				});
				// Update the current person and initial form data with the saved data
				setCurrentPerson(updatedPerson);
				setInitialFormData(updatedPerson);
				// Toast is shown in the mutation's onSuccess callback
			} else {
				const newPerson = await createPersonMutation.mutateAsync(data);
				// Update the current person and initial form data with the saved data
				setCurrentPerson(newPerson);
				setInitialFormData(newPerson);
				// Toast is shown in the mutation's onSuccess callback
			}

			// Reset the unsaved changes flag
			setHasUnsavedChanges(false);

			// Keep the form open - don't navigate back to the table
		} catch (error) {
			// Error toasts are shown in the mutation's onError callbacks
		} finally {
			setIsSaving(false);
		}
	};

	const handleTabsFormSuccess = () => {
		// Don't close the form, just reset the unsaved changes flag
		setHasUnsavedChanges(false);
	};

	// Add the handleAdd function if it doesn't exist
	const handleAdd = () => {
		// Implementation for the original add functionality
		// This is a placeholder - implement according to your existing logic
		setEditMode(false);
		// Reset form or other necessary actions
	};

	// Function to handle form changes
	const handleFormChange = (data: PeopleFormType) => {
		// Compare with the initial data to determine if there are unsaved changes
		if (initialFormData) {
			// Deep comparison of the current form data with the initial data
			const hasChanges = !isEqual(data, initialFormData);
			setHasUnsavedChanges(hasChanges);

			// For debugging
			if (hasChanges) {
				console.log("Form has unsaved changes");
				console.log("Current data:", data);
				console.log("Initial data:", initialFormData);
			}
		}
	};

	if (showTabsForm) {
		return (
			<div className="container mx-auto py-8">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-4">
						<Button
							variant="outline"
							onClick={() => {
								// If there are unsaved changes, show the confirmation dialog
								if (hasUnsavedChanges) {
									handleCancelTabsForm();
								} else {
									// Otherwise, just go back to the list
									setShowTabsForm(false);
									setInitialFormData(undefined);
								}
							}}
							className="mr-2"
						>
							← Back to List
						</Button>
						<h1 className="text-2xl font-bold">
							{currentPerson?.id ? "Edit Person" : "Add New Person"}
						</h1>
					</div>
					<div className="space-x-2">
						<Button
							variant="outline"
							onClick={handleCancelTabsForm}
							className="relative"
						>
							Cancel
							{hasUnsavedChanges && (
								<span className="absolute -top-1 -right-1 flex h-3 w-3">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
									<span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
								</span>
							)}
						</Button>
						<Button
							onClick={() => {
								console.log("Save button clicked");
								if (formSubmitRef.current) {
									console.log("Calling submit function");
									formSubmitRef.current.submit();
								} else {
									console.error("formSubmitRef.current is null");
								}
							}}
							className="bg-green-600 hover:bg-green-700"
							disabled={isSaving}
						>
							{isSaving ? "Saving..." : "Save"}
						</Button>
					</div>
				</div>
				<SimpleTabsForm
					initialData={currentPerson}
					onSubmit={handleTabsFormSubmit}
					onSuccess={handleTabsFormSuccess}
					showHeader={false}
					onCancel={handleCancelTabsForm}
					onChange={handleFormChange}
					ref={formSubmitRef}
				/>

				{/* Tabs Form Cancel Confirmation Dialog */}
				<AlertDialog
					open={tabsCancelDialogOpen}
					onOpenChange={setTabsCancelDialogOpen}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Discard changes?</AlertDialogTitle>
							<AlertDialogDescription>
								You have unsaved changes. If you cancel now, your changes will
								be lost.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Continue editing</AlertDialogCancel>
							<AlertDialogAction onClick={confirmTabsFormCancel}>
								Discard changes
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		);
	}

	if (isLoading) {
		return <div>Loading people data...</div>;
	}

	return (
		<div className="container mx-auto py-8">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">People</h1>
				<div className="space-x-2">
					<Button onClick={handleAddWithTabs}>Add Person</Button>
				</div>
			</div>

			<div className="mt-8 bg-white rounded-lg shadow-xs overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Email
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Phone
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{people.map((person) => (
							<tr key={person.id}>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{person.fullName}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{person.email}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{person.phone}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEditWithTabs(person)}
									>
										Edit
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleDelete(person.id || "")}
									>
										Delete
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							person and remove their data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-red-600 hover:bg-red-700"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Cancel Confirmation Dialog */}
			<AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Discard changes?</AlertDialogTitle>
						<AlertDialogDescription>
							You have unsaved changes. If you cancel now, your changes will be
							lost.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setCancelDialogOpen(false)}>
							Continue editing
						</AlertDialogCancel>
						<AlertDialogAction onClick={completeCancelEdit}>
							Discard changes
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
