// Define common types and interfaces
export interface BaseEntity {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ApiResponse<T> {
	data: T;
	status: number;
	message?: string;
}
