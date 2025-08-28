// Firebase Push Notifications Service
// This service will work when Firebase is installed and configured

export interface FirebaseConfig {
	apiKey: string;
	authDomain: string;
	projectId: string;
	storageBucket: string;
	messagingSenderId: string;
	appId: string;
	measurementId?: string;
}

export interface NotificationPayload {
	title: string;
	body: string;
	icon?: string;
	badge?: string;
	data?: Record<string, unknown>;
}

import type { FirebaseApp } from "firebase/app";
import type { MessagePayload, Messaging } from "firebase/messaging";

export class FirebaseNotificationService {
	private app: FirebaseApp | null = null;
	private messaging: Messaging | null = null;
	private isInitialized = false;

	constructor(config: FirebaseConfig) {
		// Initialize Firebase only when available
		this.initializeFirebase(config);
	}

	private async initializeFirebase(config: FirebaseConfig) {
		try {
			// Dynamic import to avoid errors when Firebase is not installed
			const { getApp, getApps, initializeApp } = await import("firebase/app");

			// Initialize Firebase app if not already initialized
			this.app = getApps().length === 0 ? initializeApp(config) : getApp();

			// Initialize messaging only in browser environment
			if (typeof window !== "undefined") {
				try {
					const { getMessaging } = await import("firebase/messaging");
					this.messaging = getMessaging(this.app);
					this.isInitialized = true;
				} catch (error) {
					console.error("Firebase messaging initialization error:", error);
				}
			}
		} catch (error) {
			console.warn("Firebase not available:", error);
			this.isInitialized = false;
		}
	}

	async requestPermission(): Promise<boolean> {
		if (!("Notification" in window)) {
			console.warn("This browser does not support notifications");
			return false;
		}

		const permission = await Notification.requestPermission();
		return permission === "granted";
	}

	async getFCMToken(vapidKey: string): Promise<string | null> {
		if (!this.messaging || !this.isInitialized) {
			console.error("Firebase messaging not initialized");
			return null;
		}

		try {
			const { getToken } = await import("firebase/messaging");

			const hasPermission = await this.requestPermission();
			if (!hasPermission) {
				console.warn("Notification permission denied");
				return null;
			}

			const token = await getToken(this.messaging, { vapidKey });
			console.log("FCM Token:", token);
			return token;
		} catch (error) {
			console.error("Error getting FCM token:", error);
			return null;
		}
	}

	async setupForegroundListener(
		callback: (payload: NotificationPayload) => void
	): Promise<void> {
		if (!this.messaging || !this.isInitialized) {
			console.error("Firebase messaging not initialized");
			return;
		}

		try {
			const { onMessage } = await import("firebase/messaging");

			onMessage(this.messaging, (payload: MessagePayload) => {
				console.log("Foreground message received:", payload);

				const notification: NotificationPayload = {
					title: payload.notification?.title || "E-State Platform",
					body: payload.notification?.body || "New notification",
					icon: payload.notification?.icon || "/favicon.ico",
					data: payload.data as Record<string, unknown> | undefined,
				};

				callback(notification);
			});
		} catch (error) {
			console.error("Error setting up foreground listener:", error);
		}
	}

	async sendNotificationToServer(
		token: string,
		notification: NotificationPayload,
		targetUserId?: string
	): Promise<boolean> {
		try {
			const response = await fetch("/api/notifications/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token,
					notification,
					targetUserId,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to send notification");
			}

			return true;
		} catch (error) {
			console.error("Error sending notification:", error);
			return false;
		}
	}

	async subscribeToTopic(token: string, topic: string): Promise<boolean> {
		try {
			const response = await fetch("/api/notifications/subscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token,
					topic,
				}),
			});

			return response.ok;
		} catch (error) {
			console.error("Error subscribing to topic:", error);
			return false;
		}
	}

	async unsubscribeFromTopic(token: string, topic: string): Promise<boolean> {
		try {
			const response = await fetch("/api/notifications/unsubscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token,
					topic,
				}),
			});

			return response.ok;
		} catch (error) {
			console.error("Error unsubscribing from topic:", error);
			return false;
		}
	}

	showLocalNotification(notification: NotificationPayload): void {
		if (!("Notification" in window)) {
			console.warn("Browser does not support notifications");
			return;
		}

		if (Notification.permission === "granted") {
			new Notification(notification.title, {
				body: notification.body,
				icon: notification.icon,
				badge: notification.badge,
				data: notification.data,
				requireInteraction: true,
			});
		}
	}

	// Check if Firebase is available and initialized
	isFirebaseReady(): boolean {
		return this.isInitialized;
	}
}
