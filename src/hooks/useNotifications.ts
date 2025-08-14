"use client";

import { NotificationService } from "@/services/notificationService";
import { useAuthStore } from "@/store/app-store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Notification } from "../components/custom/notifications/NotificationDropdown";

// Mock data - in real app, this would come from an API
const mockNotifications: Notification[] = [
	{
		id: "1",
		title: "New Property Match",
		message:
			"A new 2BHK apartment matching your preferences is now available in Koramangala.",
		type: "property",
		timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
		read: false,
		actionUrl: "/property/123",
		metadata: {
			propertyId: "123",
			propertyTitle: "Cozy 2BHK in Koramangala",
		},
	},
	{
		id: "2",
		title: "Message from Property Owner",
		message: "The owner of 'Modern 3BHK Villa' has responded to your inquiry.",
		type: "message",
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		read: false,
		actionUrl: "/chat/456",
		metadata: {
			propertyId: "456",
			propertyTitle: "Modern 3BHK Villa",
			senderName: "Rajesh Kumar",
		},
	},
	{
		id: "3",
		title: "Property Visit Confirmed",
		message: "Your property visit for tomorrow at 2 PM has been confirmed.",
		type: "success",
		timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
		read: true,
		actionUrl: "/visits",
		metadata: {
			propertyTitle: "Luxury Apartment in HSR Layout",
		},
	},
	{
		id: "4",
		title: "Price Drop Alert",
		message: "The price for 'Spacious 4BHK House' has dropped by ₹50,000!",
		type: "warning",
		timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
		read: true,
		actionUrl: "/property/789",
		metadata: {
			propertyId: "789",
			propertyTitle: "Spacious 4BHK House",
			amount: 50000,
		},
	},
	{
		id: "5",
		title: "Welcome to Propmize",
		message:
			"Thank you for joining Propmize! Complete your profile to get better property recommendations.",
		type: "system",
		timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
		read: true,
		actionUrl: "/profile",
	},
];

const sellerMockNotifications: Notification[] = [
	{
		id: "s1",
		title: "New Lead Generated",
		message: "Someone is interested in your property 'Modern 2BHK Flat'.",
		type: "property",
		timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
		read: false,
		actionUrl: "/seller/leads",
		metadata: {
			propertyId: "123",
			propertyTitle: "Modern 2BHK Flat",
		},
	},
	{
		id: "s2",
		title: "Property Views Increased",
		message: "Your property 'Luxury Villa' received 25 new views this week!",
		type: "success",
		timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
		read: false,
		actionUrl: "/seller/analytics",
		metadata: {
			propertyTitle: "Luxury Villa",
		},
	},
	{
		id: "s3",
		title: "Subscription Expiring Soon",
		message:
			"Your premium plan expires in 3 days. Renew now to continue getting premium features.",
		type: "warning",
		timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
		read: true,
		actionUrl: "/seller/plans",
	},
	{
		id: "s4",
		title: "Property Approved",
		message:
			"Your property listing 'Cozy Studio Apartment' has been approved and is now live!",
		type: "success",
		timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
		read: true,
		actionUrl: "/seller",
		metadata: {
			propertyTitle: "Cozy Studio Apartment",
		},
	},
];

export const useNotifications = () => {
	const { user, userMode } = useAuthStore();
	const router = useRouter();

	// Get notifications based on user mode
	const [notifications, setNotifications] = useState<Notification[]>(() => {
		return userMode === "seller" ? sellerMockNotifications : mockNotifications;
	});

	// Update notifications when user mode changes
	useEffect(() => {
		setNotifications(
			userMode === "seller" ? sellerMockNotifications : mockNotifications
		);
	}, [userMode]);

	// Get unread count
	const unreadCount = notifications.filter((n) => !n.read).length;

	// Mark notification as read
	const markAsRead = useCallback((id: string) => {
		setNotifications((prev) =>
			prev.map((notification) =>
				notification.id === id ? { ...notification, read: true } : notification
			)
		);
	}, []);

	// Mark all as read
	const markAllAsRead = useCallback(() => {
		setNotifications((prev) =>
			prev.map((notification) => ({ ...notification, read: true }))
		);
	}, []);

	// Delete notification
	const deleteNotification = useCallback((id: string) => {
		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== id)
		);
	}, []);

	// Handle notification click
	const handleNotificationClick = useCallback(
		(notification: Notification) => {
			// Mark as read when clicked
			if (!notification.read) {
				markAsRead(notification.id);
			}

			// Navigate to action URL if available
			if (notification.actionUrl) {
				router.push(notification.actionUrl);
			}
		},
		[markAsRead, router]
	);

	// Add new notification (for real-time notifications)
	const addNotification = useCallback(
		(notification: Omit<Notification, "id" | "timestamp">) => {
			const newNotification: Notification = {
				...notification,
				id: Date.now().toString(),
				timestamp: new Date(),
			};

			setNotifications((prev) => [newNotification, ...prev]);
		},
		[]
	);

	// Add notification from service (with different type)
	const addNotificationFromService = useCallback(
		(options: Parameters<typeof NotificationService.notify>[0]) => {
			const notification: Notification = {
				id: Date.now().toString(),
				title: options.title,
				message: options.message,
				type: options.type || "info",
				timestamp: new Date(),
				read: false,
				actionUrl: options.actionUrl,
				metadata: options.metadata,
			};

			setNotifications((prev) => [notification, ...prev]);
		},
		[]
	);

	// Register with notification service
	useEffect(() => {
		NotificationService.registerHandlers({
			add: addNotificationFromService,
			markAsRead,
			markAllAsRead,
			delete: deleteNotification,
		});
	}, [
		addNotificationFromService,
		markAsRead,
		markAllAsRead,
		deleteNotification,
	]);

	// Simulate real-time notifications (in production, this would be WebSocket/SSE)
	useEffect(() => {
		// Only simulate for development
		if (process.env.NODE_ENV === "development") {
			const interval = setInterval(() => {
				if (Math.random() < 0.1) {
					// 10% chance every 30 seconds
					const sampleNotifications =
						userMode === "seller"
							? [
									{
										title: "New Lead",
										message: "Someone inquired about your property.",
										type: "property" as const,
										read: false,
										actionUrl: "/seller/leads",
									},
							  ]
							: [
									{
										title: "New Property",
										message: "A property matching your criteria is available.",
										type: "property" as const,
										read: false,
										actionUrl: "/properties",
									},
							  ];

					const randomNotification =
						sampleNotifications[
							Math.floor(Math.random() * sampleNotifications.length)
						];

					addNotification(randomNotification);
				}
			}, 30000); // Check every 30 seconds

			return () => clearInterval(interval);
		}
	}, [userMode, addNotification]);

	return {
		notifications,
		unreadCount,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		handleNotificationClick,
		addNotification,
	};
};
