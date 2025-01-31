import axios from "axios";

// In development, use the proxy URL
const baseURL =
	import.meta.env.MODE === "development"
		? "/api"
		: // biome-ignore lint/complexity/useLiteralKeys: <explanation>
			import.meta.env["VITE_API_URL"];

const axiosInstance = axios.create({
	baseURL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (!error.response) {
			console.error("Network error:", error);
			throw new Error("Network error - please check your connection");
		}

		const originalRequest = error.config;

		// Handle 401 Unauthorized errors
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			// Here you could implement token refresh logic
			// const refreshToken = localStorage.getItem('refreshToken');
			// ... refresh token logic ...

			return axiosInstance(originalRequest);
		}

		// Enhance error message
		const message = error.response?.data?.message || error.message;
		throw new Error(message);
	},
);

export default axiosInstance;
