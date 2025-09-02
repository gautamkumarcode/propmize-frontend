import { useSocket } from "@/lib/socket/socketContext";
import { NotificationService } from "@/services/notificationService";
import { useAuthStore } from "@/store/app-store";
import { useEffect, useState } from "react";

/**
 * Listens for real-time notifications from backend via Socket.IO
 * and triggers NotificationService to show them in the UI.
 * @returns An object containing the listening status
 */
export const useSocketNotifications = () => {
	const { socket } = useSocket();
	const { isAuthenticated } = useAuthStore();
	const [isListening, setIsListening] = useState(false);

	useEffect(() => {
		// Only set up listeners if we have a socket connection and user is authenticated
		if (!socket || !isAuthenticated) {
			setIsListening(false);
			return;
		}

		const handleNotification = (data: {
			userId: string;
			title: string;
			message: string;
			type: string;
			actionUrl: string;
		}) => {
			NotificationService.notify({
				...data,
				type: data.type as
					| "success"
					| "error"
					| "warning"
					| "property"
					| "message"
					| undefined,
			});
		};

		socket.on("notification", handleNotification);
		setIsListening(true);

		return () => {
			socket.off("notification", handleNotification);
			setIsListening(false);
		};
	}, [socket, isAuthenticated]); // Add isAuthenticated to dependency array

	return { isListening, socket };
};
