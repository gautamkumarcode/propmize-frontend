import { useAuth } from "@/lib/providers/AuthProvider";
import {
	AIChatContext,
	aiChatService,
	AIMessage,
} from "@/services/aiChatService";
import { APIError } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { toast } from "./use-toast";

// Enhanced interface to support guest info
interface UserInfo {
	id: string;
	type: "guest" | "user";
	isGuest: boolean;
	name?: string;
	email?: string;
}

// Custom hook for AI Chat functionality (supports both guests and authenticated users)
export const useAIChat = () => {
	const queryClient = useQueryClient();
	const { user } = useAuth();
	const [currentChatId, setCurrentChatId] = useState<string | null>(null);
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	// Determine if user is guest on mount
	useEffect(() => {
		if (user) {
			// User is authenticated
			setUserInfo({
				id: user._id,
				type: "user",
				isGuest: false,
				name: user.name,
				email: user.email,
			});
		} else {
			// User is guest - generate guest ID
			let guestId = localStorage.getItem("propmize_guest_id");
			if (!guestId) {
				const timestamp = Date.now();
				const random = Math.random().toString(36).substring(2);
				guestId = `guest_${timestamp}_${random}`;
				localStorage.setItem("propmize_guest_id", guestId);
			}
			setUserInfo({
				id: guestId,
				type: "guest",
				isGuest: true,
			});
		}
	}, [user]);

	// Start new AI chat session
	const startChatMutation = useMutation({
		mutationFn: ({
			conversationType,
			context,
		}: {
			conversationType?:
				| "property-search"
				| "general-inquiry"
				| "recommendation"
				| "support";
			context?: AIChatContext;
		}) => aiChatService.startAIChat(conversationType, context),
		onSuccess: (data) => {
			setCurrentChatId(data.data._id);
			if (data.userInfo) setUserInfo(data.userInfo);
			queryClient.invalidateQueries({ queryKey: ["ai-chats"] });
		},
		onError: (error: APIError) => {
			console.error("Failed to start chat:", error);
			// Handle rate limiting errors
			if (error?.response?.status === 429) {
				// Don't attempt to retry automatically for rate limits
				toast({
					title: "Rate limit exceeded",
					description: "Please wait before starting a new chat.",
					variant: "destructive",
				});
			} else {
				toast({
					title: "Failed to start chat",
					description: "Please try again in a moment.",
					variant: "destructive",
				});
			}
		},
		retry: false, // Disable automatic retry for chat creation
	});

	// Send message mutation
	const sendMessageMutation = useMutation({
		mutationFn: ({
			chatId,
			message,
			context,
		}: {
			chatId: string;
			message: string;
			context?: AIChatContext;
		}) => aiChatService.sendMessage(chatId, message, context),
		onSuccess: (data, variables) => {
			if (data.data?.userInfo) setUserInfo(data.data.userInfo);
			queryClient.invalidateQueries({
				queryKey: ["ai-chat", variables.chatId],
			});
		},
		onError: (error: APIError) => {
			console.error("Failed to send message:", error);
			// Handle rate limiting errors
			if (error?.response?.status === 429) {
				toast({
					title: "Rate limit exceeded",
					description: "Please wait before sending another message.",
					variant: "destructive",
				});
			} else {
				toast({
					title: "Failed to send message",
					description: "Please try again in a moment.",
					variant: "destructive",
				});
			}
		},
		retry: false, // Disable automatic retry for message sending
	});

	// Submit message feedback
	const submitFeedbackMutation = useMutation({
		mutationFn: ({
			chatId,
			messageId,
			feedback,
		}: {
			chatId: string;
			messageId: string;
			feedback: {
				rating: 1 | 2 | 3 | 4 | 5;
				helpful: boolean;
				comment?: string;
			};
		}) => aiChatService.submitMessageFeedback(chatId, messageId, feedback),
	});

	// End session mutation
	const endSessionMutation = useMutation({
		mutationFn: (chatId: string) => aiChatService.endSession(chatId),
		onSuccess: (data, chatId: string) => {
			queryClient.invalidateQueries({ queryKey: ["ai-chat", chatId] });
			queryClient.invalidateQueries({ queryKey: ["ai-chats"] });
		},
	});

	// Submit session feedback
	const submitSessionFeedbackMutation = useMutation({
		mutationFn: ({
			chatId,
			feedback,
		}: {
			chatId: string;
			feedback: {
				overallRating: 1 | 2 | 3 | 4 | 5;
				wasHelpful: boolean;
				improvementSuggestions?: string;
				completedGoal: boolean;
				goalDescription?: string;
			};
		}) => aiChatService.submitSessionFeedback(chatId, feedback),
	});

	// Update chat context
	const updateContextMutation = useMutation({
		mutationFn: ({
			chatId,
			context,
		}: {
			chatId: string;
			context: AIChatContext;
		}) => aiChatService.updateChatContext(chatId, context),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["ai-chat", variables.chatId],
			});
		},
	});

	return {
		currentChatId,
		setCurrentChatId,
		startChat: startChatMutation.mutate,
		startChatAsync: startChatMutation.mutateAsync,
		sendMessage: sendMessageMutation.mutate,
		sendMessageAsync: sendMessageMutation.mutateAsync,
		submitFeedback: submitFeedbackMutation.mutate,
		endSession: endSessionMutation.mutate,
		submitSessionFeedback: submitSessionFeedbackMutation.mutate,
		updateContext: updateContextMutation.mutate,
		isStartingChat: startChatMutation.isPending,
		isSendingMessage: sendMessageMutation.isPending,
		isEndingSession: endSessionMutation.isPending,
	};
};

