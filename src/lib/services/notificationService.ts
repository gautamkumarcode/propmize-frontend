import apiClient from "../api";
import { ApiResponse } from "../types/api";

// Notification types
export interface Notification {
	id: string;
	userId: string;
	type: "lead" | "property" | "payment" | "system" | "promotion";
	title: string;
	message: string;
	data?: Record<string, any>;
	isRead: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface NotificationPreferences {
	email: {
		leads: boolean;
		propertyUpdates: boolean;
		paymentReminders: boolean;
		promotions: boolean;
		systemUpdates: boolean;
	};
	sms: {
		leads: boolean;
		paymentReminders: boolean;
		systemAlerts: boolean;
	};
	push: {
		leads: boolean;
		messages: boolean;
		propertyUpdates: boolean;
		promotions: boolean;
	};
}

export class NotificationService {
	/**
	 * Get all notifications for current user
	 */
	static async getNotifications(
		filters: {
			type?: "lead" | "property" | "payment" | "system" | "promotion";
			isRead?: boolean;
			page?: number;
			limit?: number;
		} = {}
	): Promise<ApiResponse<Notification[]>> {
		const params = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(`/notifications?${params.toString()}`);
		return response.data;
	}

	/**
	 * Get unread notification count
	 */
	static async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
		const response = await apiClient.get("/notifications/unread-count");
		return response.data;
	}

	/**
	 * Mark notification as read
	 */
	static async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
		const response = await apiClient.put(
			`/notifications/${notificationId}/read`
		);
		return response.data;
	}

	/**
	 * Mark all notifications as read
	 */
	static async markAllAsRead(): Promise<ApiResponse<Notification[]>> {
		const response = await apiClient.put("/notifications/mark-all-read");
		return response.data;
	}

	/**
	 * Delete notification
	 */
	static async deleteNotification(
		notificationId: string
	): Promise<ApiResponse<Notification>> {
		const response = await apiClient.delete(`/notifications/${notificationId}`);
		return response.data;
	}

	/**
	 * Clear all notifications
	 */
	static async clearAllNotifications(): Promise<ApiResponse<Notification[]>> {
		const response = await apiClient.delete("/notifications/clear-all");
		return response.data;
	}

	/**
	 * Get notification preferences
	 */
	static async getPreferences(): Promise<ApiResponse<NotificationPreferences>> {
		const response = await apiClient.get("/notifications/preferences");
		return response.data;
	}

	/**
	 * Update notification preferences
	 */
	static async updatePreferences(
		preferences: Partial<NotificationPreferences>
	): Promise<ApiResponse<NotificationPreferences>> {
		const response = await apiClient.put(
			"/notifications/preferences",
			preferences
		);
		return response.data;
	}

	/**
	 * Subscribe to push notifications
	 */
	static async subscribePush(
		subscription: PushSubscription
	): Promise<ApiResponse<Notification>> {
		const response = await apiClient.post("/notifications/push/subscribe", {
			subscription: subscription.toJSON(),
		});
		return response.data;
	}

	/**
	 * Unsubscribe from push notifications
	 */
	static async unsubscribePush(): Promise<ApiResponse<Notification>> {
		const response = await apiClient.post("/notifications/push/unsubscribe");
		return response.data;
	}

	/**
	 * Test notification (for development/testing)
	 */
	static async sendTestNotification(
		type: "email" | "sms" | "push"
	): Promise<ApiResponse<Notification>> {
		const response = await apiClient.post("/notifications/test", { type });
		return response.data;
	}
}
