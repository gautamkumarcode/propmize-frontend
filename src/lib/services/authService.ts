import apiClient from "../api";
import {
	ApiResponse,
	AuthResponse,
	LoginCredentials,
	RegisterData,
	User,
} from "../types/api";
import { safeLocalStorage } from "../utils/storage";

export class AuthService {
	/**
	 * User login
	 */
	static async login(
		credentials: LoginCredentials
	): Promise<ApiResponse<AuthResponse>> {
		const response = await apiClient.post("/auth/login", credentials);

		// Store tokens in localStorage
		if (response.data.success) {
			const { accessToken, refreshToken } = response.data.data.tokens;
			safeLocalStorage.setItem("accessToken", accessToken);
			safeLocalStorage.setItem("refreshToken", refreshToken);
		}

		return response.data;
	}

	/**
	 * User registration
	 */
	static async register(
		userData: RegisterData
	): Promise<ApiResponse<AuthResponse>> {
		const response = await apiClient.post("/auth/register", userData);

		// Store tokens in localStorage
		if (response.data.success) {
			const { accessToken, refreshToken } = response.data.data.tokens;
			safeLocalStorage.setItem("accessToken", accessToken);
			safeLocalStorage.setItem("refreshToken", refreshToken);
		}

		return response.data;
	}

	/**
	 * User logout
	 */
	static async logout(): Promise<ApiResponse<null>> {
		try {
			await apiClient.post("/auth/logout");
		} catch (error) {
		} finally {
			// Always clear tokens
			safeLocalStorage.removeItem("accessToken");
			safeLocalStorage.removeItem("refreshToken");
		}

		return { success: true, message: "Logged out successfully", data: null };
	}

	/**
	 * Refresh access token
	 */
	static async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
		const refreshToken = safeLocalStorage.getItem("refreshToken");

		if (
			!refreshToken ||
			refreshToken === "null" ||
			refreshToken === "undefined"
		) {
			// Clean up invalid tokens
			safeLocalStorage.removeItem("accessToken");
			safeLocalStorage.removeItem("refreshToken");
			throw new Error("No refresh token available");
		}

		const response = await apiClient.post("/auth/refresh-token", {
			refreshToken,
		});

		if (response.data.success) {
			safeLocalStorage.setItem("accessToken", response.data.data.accessToken);
		}

		return response.data;
	}

	/**
	 * Get current user profile
	 */
	static async getProfile(): Promise<ApiResponse<User>> {
		const response = await apiClient.get("/auth/me");
		return response.data;
	}

	/**
	 * Forgot password
	 */
	static async forgotPassword(email: string): Promise<ApiResponse<null>> {
		const response = await apiClient.post("/auth/forgot-password", { email });
		return response.data;
	}

	/**
	 * Reset password
	 */
	static async resetPassword(
		token: string,
		password: string
	): Promise<ApiResponse<null>> {
		const response = await apiClient.post("/auth/reset-password", {
			token,
			password,
		});
		return response.data;
	}

	/**
	 * Verify email
	 */
	static async verifyEmail(token: string): Promise<ApiResponse<null>> {
		const response = await apiClient.post("/auth/verify-email", { token });
		return response.data;
	}

	/**
	 * Resend verification email
	 */
	static async resendVerification(): Promise<ApiResponse<null>> {
		const response = await apiClient.post("/auth/resend-verification");
		return response.data;
	}

	/**
	 * Check if user is authenticated
	 */
	static isAuthenticated(): boolean {
		const token = safeLocalStorage.getItem("accessToken");
		const hasValidToken = !!token && token !== "null" && token !== "undefined";

		// Clean up invalid tokens
		if (!hasValidToken && token) {
			safeLocalStorage.removeItem("accessToken");
			safeLocalStorage.removeItem("refreshToken");
		}

		return hasValidToken;
	}

	/**
	 * Get stored access token
	 */
	static getAccessToken(): string | null {
		const token = safeLocalStorage.getItem("accessToken");
		return token && token !== "null" && token !== "undefined" ? token : null;
	}

	/**
	 * Update user profile
	 */
}