// Hook to get specific AI chat
export const useAIChatData = (chatId: string | null) => {
	return useQuery({
		queryKey: ["ai-chat", chatId],
		queryFn: () => (chatId ? aiChatService.getAIChat(chatId) : null),
		enabled: !!chatId,
		staleTime: 30000, // Consider data fresh for 30 seconds
		refetchOnWindowFocus: false, // Prevent refetching on window focus
		refetchOnReconnect: false, // Prevent refetching on reconnect
		retry: (failureCount: number, error: unknown) => {
			// Don't retry rate limit errors
			if (error && typeof error === "object" && "response" in error) {
				const httpError = error as { response?: { status?: number } };
				if (httpError.response?.status === 429) return false;
			}
			return failureCount < 1;
		},
	});
};

// Hook to get user's AI chats
export const useAIChats = (
	page = 1,
	limit = 20,
	status?: "active" | "completed" | "archived"
) => {
	return useQuery({
		queryKey: ["ai-chats", page, limit, status],
		queryFn: () => aiChatService.getUserAIChats(page, limit, status),
		staleTime: 60000, // Consider data fresh for 1 minute
	});
};

// Hook to get AI chat analytics
export const useAIChatAnalytics = (chatId: string | null) => {
	return useQuery({
		queryKey: ["ai-chat-analytics", chatId],
		queryFn: () => (chatId ? aiChatService.getChatAnalytics(chatId) : null),
		enabled: !!chatId,
		staleTime: 300000, // Consider data fresh for 5 minutes
	});
};

// Hook for AI property search
export const useAIPropertySearch = () => {
	return useMutation({
		mutationFn: ({
			searchQuery,
			chatId,
		}: {
			searchQuery: {
				query: string;
				filters?: {
					minPrice?: number;
					maxPrice?: number;
					bedrooms?: number;
					bathrooms?: number;
					propertyType?: string;
					location?: string;
				};
			};
			chatId?: string;
		}) =>
			aiChatService.searchProperties(searchQuery.query, searchQuery.filters),
	});
};

// Custom hook for managing AI chat state
export const useAIChatState = (initialChatId?: string) => {
	const [chatId, setChatId] = useState(
		() => initialChatId || localStorage.getItem("ai_current_chat") || null
	);

	const [messages, setMessages] = useState<AIMessage[]>([]);
	const [isTyping, setIsTyping] = useState(false);
	const [context, setContext] = useState<AIChatContext>({});

	const { data: chatData, isLoading } = useAIChatData(chatId);
	const aiChat = useAIChat();

	useEffect(() => {
		if (chatId) {
			localStorage.setItem("ai_current_chat", chatId);
		} else {
			localStorage.removeItem("ai_current_chat");
		}
	}, [chatId]);
	
	// Update messages when chat data changes
	useEffect(() => {
		if (chatData?.data?.messages) {
			setMessages(chatData.data.messages);
		}
	}, [chatData]);

	const startNewChat = useCallback(
		async (
			conversationType:
				| "property-search"
				| "general-inquiry"
				| "recommendation"
				| "support" = "property-search",
			initialContext?: AIChatContext
		) => {
			try {
				const result = await aiChat.startChatAsync({
					conversationType,
					context: initialContext,
				});
				setChatId(result.data._id);
				setMessages(result.data.messages || []);
				// Note: AIChat interface doesn't have context property, so we'll handle this differently
				setContext(initialContext || {});
				return result.data;
			} catch (error) {
				console.error("Error starting AI chat:", error);
				throw error;
			}
		},
		[aiChat]
	);

	const sendMessage = useCallback(
		async (message: string, additionalContext?: AIChatContext) => {
			if (!chatId) return;

			try {
				setIsTyping(true);
				const result = await aiChat.sendMessageAsync({
					chatId,
					message,
					context: additionalContext,
				});

				// The messages will be updated via the query invalidation
				return result.data;
			} catch (error) {
				console.error("Error sending message:", error);
				throw error;
			} finally {
				setIsTyping(false);
			}
		},
		[chatId, aiChat]
	);

	const updateChatContext = useCallback(
		(newContext: AIChatContext) => {
			if (!chatId) return;

			setContext((prev: AIChatContext) => ({ ...prev, ...newContext }));
			aiChat.updateContext({
				chatId,
				context: newContext,
			});
		},
		[chatId, aiChat]
	);

	return {
		chatId,
		setChatId,
		messages,
		isTyping,
		context,
		isLoading,
		isSendingMessage: aiChat.isSendingMessage,
		startNewChat,
		sendMessage,
		updateChatContext,
		submitFeedback: aiChat.submitFeedback,
		endSession: aiChat.endSession,
	};
};
