import { useAuth } from "@/lib/providers/AuthProvider";
import { AIChatService, AIMessage } from "@/services/aiChatService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

// Custom hook for AI Chat functionality
export const useAIChat = () => {
	const queryClient = useQueryClient();
	const { user } = useAuth();
	const [currentChatId, setCurrentChatId] = useState<string | null>(null);

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
			context?: any;
		}) => AIChatService.startAIChat(conversationType, context),
		onSuccess: (data) => {
			setCurrentChatId(data.data._id);
			queryClient.invalidateQueries({ queryKey: ["ai-chats"] });
		},
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
			context?: any;
		}) => AIChatService.sendMessage(chatId, message, context),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["ai-chat", variables.chatId],
			});
		},
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
		}) => AIChatService.submitMessageFeedback(chatId, messageId, feedback),
	});

	// End session mutation
	const endSessionMutation = useMutation({
		mutationFn: (chatId: string) => AIChatService.endSession(chatId),
		onSuccess: (data, chatId) => {
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
		}) => AIChatService.submitSessionFeedback(chatId, feedback),
	});

	// Update chat context
	const updateContextMutation = useMutation({
		mutationFn: ({ chatId, context }: { chatId: string; context: any }) =>
			AIChatService.updateChatContext(chatId, context),
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
		queryFn: () => (chatId ? AIChatService.getAIChat(chatId) : null),
		enabled: !!chatId,
		staleTime: 30000, // Consider data fresh for 30 seconds
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
		queryFn: () => AIChatService.getUserAIChats(page, limit, status),
		staleTime: 60000, // Consider data fresh for 1 minute
	});
};

// Hook to get AI chat analytics
export const useAIChatAnalytics = (chatId: string | null) => {
	return useQuery({
		queryKey: ["ai-chat-analytics", chatId],
		queryFn: () => (chatId ? AIChatService.getChatAnalytics(chatId) : null),
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
		}) => AIChatService.searchProperties(searchQuery, chatId),
	});
};

// Custom hook for managing AI chat state
export const useAIChatState = (initialChatId?: string) => {
	const [chatId, setChatId] = useState<string | null>(initialChatId || null);
	const [messages, setMessages] = useState<AIMessage[]>([]);
	const [isTyping, setIsTyping] = useState(false);
	const [context, setContext] = useState<any>({});

	const { data: chatData, isLoading } = useAIChatData(chatId);
	const aiChat = useAIChat();

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
			initialContext?: any
		) => {
			try {
				const result = await aiChat.startChatAsync({
					conversationType,
					context: initialContext,
				});
				setChatId(result.data._id);
				setMessages(result.data.messages || []);
				setContext(result.data.context);
				return result.data;
			} catch (error) {
				console.error("Error starting AI chat:", error);
				throw error;
			}
		},
		[aiChat]
	);

	const sendMessage = useCallback(
		async (message: string, additionalContext?: any) => {
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
		(newContext: any) => {
			if (!chatId) return;

			setContext((prev: any) => ({ ...prev, ...newContext }));
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
		chatData: chatData?.data,
		isLoading: isLoading || aiChat.isStartingChat,
		isSendingMessage: aiChat.isSendingMessage,
		startNewChat,
		sendMessage,
		updateContext: updateChatContext,
		endSession: () => chatId && aiChat.endSession(chatId),
		submitFeedback: (messageId: string, feedback: any) =>
			chatId && aiChat.submitFeedback({ chatId, messageId, feedback }),
		submitSessionFeedback: (feedback: any) =>
			chatId && aiChat.submitSessionFeedback({ chatId, feedback }),
	};
};
