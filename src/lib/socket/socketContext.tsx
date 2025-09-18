"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { safeLocalStorage } from "../utils/storage";

interface SocketContextType {
	socket: Socket | null;
	isConnected: boolean;
	joinRoom: (userId: string) => void;
	leaveRoom: (userId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
	socket: null,
	isConnected: false,
	joinRoom: () => {},
	leaveRoom: () => {},
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

	// Function to join a user's room
	const joinRoom = (userId: string) => {
		if (socket && isConnected) {
			socket.emit("join", userId);
			console.log(`Joined room for user: ${userId}`);
		}
	};

	// Function to leave a user's room
	const leaveRoom = (userId: string) => {
		if (socket && isConnected) {
			socket.emit("leave", userId);
			console.log(`Left room for user: ${userId}`);
		}
	};

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
				setIsConnected(true);
			});

			newSocket.on("disconnect", () => {
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
		<SocketContext.Provider
			value={{ socket, isConnected, joinRoom, leaveRoom }}>
			{children}
		</SocketContext.Provider>
	);
};
