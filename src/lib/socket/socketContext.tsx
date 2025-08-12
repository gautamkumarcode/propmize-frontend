"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { safeLocalStorage } from "../utils/storage";

interface SocketContextType {
	socket: Socket | null;
	isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
	socket: null,
	isConnected: false,
});

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return context;
};

interface SocketProviderProps {
	children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const token = safeLocalStorage.getItem("accessToken");

		if (token) {
			const newSocket = io(
				process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001",
				{
					auth: {
						token,
					},
					transports: ["websocket", "polling"],
				}
			);

			newSocket.on("connect", () => {
				console.log("Socket connected:", newSocket.id);
				setIsConnected(true);
			});

			newSocket.on("disconnect", () => {
				console.log("Socket disconnected");
				setIsConnected(false);
			});

			newSocket.on("connect_error", (error) => {
				console.error("Socket connection error:", error);
				setIsConnected(false);
			});

			setSocket(newSocket);

			return () => {
				newSocket.disconnect();
				setSocket(null);
				setIsConnected(false);
			};
		}
	}, []);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>
			{children}
		</SocketContext.Provider>
	);
};
