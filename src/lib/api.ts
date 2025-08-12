import axios, {
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from "axios";
import { safeLocalStorage } from "./utils/storage";

// API Configuration
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000, // 30 seconds
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true, // Important for cookies
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// Get token from localStorage or cookies safely
		const token = safeLocalStorage.getItem("accessToken");

		if (token && config.headers) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}

		return config;
	},
	(error: any) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle auth errors and token refresh
apiClient.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	async (error: any) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Try to refresh token
				const refreshToken = safeLocalStorage.getItem("refreshToken");

				if (refreshToken) {
					const response = await axios.post(
						`${API_BASE_URL}/auth/refresh-token`,
						{
							refreshToken,
						}
					);

					const { accessToken } = response.data.data;
					safeLocalStorage.setItem("accessToken", accessToken);

					// Retry original request with new token
					originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
					return apiClient(originalRequest);
				}
			} catch (refreshError) {
				// Refresh failed, redirect to login
				safeLocalStorage.removeItem("accessToken");
				safeLocalStorage.removeItem("refreshToken");
				if (typeof window !== "undefined") {
					window.location.href = "/auth/login";
				}
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;
