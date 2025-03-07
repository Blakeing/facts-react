export interface User {
	id: string;
	name: string;
	email: string;
	createdAt: string;
	role: string;
	status: "active" | "inactive";
	lastLogin?: string;
}
