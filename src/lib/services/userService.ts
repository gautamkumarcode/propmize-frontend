import { AxiosRequestConfig } from "axios";
import apiClient from "../api";
import { ApiResponse, User } from "../types/api";

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
		updateData: FormData | any
	): Promise<ApiResponse<User>> {
		let config: AxiosRequestConfig = {};

		console.log("Update data received in service:", updateData);
		// Check if it's FormData and set appropriate headers
		if (updateData instanceof FormData) {
			config = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			};
		}

		const response = await apiClient.put(
			"/users/profile/update",
			updateData,
			config
		);
		return response.data;
	}

	/**
	 * Change password
	 */
	static async changePassword(
		currentPassword: string,
		newPassword: string
	): Promise<ApiResponse<unknown>> {
		const response = await apiClient.put("/users/change-password", {
			currentPassword,
			newPassword,
		});
		return response.data;
	}

	/**
	 * Delete account
	 */
	static async deleteAccount(password: string): Promise<ApiResponse<unknown>> {
		const response = await apiClient.delete("/users/profile", {
			data: { password },
		});
		return response.data;
	}

	/**
	 * Get user statistics (for sellers)
	 */
	static async getUserStats(): Promise<ApiResponse<unknown>> {
		const response = await apiClient.get("/users/stats");
		return response.data;
	}

	/**
	 * Get user's activity feed
	 */
	static async getActivityFeed(): Promise<ApiResponse<unknown>> {
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
	}): Promise<ApiResponse<unknown>> {
		const response = await apiClient.put("/users/notifications", preferences);
		return response.data;
	}
}
