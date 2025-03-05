import type { PeopleFormType } from "./shared-form";

const API_URL = "/api/people";

// Function to fetch a person by ID
export async function fetchPerson(id: string): Promise<PeopleFormType> {
	const response = await fetch(`${API_URL}/${id}`);
	if (!response.ok) {
		throw new Error("Failed to fetch person");
	}
	return response.json();
}

// Function to fetch all people
export async function fetchPeople(): Promise<PeopleFormType[]> {
	const response = await fetch(API_URL);
	if (!response.ok) {
		throw new Error("Failed to fetch people");
	}
	return response.json();
}

// Function to create a new person
export async function createPerson(
	data: PeopleFormType,
): Promise<PeopleFormType> {
	const response = await fetch(API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error("Failed to create person");
	}

	return response.json();
}

// Function to update a person
export async function updatePerson(
	id: string,
	data: PeopleFormType,
): Promise<PeopleFormType> {
	const response = await fetch(`${API_URL}/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error("Failed to update person");
	}

	return response.json();
}

// Function to delete a person
export async function deletePerson(id: string): Promise<void> {
	const response = await fetch(`${API_URL}/${id}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		throw new Error("Failed to delete person");
	}
}
