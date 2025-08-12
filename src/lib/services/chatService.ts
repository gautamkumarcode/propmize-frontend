import apiClient from "../api";
import {
	ApiResponse,
	ConversationCreateData,
	MessageCreateData,
} from "../types/api";

// Additional types for chat
export interface Message {
	id: string;
	conversationId: string;
	senderId: string;
	receiverId: string;
	content: string;
	type: "text" | "image" | "document";
	readAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface Conversation {
	_id: string;
	participants: [
		{
			_id: string;
			name: string;
			avatar: string;
		}
	];
	lastMessage?: Message;
	unreadCount: number;
	propertyId?: string;
	createdAt: Date;
	updatedAt: Date;
}

export class ChatService {
	/**
	 * Create a new conversation
	 */
	static async createConversation(
		conversationData: ConversationCreateData
	): Promise<ApiResponse<Conversation>> {
		const response = await apiClient.post(
			"/chat/conversations",
			conversationData
		);
		return response.data;
	}

	/**
	 * Get all conversations for current user
	 */
	static async getConversations(): Promise<ApiResponse<Conversation[]>> {
		const response = await apiClient.get("/chat/conversations");
		return response.data;
	}

	/**
	 * Get a specific conversation by ID
	 */
	static async getConversation(
		conversationId: string
	): Promise<ApiResponse<Conversation>> {
		const response = await apiClient.get(
			`/chat/conversations/${conversationId}`
		);
		return response.data;
	}

	/**
	 * Get messages for a conversation
	 */
	static async getMessages(
		conversationId: string,
		options: {
			page?: number;
			limit?: number;
			before?: string; // message ID
		} = {}
	): Promise<ApiResponse<Message[]>> {
		const params = new URLSearchParams();

		Object.entries(options).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(
			`/chat/conversations/${conversationId}/messages?${params.toString()}`
		);
		return response.data;
	}

	/**
	 * Send a message
	 */
	static async sendMessage(
		messageData: MessageCreateData
	): Promise<ApiResponse<Message>> {
		const response = await apiClient.post("/chat/messages", messageData);
		return response.data;
	}

	/**
	 * Send a message with file attachment
	 */
	static async sendMessageWithFile(
		conversationId: string,
		content: string,
		file: File,
		type: "image" | "document" = "document"
	): Promise<ApiResponse<Message>> {
		const formData = new FormData();
		formData.append("conversationId", conversationId);
		formData.append("content", content);
		formData.append("type", type);
		formData.append("file", file);

		const response = await apiClient.post(
			"/chat/messages/with-file",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return response.data;
	}

	/**
	 * Mark conversation as read
	 */
	static async markAsRead(conversationId: string): Promise<ApiResponse> {
		const response = await apiClient.put(
			`/chat/conversations/${conversationId}/read`
		);
		return response.data;
	}

	/**
	 * Create or get conversation between two users
	 */
	static async createOrGetConversation(
		otherUserId: string,
		propertyId?: string
	): Promise<ApiResponse<Conversation>> {
		const response = await apiClient.post("/chat/conversations", {
			participantId: otherUserId,
			propertyId,
		});
		return response.data;
	}

	/**
	 * Delete a conversation
	 */
	static async deleteConversation(
		conversationId: string
	): Promise<ApiResponse> {
		const response = await apiClient.delete(
			`/chat/conversations/${conversationId}`
		);
		return response.data;
	}

	/**
	 * Search messages in a conversation
	 */
	static async searchMessages(
		conversationId: string,
		query: string
	): Promise<ApiResponse<Message[]>> {
		const response = await apiClient.get(
			`/chat/conversations/${conversationId}/search?q=${encodeURIComponent(
				query
			)}`
		);
		return response.data;
	}

	/**
	 * Get unread message count
	 */
	static async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
		const response = await apiClient.get("/chat/unread-count");
		return response.data;
	}
}
