"use client";

import { NotificationService } from "@/lib/services/notificationService";
import { useAuthStore } from "@/store/app-store";
import { NotificationTpes } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSocketNotifications } from "./useSocketNotifications";

export const useNotifications = () => {
	const { user, userMode } = useAuthStore();
	const router = useRouter();
	const [notifications, setNotifications] = useState<NotificationTpes[]>([]);
	const [loading, setLoading] = useState(true);

	// Create stable callback functions using useCallback
	const handleAddNotification = useCallback(
		(notification: NotificationTpes) => {
			setNotifications((prev) => [notification, ...prev]);
		},
		[]
	);

	const handleReadNotification = useCallback((id: string) => {
		setNotifications((prev) =>
			prev.map((n) => (n._id === id ? { ...n, read: true } : n))
		);
	}, []);

	const handleDeleteNotification = useCallback((id: string) => {
		setNotifications((prev) => prev.filter((n) => n._id !== id));
	}, []);

	// Memoize the handlers object to prevent unnecessary re-renders
	const socketHandlers = useMemo(
		() => ({
			onAdd: handleAddNotification,
			onRead: handleReadNotification,
			onDelete: handleDeleteNotification,
		}),
		[handleAddNotification, handleReadNotification, handleDeleteNotification]
	);

	const { isListening } = useSocketNotifications(socketHandlers);

	// Fetch notifications from backend on mount/user change
	useEffect(() => {
		let isMounted = true;
		setLoading(true);
		const fetchNotifications = async () => {
			try {
				const res = await NotificationService.getNotifications();
				const { data, success } = res;
				if (isMounted && success) {
					setNotifications(data);
				}
			} catch (error) {
				console.error("Failed to fetch notifications:", error);
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};
		if (user?._id) {
			fetchNotifications();
		}
		return () => {
			isMounted = false;
		};
	}, [user?._id, userMode]);

	// Request browser notification permission on mount
	useEffect(() => {
		if (typeof window !== "undefined" && "Notification" in window) {
			if (Notification.permission === "default") {
				Notification.requestPermission();
			}
		}
	}, []);

	// Get unread count
	const unreadCount = notifications.filter((n) => !n.read).length;

	// Mark notification as read
	const markAsRead = useCallback(async (id: string) => {
		try {
			await NotificationService.markAsRead(id);
			setNotifications((prev) =>
				prev.map((n) => (n._id === id ? { ...n, read: true } : n))
			);
		} catch (error) {
			console.error("Failed to mark as read:", error);
		}
	}, []);

	// Mark all as read
	const markAllAsRead = useCallback(async () => {
		try {
			await NotificationService.markAllAsRead();
			setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
		} catch (error) {
			console.error("Failed to mark all as read:", error);
		}
	}, []);

	// Delete notification
	const deleteNotification = useCallback(async (id: string) => {
		try {
			await NotificationService.deleteNotification(id);
			setNotifications((prev) => prev.filter((n) => n._id !== id));
		} catch (error) {
			console.error("Failed to delete notification:", error);
		}
	}, []);

	// Handle notification click
	const handleNotificationClick = useCallback(
		async (notification: NotificationTpes) => {
			try {
				if (!notification.read) {
					await markAsRead(notification._id);
				}
				const actionUrl =
					notification?.actionUrl || notification.metadata?.actionUrl;
				if (typeof actionUrl === "string" && actionUrl.length > 0) {
					router.push(actionUrl);
				}
			} catch (error) {
				console.error("Failed to handle notification click:", error);
			}
		},
		[]
	);

	// Add notification manually (for local/manual notifications)
	const addNotification = useCallback(
		(
			notification: Omit<NotificationTpes, "_id" | "createdAt" | "updatedAt">
		) => {
			const newNotification: NotificationTpes = {
				...notification,
				_id: Date.now().toString(),
				userId: user?.id || "",
				createdAt: new Date(),
				updatedAt: new Date(),
				read: false,
			};
			setNotifications((prev) => [newNotification, ...prev]);
		},
		[user?.id]
	);

	return {
		notifications,
		unreadCount,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		handleNotificationClick,
		addNotification,
		loading,
		isListening,
	};
};