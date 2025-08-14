import apiClient from "@/lib/api";
import { ChatMessage, PropertySuggestion } from "./aiService";

// Updated interfaces to match the new AI Chat model
export interface AIChat {
	_id: string;
	user: string;
	sessionId: string;
	title: string;
	context: {
		propertySearch?: {
			location?: string;
			priceRange?: { min: number; max: number };
			propertyType?: string;
			bedrooms?: number;
			bathrooms?: number;
			amenities?: string[];
		};
		conversationType: "property-search" | "general-inquiry" | "recommendation" | "support";
		userPreferences?: {
			budget?: number;
			preferredLocations?: string[];
			propertyTypes?: string[];
			mustHaveAmenities?: string[];
		};
	};
	messages: AIMessage[];
	status: "active" | "completed" | "archived";
	aiSessionData: {
		totalTokensUsed: number;
		averageResponseTime: number;
		totalQueries: number;
		successfulResponses: number;
		lastModelUsed: string;
		conversationSummary?: string;
		keyTopics?: string[];
		userSatisfactionScore?: number;
	};
	relatedProperties: string[];
	analytics: {
		messageCount: number;
		avgMessageLength: number;
		sessionDuration?: number;
		conversionEvents: Array<{
			type: "property-viewed" | "inquiry-sent" | "viewing-scheduled" | "contact-made";
			timestamp: string;
			data?: any;
		}>;
	};
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface AIChatSession {
	_id: string;
	sessionId: string;
	user: string;
	startTime: string;
	endTime?: string;
	totalDuration?: number;
	messageCount: number;
	aiChats: string[];
	sessionType: "single-query" | "conversation" | "property-exploration" | "guided-search";
	outcome?: {
		successful: boolean;
		goalAchieved: boolean;
		goalType?: string;
		finalAction?: string;
		propertiesViewed: number;
		inquiriesGenerated: number;
	};
	createdAt: string;
	updatedAt: string;
}

export interface AIMessage {
	_id?: string;
	role: "user" | "assistant" | "system";
	content: string;
	timestamp: string;
	aiMetadata?: {
		model: string;
		tokensUsed: number;
		responseTime: number;
		confidence: number;
		sources?: string[];
	};
	properties?: PropertySuggestion[];
	suggestions?: string[];
	actions?: Array<{
		type: "schedule-viewing" | "request-info" | "save-property" | "contact-agent";
		data: any;
	}>;
	feedback?: {
		rating: 1 | 2 | 3 | 4 | 5;
		helpful: boolean;
		comment?: string;
	};
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
	static async startAIChat(
		conversationType: "property-search" | "general-inquiry" | "recommendation" | "support" = "property-search",
		context?: {
			propertySearch?: any;
			userPreferences?: any;
		}
	): Promise<{ success: boolean; data: AIChat }> {
		const response = await apiClient.post("/ai/v2/chat", {
			conversationType,
			context
		});
		return response.data;
	}

	/**
	 * Send message to AI assistant
	 */
	static async sendMessage(
		chatId: string,
		message: string,
		context?: any
	): Promise<{
		success: boolean;
		data: { message: AIMessage; chat: AIChat };
	}> {
		const response = await apiClient.post(`/ai/v2/chat/${chatId}/message`, {
			content: message,
			context
		});
		return response.data;
	}

	/**
	 * Get AI chat by ID
	 */
	static async getAIChat(chatId: string): Promise<{ success: boolean; data: AIChat }> {
		const response = await apiClient.get(`/ai/v2/chat/${chatId}`);
		return response.data;
	}

