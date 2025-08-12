import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ChatService, Conversation, Message } from "../../services/chatService";
import { useSocket } from "../../socket/mockSocketContext";

// Query Keys
export const chatKeys = {
	all: ["chat"] as const,
	conversations: () => [...chatKeys.all, "conversations"] as const,
	conversation: (id: string) => [...chatKeys.all, "conversation", id] as const,
	messages: (conversationId: string) =>
		[...chatKeys.all, "messages", conversationId] as const,
};

// Hooks for Chat functionality
export function useConversations() {
	return useQuery({
		queryKey: chatKeys.conversations(),
		queryFn: ChatService.getConversations,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
}

export function useConversation(conversationId: string) {
	return useQuery({
		queryKey: chatKeys.conversation(conversationId),
		queryFn: () => ChatService.getConversation(conversationId),
		enabled: !!conversationId,
	});
}

export function useMessages(conversationId: string, page = 1) {
	return useQuery({
		queryKey: [...chatKeys.messages(conversationId), page],
		queryFn: () => ChatService.getMessages(conversationId, { page, limit: 50 }),
		enabled: !!conversationId,
		staleTime: 1000 * 60 * 2, // 2 minutes
	});
}

// Real-time hooks with Socket.IO
export function useRealTimeMessages(conversationId: string) {
	const { socket } = useSocket();
	const queryClient = useQueryClient();
	const [newMessage, setNewMessage] = useState<Message | null>(null);

	useEffect(() => {
		if (!socket || !conversationId) return;

		// Join conversation room
		socket.emit("join-conversation", conversationId);

		// Listen for new messages
		const handleNewMessage = (message: Message) => {
			setNewMessage(message);

			// Update messages in cache
			queryClient.setQueryData(
				chatKeys.messages(conversationId),
				(old: any) => {
					if (!old) return old;
					return {
						...old,
						data: {
							...old.data,
							messages: [message, ...old.data.messages],
						},
					};
				}
			);

			// Update conversation with last message
			queryClient.setQueryData(chatKeys.conversations(), (old: any) => {
				if (!old) return old;
				return {
					...old,
					data: old.data.map((conv: Conversation) =>
						conv._id === conversationId
							? { ...conv, lastMessage: message }
							: conv
					),
				};
			});
		};

		// Listen for message read status
		const handleMessageRead = ({
			messageId,
			readAt,
		}: {
			messageId: string;
			readAt: string;
		}) => {
			queryClient.setQueryData(
				chatKeys.messages(conversationId),
				(old: any) => {
					if (!old) return old;
					return {
						...old,
						data: {
							...old.data,
							messages: old.data.messages.map((msg: Message) =>
								msg.id === messageId
									? { ...msg, readAt: new Date(readAt) }
									: msg
							),
						},
					};
				}
			);
		};

		socket.on("new-message", handleNewMessage);
		socket.on("message-read", handleMessageRead);

		return () => {
			socket.emit("leave-conversation", conversationId);
			socket.off("new-message", handleNewMessage);
			socket.off("message-read", handleMessageRead);
		};
	}, [socket, conversationId, queryClient]);

	return { newMessage };
}

// Mutation hooks
export function useSendMessage() {
	const queryClient = useQueryClient();
	const { socket } = useSocket();

	return useMutation({
		mutationFn: ChatService.sendMessage,
		onMutate: async (newMessage) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({
				queryKey: chatKeys.messages(newMessage.conversationId),
			});

			// Snapshot previous value
			const previousMessages = queryClient.getQueryData(
				chatKeys.messages(newMessage.conversationId)
			);

			// Optimistically update
			const optimisticMessage: Message = {
				id: `temp-${Date.now()}`,
				conversationId: newMessage.conversationId,
				senderId: "current-user", // This should be from auth context
				receiverId: newMessage.receiverId,
				content: newMessage.content,
				type: newMessage.type || "text",
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			queryClient.setQueryData(
				chatKeys.messages(newMessage.conversationId),
				(old: any) => {
					if (!old) return old;
					return {
						...old,
						data: {
							...old.data,
							messages: [optimisticMessage, ...old.data.messages],
						},
					};
				}
			);

			return { previousMessages };
		},
		onError: (err, newMessage, context) => {
			// Rollback on error
			if (context?.previousMessages) {
				queryClient.setQueryData(
					chatKeys.messages(newMessage.conversationId),
					context.previousMessages
				);
			}
		},
		onSuccess: (data, variables) => {
			// Emit real-time event
			if (socket) {
				socket.emit("send-message", {
					conversationId: variables.conversationId,
					message: data.data,
				});
			}

			// Refetch conversations to update last message
			queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
		},
	});
}

export function useMarkAsRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ChatService.markAsRead,
		onSuccess: (data, messageId) => {
			// Update all related queries
			queryClient.invalidateQueries({ queryKey: chatKeys.all });
		},
	});
}

export function useCreateConversation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ChatService.createConversation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
		},
	});
}
