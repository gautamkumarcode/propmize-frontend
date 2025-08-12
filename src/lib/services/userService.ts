import apiClient from "../api";
import { ApiResponse, User, UserUpdateData } from "../types/api";

export class UserService {
	/**
	 * Get user profile
	 */
	static async getProfile(): Promise<ApiResponse<User>> {
		const response = await apiClient.get("/users/profile");
		return response.data;
	}

	/**
	 * Update user profile
	 */
	static async updateProfile(
		updateData: UserUpdateData
	): Promise<ApiResponse<User>> {
		const formData = new FormData();

		Object.entries(updateData).forEach(([key, value]) => {
			if (key === "avatar" && value instanceof File) {
				formData.append("avatar", value);
			} else if (typeof value === "object") {
				formData.append(key, JSON.stringify(value));
			} else if (value !== undefined) {
				formData.append(key, String(value));
			}
		});

		const response = await apiClient.put("/users/profile", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return response.data;
	}

	/**
	 * Change password
	 */
	static async changePassword(
		currentPassword: string,
		newPassword: string
	): Promise<ApiResponse> {
		const response = await apiClient.put("/users/change-password", {
			currentPassword,
			newPassword,
		});
		return response.data;
	}

	/**
	 * Delete account
	 */
	static async deleteAccount(password: string): Promise<ApiResponse> {
		const response = await apiClient.delete("/users/profile", {
			data: { password },
		});
		return response.data;
	}

	/**
	 * Get user statistics (for sellers)
	 */
	static async getUserStats(): Promise<ApiResponse> {
		const response = await apiClient.get("/users/stats");
		return response.data;
	}

	/**
	 * Get user's activity feed
	 */
	static async getActivityFeed(): Promise<ApiResponse> {
		const response = await apiClient.get("/users/activity");
		return response.data;
	}

	/**
	 * Update notification preferences
	 */
	static async updateNotificationPreferences(preferences: {
		email: boolean;
		sms: boolean;
		push: boolean;
		marketing: boolean;
	}): Promise<ApiResponse> {
		const response = await apiClient.put("/users/notifications", preferences);
		return response.data;
	}
}