	/**
	 * Get user's AI chat sessions
	 */
	static async getUserAIChats(
		page = 1,
		limit = 20,
		status?: "active" | "completed" | "archived"
	): Promise<{ 
		success: boolean; 
		data: {
			chats: AIChat[];
			pagination: {
				page: number;
				limit: number;
				total: number;
				pages: number;
			};
		};
	}> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			...(status && { status })
		});
		
		const response = await apiClient.get(`/ai/v2/chats?${params}`);
		return response.data;
	}

	/**
	 * Update AI chat context (search preferences, etc.)
	 */
	static async updateChatContext(
		chatId: string,
		context: Partial<AIChat['context']>
	): Promise<{ success: boolean; data: AIChat }> {
		const response = await apiClient.patch(`/ai/v2/chat/${chatId}/context`, { context });
		return response.data;
	}

	/**
	 * End AI chat session
	 */
	static async endSession(chatId: string): Promise<{ success: boolean; data: AIChat }> {
		const response = await apiClient.patch(`/ai/v2/chat/${chatId}/end`);
		return response.data;
	}

	/**
	 * Submit feedback for AI message
	 */
	static async submitMessageFeedback(
		chatId: string,
		messageId: string,
		feedback: {
			rating: 1 | 2 | 3 | 4 | 5;
			helpful: boolean;
			comment?: string;
		}
	): Promise<{ success: boolean }> {
		const response = await apiClient.post(
			`/ai/v2/chat/${chatId}/message/${messageId}/feedback`,
			feedback
		);
		return response.data;
	}

	/**
	 * Submit overall session feedback
	 */
	static async submitSessionFeedback(
		chatId: string,
		feedback: {
			overallRating: 1 | 2 | 3 | 4 | 5;
			wasHelpful: boolean;
			improvementSuggestions?: string;
			completedGoal: boolean;
			goalDescription?: string;
		}
	): Promise<{ success: boolean }> {
		const response = await apiClient.post(`/ai/v2/chat/${chatId}/feedback`, feedback);
		return response.data;
	}

	/**
	 * Get AI chat analytics
	 */
	static async getChatAnalytics(chatId: string): Promise<{ 
		success: boolean; 
		data: {
			sessionMetrics: any;
			analytics: AIChat['analytics'];
		};
	}> {
		const response = await apiClient.get(`/ai/v2/chat/${chatId}/analytics`);
		return response.data;
	}

	/**
	 * Search properties with AI assistance
	 */
	static async searchProperties(
		searchQuery: AISearchQuery,
		chatId?: string
	): Promise<{ success: boolean; data: AISearchResponse }> {
		const response = await apiClient.post("/ai/search", {
			...searchQuery,
			...(chatId && { chatId })
		});
		return response.data;
	}
}

// Utility functions for message formatting
export const formatAIMessage = (message: AIMessage): ChatMessage => {
	return {
		id: message._id || Math.random().toString(),
		content: message.content,
		sender: message.role === "assistant" ? "ai" : "user",
		timestamp: new Date(message.timestamp),
		...(message.suggestions && { suggestions: message.suggestions }),
		...(message.properties && {
			propertyInfo: message.properties.map((prop: any) => ({
				id: prop.id || prop._id || "unknown",
				title: prop.title || "Property Title Not Available",
				price: formatPrice(prop.price),
				location:
					typeof prop.location === "object"
						? prop.location?.city ||
						  prop.location?.area ||
						  "Location not specified"
						: prop.location || "Location not specified",
				type: prop.type || "Type not specified",
				size: prop.area || prop.size || "Area not specified",
				image: prop.images?.[0] || prop.image || "/api/placeholder/300/200",
			})),
		}),
		...(message.actions && { actions: message.actions }),
		...(message.aiMetadata && { 
			aiMetadata: {
				model: message.aiMetadata.model,
				tokensUsed: message.aiMetadata.tokensUsed,
				responseTime: message.aiMetadata.responseTime,
				confidence: message.aiMetadata.confidence
			}
		}),
	};
};

export const formatPrice = (price: number | undefined | null): string => {
	// Handle undefined, null, or invalid price values
	if (price == null || isNaN(price) || price < 0) {
		return "Price not available";
	}
	
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
