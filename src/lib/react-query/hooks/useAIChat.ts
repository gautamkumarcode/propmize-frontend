import { useSocket } from "@/lib/socket/socketContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import {
	AIChatService,
	AIMessage,
	AISearchQuery,
	handleAISocketEvents,
} from "../../../services/aiChatService";

// Query keys
const AI_CHAT_KEYS = {
	all: ["ai-chat"] as const,
	chats: () => [...AI_CHAT_KEYS.all, "chats"] as const,
	chat: (id: string) => [...AI_CHAT_KEYS.all, "chat", id] as const,
	messages: (chatId: string) =>
		[...AI_CHAT_KEYS.all, "messages", chatId] as const,
	search: () => [...AI_CHAT_KEYS.all, "search"] as const,
};

// Hook to start or get AI chat session
export const useStartAIChat = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: AIChatService.startAIChat,
		onSuccess: (data) => {
			// Cache the chat data
			queryClient.setQueryData(AI_CHAT_KEYS.chat(data.data._id), data.data);
		},
		onError: (error: any) => {
			console.error("Failed to start AI chat:", error);
		},
	});
};

// Hook to send message to AI
export const useSendAIMessage = () => {
	const queryClient = useQueryClient();
	const { socket } = useSocket();

	return useMutation({
		mutationFn: ({ chatId, message }: { chatId: string; message: string }) =>
			AIChatService.sendMessage(chatId, message),
		onMutate: async ({ chatId, message }) => {
			// Cancel outgoing queries
			await queryClient.cancelQueries({
				queryKey: AI_CHAT_KEYS.messages(chatId),
			});

			// Optimistically add user message
			const userMessage: AIMessage = {
				sender: "user",
				content: message,
				messageType: "text",
				readBy: [],
				createdAt: new Date().toISOString(),
			};

			queryClient.setQueryData(AI_CHAT_KEYS.messages(chatId), (old: any) => {
				if (!old) return { data: { messages: [userMessage] } };
				return {
					...old,
					data: {
						...old.data,
						messages: [...old.data.messages, userMessage],
					},
				};
			});

			// Emit socket event for real-time updates
			if (socket) {
				socket.emit("sendAIMessage", {
					chatId,
					message,
					userId: "current-user", // You should get this from auth context
				});
			}
		},
		onSuccess: (data, { chatId }) => {
			// Update chat messages with AI response
			queryClient.setQueryData(AI_CHAT_KEYS.messages(chatId), (old: any) => {
				if (!old) return { data: { messages: data.data.messages } };
				return {
					...old,
					data: {
						...old.data,
						messages: [
							...old.data.messages.slice(0, -2),
							...data.data.messages,
						],
					},
				};
			});

			// Update chat data
			queryClient.setQueryData(AI_CHAT_KEYS.chat(chatId), data.data.chat);
		},
		onError: (error: any, { chatId }) => {
			console.error("Failed to send AI message:", error);
			// Revert optimistic update
			queryClient.invalidateQueries({
				queryKey: AI_CHAT_KEYS.messages(chatId),
			});
		},
	});
};

// Hook to get AI chat messages
export const useAIChatMessages = (chatId: string | null, enabled = true) => {
	return useQuery({
		queryKey: AI_CHAT_KEYS.messages(chatId || ""),
		queryFn: () => AIChatService.getChatHistory(chatId!),
		enabled: enabled && !!chatId,
		staleTime: 30000, // 30 seconds
		select: (data) => data.data.messages,
	});
};

// Hook for AI property search
export const useAIPropertySearch = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (searchQuery: AISearchQuery) =>
			AIChatService.searchProperties(searchQuery),
		onSuccess: (data) => {
			// Cache search results
			queryClient.setQueryData(AI_CHAT_KEYS.search(), data.data);
		},
		onError: (error: any) => {
			console.error("AI property search failed:", error);
		},
	});
};

// Hook to get user's AI chat sessions
export const useAIChats = () => {
	return useQuery({
		queryKey: AI_CHAT_KEYS.chats(),
		queryFn: AIChatService.getUserAIChats,
		select: (data) => data.data,
		staleTime: 60000, // 1 minute
	});
};

// Custom hook for real-time AI chat functionality
export const useAIChatRealtime = (chatId: string | null) => {
	const { socket } = useSocket();
	const queryClient = useQueryClient();
	const [isAITyping, setIsAITyping] = useState(false);
	const [searchProgress, setSearchProgress] = useState<string | null>(null);

	const joinAIChat = useCallback(() => {
		if (socket && chatId) {
			socket.emit("joinAIChat", {
				chatId,
				userId: "current-user", // Get from auth context
			});
		}
	}, [socket, chatId]);

	const leaveAIChat = useCallback(() => {
		if (socket && chatId) {
			socket.emit("leaveAIChat", {
				chatId,
				userId: "current-user", // Get from auth context
			});
		}
	}, [socket, chatId]);

	const sendTypingIndicator = useCallback(
		(isTyping: boolean) => {
			if (socket && chatId) {
				socket.emit("aiChatTyping", {
					chatId,
					userId: "current-user", // Get from auth context
					isTyping,
				});
			}
		},
		[socket, chatId]
	);

	useEffect(() => {
		if (!socket || !chatId) return;

		// Join AI chat room
		joinAIChat();

		// Set up socket event handlers
		const cleanup = handleAISocketEvents(socket, {
			onMessageReceived: (message) => {
				// Update messages in cache
				queryClient.setQueryData(AI_CHAT_KEYS.messages(chatId), (old: any) => {
					if (!old) return { data: { messages: [message] } };
					return {
						...old,
						data: {
							...old.data,
							messages: [...old.data.messages, message],
						},
					};
				});
				setIsAITyping(false);
			},
			onTypingStart: () => setIsAITyping(true),
			onTypingStop: () => setIsAITyping(false),
			onSearchProgress: (progress) => setSearchProgress(progress.message),
		});

		// Cleanup on unmount
		return () => {
			cleanup?.();
			leaveAIChat();
		};
	}, [socket, chatId, joinAIChat, leaveAIChat, queryClient]);

	return {
		isAITyping,
		searchProgress,
		sendTypingIndicator,
		joinAIChat,
		leaveAIChat,
	};
};
