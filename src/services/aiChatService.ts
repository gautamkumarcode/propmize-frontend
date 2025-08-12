import apiClient from "@/lib/api";
import { ChatMessage, PropertySuggestion } from "./aiService";

export interface AIChat {
	_id: string;
	participants: string[];
	type: "ai";
	title: string;
	isActive: boolean;
	messages: AIMessage[];
	createdAt: string;
	updatedAt: string;
}

export interface AIMessage {
	_id?: string;
	sender: string;
	content: string;
	messageType: "text" | "ai-response";
	suggestions?: string[];
	properties?: PropertySuggestion[];
	readBy: string[];
	createdAt: string;
}

export interface AISearchQuery {
	query: string;
	filters?: {
		minPrice?: number;
		maxPrice?: number;
		bedrooms?: number;
		bathrooms?: number;
		propertyType?: string;
		location?: string;
	};
}

export interface AISearchResponse {
	properties: any[];
	aiResponse: string;
	suggestions: string[];
	totalResults: number;
}

export class AIChatService {
	/**
	 * Start or get existing AI chat session
	 */
	static async startAIChat(): Promise<{ success: boolean; data: AIChat }> {
		const response = await apiClient.post("/ai/chat");
		return response.data;
	}

	/**
	 * Send message to AI assistant
	 */
	static async sendMessage(
		chatId: string,
		message: string
	): Promise<{
		success: boolean;
		data: { messages: AIMessage[]; chat: AIChat };
	}> {
		const response = await apiClient.post(`/ai/chat/${chatId}/message`, {
			content: message,
		});
		return response.data;
	}

	/**
	 * Get AI chat history
	 */
	static async getChatHistory(
		chatId: string,
		page = 1,
		limit = 50
	): Promise<{
		success: boolean;
		data: {
			messages: AIMessage[];
			pagination: {
				page: number;
				limit: number;
				total: number;
				pages: number;
			};
		};
	}> {
		const response = await apiClient.get(
			`/ai/chat/${chatId}/messages?page=${page}&limit=${limit}`
		);
		return response.data;
	}

	/**
	 * Search properties with AI assistance
	 */
	static async searchProperties(
		searchQuery: AISearchQuery
	): Promise<{ success: boolean; data: AISearchResponse }> {
		const response = await apiClient.post("/ai/search", searchQuery);
		return response.data;
	}

	/**
	 * Get user's AI chat sessions
	 */
	static async getUserAIChats(): Promise<{ success: boolean; data: AIChat[] }> {
		const response = await apiClient.get("/chat?type=ai");
		return response.data;
	}
}

// Utility functions for message formatting
export const formatAIMessage = (message: AIMessage): ChatMessage => {
	return {
		id: message._id || Math.random().toString(),
		content: message.content,
		sender: message.sender === "ai-assistant" ? "ai" : "user",
		timestamp: new Date(message.createdAt),
		...(message.suggestions && { suggestions: message.suggestions }),
		...(message.properties && {
			propertyInfo: message.properties.map((prop: any) => ({
				id: prop.id || prop._id,
				title: prop.title,
				price: formatPrice(prop.price),
				location:
					typeof prop.location === "object"
						? prop.location?.city ||
						  prop.location?.area ||
						  "Location not specified"
						: prop.location || "Location not specified",
				type: prop.type,
				size: prop.area || "Area not specified",
				image: prop.images?.[0] || prop.image || "/api/placeholder/300/200",
			})),
		}),
	};
};

export const formatPrice = (price: number): string => {
	if (price >= 10000000) {
		return `₹${(price / 10000000).toFixed(1)} Cr`;
	} else if (price >= 100000) {
		return `₹${(price / 100000).toFixed(1)} Lakh`;
	} else {
		return `₹${price.toLocaleString()}`;
	}
};

// Real-time socket event handlers
export const handleAISocketEvents = (
	socket: any,
	callbacks: {
		onMessageReceived?: (message: AIMessage) => void;
		onTypingStart?: () => void;
		onTypingStop?: () => void;
		onSearchProgress?: (progress: any) => void;
	}
) => {
	if (!socket) return;

	// Listen for AI responses
	socket.on("aiMessageResponse", (data: any) => {
		if (callbacks.onMessageReceived) {
			callbacks.onMessageReceived(data.message);
		}
	});

	// Listen for typing indicators
	socket.on("aiChatTyping", (data: any) => {
		if (data.isTyping && callbacks.onTypingStart) {
			callbacks.onTypingStart();
		} else if (!data.isTyping && callbacks.onTypingStop) {
			callbacks.onTypingStop();
		}
	});

	// Listen for search progress
	socket.on("searchProgress", (data: any) => {
		if (callbacks.onSearchProgress) {
			callbacks.onSearchProgress(data);
		}
	});

	return () => {
		socket.off("aiMessageResponse");
		socket.off("aiChatTyping");
		socket.off("searchProgress");
	};
};
