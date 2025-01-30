import axiosInstance from "./axiosInstance";

interface LoginCredentials {
	email: string;
	password: string;
}

interface RegisterCredentials extends LoginCredentials {
	name: string;
}

interface AuthResponse {
	token: string;
	user: {
		id: string;
		email: string;
		name: string;
	};
}

export const authApi = {
	login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
		const { data } = await axiosInstance.post<AuthResponse>(
			"/auth/login",
			credentials,
		);
		return data;
	},

	register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
		const { data } = await axiosInstance.post<AuthResponse>(
			"/auth/register",
			credentials,
		);
		return data;
	},

	logout: async (): Promise<void> => {
		await axiosInstance.post("/auth/logout");
		localStorage.removeItem("token");
	},

	getCurrentUser: async () => {
		const { data } = await axiosInstance.get<AuthResponse>("/auth/me");
		return data;
	},
};
