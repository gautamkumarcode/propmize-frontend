import { useSocket } from "@/lib/socket/socketContext";
import { useAuthStore } from "@/store/app-store";
import { NotificationTpes } from "@/types";
import { useEffect, useMemo, useState } from "react";

type NotificationSocketHandlers = {
	onAdd?: (notification: NotificationTpes) => void;
	onRead?: (id: string) => void;
	onDelete?: (id: string) => void;
};

export const useSocketNotifications = (
	handlers: NotificationSocketHandlers = {}
) => {
	const { socket, joinRoom } = useSocket();
	const { user, isAuthenticated } = useAuthStore();
	const [isListening, setIsListening] = useState(false);

	// Memoize handlers to prevent unnecessary re-renders
	const stableHandlers = useMemo(
		() => handlers,
		[handlers.onAdd, handlers.onRead, handlers.onDelete]
	);

	useEffect(() => {
		if (!socket || !isAuthenticated || !user?._id) {
			setIsListening(false);
			return;
		}

		// Join the user's room for notifications only after socket connects

		// Setup event listeners
		const setupListeners = () => {
			if (stableHandlers.onAdd) {
				socket.on("notification", stableHandlers.onAdd);
			}
			if (stableHandlers.onRead) {
				socket.on("notification:read", stableHandlers.onRead);
			}
			if (stableHandlers.onDelete) {
				socket.on("notification:delete", stableHandlers.onDelete);
			}
		};

		// If socket is already connected, join room and setup listeners immediately
		if (socket.connected) {
			socket.emit("join", user._id);
			setupListeners();
			setIsListening(true);
		}

		// Setup listeners and join room when socket connects
		socket.on("connect", () => {
			socket.emit("join", user._id);
			setupListeners();
			setIsListening(true);
		});

		socket.on("disconnect", () => {
			setIsListening(false);
		});

		return () => {
			if (!socket) return;
			// Remove all listeners
			if (stableHandlers.onAdd) {
				socket.off("notification", stableHandlers.onAdd);
			}
			if (stableHandlers.onRead) {
				socket.off("notification:read", stableHandlers.onRead);
			}
			if (stableHandlers.onDelete) {
				socket.off("notification:delete", stableHandlers.onDelete);
			}

			// Remove connection listeners
			socket.off("connect");
			socket.off("disconnect");

			setIsListening(false);
		};
	}, [socket, isAuthenticated, user?._id, stableHandlers, joinRoom]);

	return { isListening, socket };
};
