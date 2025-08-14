// Notification service for triggering notifications from anywhere in the app

type NotificationType =
	| "info"
	| "success"
	| "warning"
	| "error"
	| "property"
	| "message"
	| "system";

export interface NotificationOptions {
	title: string;
	message: string;
	type?: NotificationType;
	actionUrl?: string;
	metadata?: {
		propertyId?: string;
		propertyTitle?: string;
		senderName?: string;
		amount?: number;
	};
}

// Global notification handlers (will be set by useNotifications hook)
let globalNotificationHandlers: {
	add?: (notification: NotificationOptions) => void;
	markAsRead?: (id: string) => void;
	markAllAsRead?: () => void;
	delete?: (id: string) => void;
} = {};

export const NotificationService = {
	// Register notification handlers (called by useNotifications hook)
	registerHandlers: (handlers: typeof globalNotificationHandlers) => {
		globalNotificationHandlers = handlers;
	},

	// Add a new notification
	notify: (options: NotificationOptions) => {
		if (globalNotificationHandlers.add) {
			globalNotificationHandlers.add({
				type: "info",
				...options,
			});
		} else {
			console.warn("Notification service not initialized");
		}
	},

	// Convenience methods for different types
	success: (title: string, message: string, actionUrl?: string) => {
		NotificationService.notify({
			title,
			message,
			type: "success",
			actionUrl,
		});
	},

	error: (title: string, message: string, actionUrl?: string) => {
		NotificationService.notify({
			title,
			message,
			type: "error",
			actionUrl,
		});
	},

	warning: (title: string, message: string, actionUrl?: string) => {
		NotificationService.notify({
			title,
			message,
			type: "warning",
			actionUrl,
		});
	},

	property: (
		title: string,
		message: string,
		propertyData?: { id?: string; title?: string; url?: string }
	) => {
		NotificationService.notify({
			title,
			message,
			type: "property",
			actionUrl: propertyData?.url || `/property/${propertyData?.id}`,
			metadata: {
				propertyId: propertyData?.id,
				propertyTitle: propertyData?.title,
			},
		});
	},

	message: (
		title: string,
		message: string,
		senderName?: string,
		chatUrl?: string
	) => {
		NotificationService.notify({
			title,
			message,
			type: "message",
			actionUrl: chatUrl,
			metadata: {
				senderName,
			},
		});
	},

	// Mark notifications as read
	markAsRead: (id: string) => {
		if (globalNotificationHandlers.markAsRead) {
			globalNotificationHandlers.markAsRead(id);
		}
	},

	markAllAsRead: () => {
		if (globalNotificationHandlers.markAllAsRead) {
			globalNotificationHandlers.markAllAsRead();
		}
	},

	// Delete notification
	delete: (id: string) => {
		if (globalNotificationHandlers.delete) {
			globalNotificationHandlers.delete(id);
		}
	},
};

// Example usage:
// import { NotificationService } from "@/services/notificationService";
//
// // Simple notification
// NotificationService.success("Success!", "Your property was saved successfully.");
//
// // Property notification
// NotificationService.property("New Match Found", "A property matching your criteria is available", {
//   id: "123",
//   title: "Cozy 2BHK Apartment",
//   url: "/property/123"
// });
//
// // Message notification
// NotificationService.message("New Message", "You have a new message from the property owner", "John Doe", "/chat/456");
