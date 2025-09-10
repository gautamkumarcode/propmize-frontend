import apiClient from "@/lib/api";
import { ChatMessage, PropertySuggestion } from "./aiService";

interface SessionMetrics {
	messageCount: number;
	averageResponseTime: number;
	sessionDuration: number;
	userSatisfactionRating?: number;
	propertiesShown: number;
	actionsPerformed: number;
}

interface ChatAnalytics {
	totalSessions: number;
	averageSessionDuration: number;
	commonQueries: string[];
	conversionRate: number;
	popularPropertyTypes: string[];
	userEngagementScore: number;
}

interface SocketEventData {
	chatId: string;
	message?: string;
	isTyping?: boolean;
	progress?: number;
	status?: string;
}

// interface PropertyData {
// 	_id: string;
// 	title: string;
// 	location: string;
// 	price: number;
// 	propertyType: string;
// 	bedrooms?: number;
// 	bathrooms?: number;
// 	area?: number;
// 	images?: string[];
// 	description?: string;
// }

// Request deduplication and debouncing
const pendingRequests = new Map<string, Promise<unknown>>();
const lastRequestTime = new Map<string, number>();
const DEBOUNCE_DELAY = 2000; // Increased to 2 seconds debounce for better rate limiting

// Helper function to create a debounced request
const debouncedRequest = async <T>(
	key: string,
	requestFn: () => Promise<T>,
	immediate = false
): Promise<T> => {
	const now = Date.now();
	const lastTime = lastRequestTime.get(key) || 0;

	// If there's a pending request with the same key, return it
	if (pendingRequests.has(key)) {
		return pendingRequests.get(key) as Promise<T>;
	}

	// If not immediate and within debounce window, wait
	if (!immediate && now - lastTime < DEBOUNCE_DELAY) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				debouncedRequest(key, requestFn, true).then(resolve).catch(reject);
			}, DEBOUNCE_DELAY - (now - lastTime));
		});
	}

	// Create and store the request
	const requestPromise = requestFn().finally(() => {
		pendingRequests.delete(key);
		lastRequestTime.set(key, Date.now());
	});

	pendingRequests.set(key, requestPromise);
	return requestPromise;
};

// Updated interfaces to support both guest and authenticated users
export interface AIChat {
	_id: string;
	participants: (string | { _id: string; name: string; email?: string })[]; // Support both user objects and guest IDs
	type: "ai";
	title: string;
	messages: AIMessage[];
	isActive: boolean;
	metadata?: {
		aiSessionId?: string;
		userType: "guest" | "registered";
		conversationType: string;
	};
	createdAt: string;
	updatedAt: string;
}

export interface UserInfo {
	id: string;
	type: "guest" | "user";
	isGuest: boolean;
	name?: string;
	email?: string;
}

export interface MessageMetadata {
	conversationType?: string;
	searchQuery?: string;
	filters?: Record<string, unknown>;
	propertyIds?: string[];
	responseId?: string;
}

export interface MessageAction {
	type: string;
	label: string;
	value?: string;
	data?: Record<string, unknown>;
}

export interface AIMessage {
	_id?: string;
	sender: string | { _id: string; name: string; avatar?: string }; // Can be user object, guest ID, or 'ai-assistant'
	content: string;
	messageType: "text" | "image" | "document" | "system" | "ai-response";
	suggestions?: string[];
	properties?: PropertySuggestion[];
	metadata?: MessageMetadata;
	readBy: string[];
	createdAt: string;
	role?: "user" | "assistant";
	timestamp?: string;
	actions?: MessageAction[];
	aiMetadata?: {
		model?: string;
		tokensUsed?: number;
		responseTime?: number;
		confidence?: number;
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

export interface AIContextSearch {
	location?: string;
	priceRange?: { min: number; max: number };
	propertyType?: string;
	bedrooms?: number;
	bathrooms?: number;
	amenities?: string[];
}

export interface AIUserPreferences {
	budget?: number;
	preferredLocations?: string[];
	propertyTypes?: string[];
	mustHaveAmenities?: string[];
}

export interface AIChatContext {
	propertySearch?: AIContextSearch;
	userPreferences?: AIUserPreferences;
	propertyType?: string;
	location?: string;
	showModeSpecificContent?: boolean;
}

export interface AISearchResponse {
	properties: PropertySuggestion[];
	aiResponse: string;
	suggestions: string[];
	totalResults: number;
}

export interface PropertySearchFilters {
	minPrice?: number;
	maxPrice?: number;
	propertyType?: string;
	location?: string;
	bedrooms?: number;
	bathrooms?: number;
	amenities?: string[];
	area?: {
		min?: number;
		max?: number;
		unit?: "sqft" | "sqm";
	};
}

export interface SearchMetadata {
	searchTime?: number;
	totalMatches?: number;
	searchRadius?: number;
	averagePrice?: number;
	priceRange?: {
		min: number;
		max: number;
	};
}

export interface PaginationInfo {
	page: number;
	limit: number;
	total: number;
	pages: number;
	hasMore?: boolean;
}

export interface SendMessageMetadata {
	tokensUsed?: number;
	responseTime?: number;
	confidence?: number;
	properties?: PropertySuggestion[];
	suggestions?: string[];
}

export interface SendMessageResponse {
	success: boolean;
	data: {
		messages: AIMessage[];
		chat: AIChat;
		metadata: SendMessageMetadata;
		userInfo?: UserInfo;
	};
}

// Enhanced AI Chat Service that supports both guests and authenticated users
export class AIChatService {
	private baseUrl = "/ai"; // Fixed: removed /api since apiClient already has /api in baseURL
	private guestId: string | null = null;

	// Generate or retrieve guest ID for non-authenticated users
	private getGuestId(): string {
		let guestId = localStorage.getItem("propmize_guest_id");
		if (!guestId) {
			const timestamp = Date.now();
			const random = Math.random().toString(36).substring(2);
			guestId = `guest_${timestamp}_${random}`;
			localStorage.setItem("propmize_guest_id", guestId);
		}
		return guestId;
	}

	// Clear guest session and chat (when user signs up/logs in)
	clearGuestSession(): void {
		localStorage.removeItem("propmize_guest_id");
		localStorage.removeItem("ai_current_chat");
		this.guestId = null;
	}

	// Check if user is guest (no auth token)
	isGuestUser(): boolean {
		const hasAuthToken =
			!!localStorage.getItem("token") || !!document.cookie.includes("token=");
		return !hasAuthToken;
	}

	// Start new AI chat session (works for both guests and authenticated users)
	async startAIChat(
		conversationType:
			| "property-search"
			| "general-inquiry"
			| "recommendation"
			| "support" = "property-search",
		context?: AIChatContext
	): Promise<{ success: boolean; data: AIChat; userInfo?: UserInfo }> {
		const requestKey = `startChat:${conversationType}:${JSON.stringify(
			context
		)}`;
		const guestId = this.isGuestUser() ? this.getGuestId() : undefined;
		return debouncedRequest(requestKey, async () => {
			try {
				const response = await apiClient.post(`${this.baseUrl}/chat`, {
					conversationType,
					context,
					...(guestId && { guestId }),
				});
				return response.data;
			} catch (error) {
				console.error("Error starting AI chat:", error);
				throw error;
			}
		});
	}

	// Send message to AI (works for both guests and authenticated users)
	async sendMessage(
		chatId: string,
		message: string,
		context?: AIChatContext
	): Promise<SendMessageResponse> {
		const requestKey = `sendMessage:${chatId}:${message.substring(0, 50)}`;
		const guestId = this.isGuestUser() ? this.getGuestId() : undefined;
		return debouncedRequest(requestKey, async () => {
			try {
				const response = await apiClient.post(
					`${this.baseUrl}/chat/${chatId}/message`,
					{
						content: message,
						context,
						...(guestId && { guestId }),
					}
				);
				return response.data;
			} catch (error) {
				console.error("Error sending AI message:", error);
				throw error;
			}
		});
	}

	// Get chat history (works for both guests and authenticated users)
	async getChatHistory(
		chatId: string,
		page: number = 1,
		limit: number = 50
	): Promise<{
		success: boolean;
		data: {
			messages: AIMessage[];
			chat: AIChat;
			userInfo?: UserInfo;
			pagination: PaginationInfo;
		};
	}> {
		try {
			const response = await apiClient.get(
				`${this.baseUrl}/chat/${chatId}/messages`,
				{
					params: { page, limit },
				}
			);
			return response.data;
		} catch (error) {
			console.error("Error getting chat history:", error);
			throw error;
		}
	}

	// AI property search (works for both guests and authenticated users)
	async searchProperties(
		query: string,
		filters: PropertySearchFilters = {}
	): Promise<{
		success: boolean;
		data: {
			properties: PropertySuggestion[];
			aiResponse: string;
			suggestions: string[];
			totalResults: number;
			metadata: SearchMetadata;
			userInfo?: UserInfo;
		};
	}> {
		try {
			const response = await apiClient.post(`${this.baseUrl}/search`, {
				query,
				filters,
			});
			return response.data;
		} catch (error) {
			console.error("Error in AI property search:", error);
			throw error;
		}
	}

	// Get AI chat by ID
	async getAIChat(
		chatId: string
	): Promise<{ success: boolean; data: AIChat; userInfo?: UserInfo }> {
		try {
			const response = await apiClient.get(`${this.baseUrl}/chat/${chatId}`);
			return response.data;
		} catch (error) {
			console.error("Error getting AI chat:", error);
			throw error;
		}
	}

	// Get user's AI chat sessions
	async getUserAIChats(
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
		userInfo?: UserInfo;
	}> {
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				...(status && { status }),
			});

			const response = await apiClient.get(`${this.baseUrl}/chats?${params}`);
			return response.data;
		} catch (error) {
			console.error("Error getting user AI chats:", error);
			throw error;
		}
	}

	// Update AI chat context (search preferences, etc.)
	async updateChatContext(
		chatId: string,
		context: AIChatContext
	): Promise<{ success: boolean; data: AIChat; userInfo?: UserInfo }> {
		try {
			const response = await apiClient.patch(
				`${this.baseUrl}/chat/${chatId}/context`,
				{ context }
			);
			return response.data;
		} catch (error) {
			console.error("Error updating chat context:", error);
			throw error;
		}
	}

	// End AI chat session
	async endSession(
		chatId: string
	): Promise<{ success: boolean; data: AIChat; userInfo?: UserInfo }> {
		try {
			const response = await apiClient.patch(
				`${this.baseUrl}/chat/${chatId}/end`
			);
			return response.data;
		} catch (error) {
			console.error("Error ending AI chat session:", error);
			throw error;
		}
	}

	// Submit feedback for AI message
	async submitMessageFeedback(
		chatId: string,
		messageId: string,
		feedback: {
			rating: 1 | 2 | 3 | 4 | 5;
			helpful: boolean;
			comment?: string;
		}
	): Promise<{ success: boolean }> {
		try {
			const response = await apiClient.post(
				`${this.baseUrl}/chat/${chatId}/message/${messageId}/feedback`,
				feedback
			);
			return response.data;
		} catch (error) {
			console.error("Error submitting message feedback:", error);
			throw error;
		}
	}

	// Submit overall session feedback
	async submitSessionFeedback(
		chatId: string,
		feedback: {
			overallRating: 1 | 2 | 3 | 4 | 5;
			wasHelpful: boolean;
			improvementSuggestions?: string;
			completedGoal: boolean;
			goalDescription?: string;
		}
	): Promise<{ success: boolean }> {
		try {
			const response = await apiClient.post(
				`${this.baseUrl}/chat/${chatId}/feedback`,
				feedback
			);
			return response.data;
		} catch (error) {
			console.error("Error submitting session feedback:", error);
			throw error;
		}
	}

	// Get AI chat analytics
	async getChatAnalytics(chatId: string): Promise<{
		success: boolean;
		data: {
			sessionMetrics: SessionMetrics;
			analytics: ChatAnalytics;
		};
		userInfo?: UserInfo;
	}> {
		try {
			const response = await apiClient.get(
				`${this.baseUrl}/chat/${chatId}/analytics`
			);
			return response.data;
		} catch (error) {
			console.error("Error getting chat analytics:", error);
			throw error;
		}
	}
}

// Create singleton instance for use throughout the app
export const aiChatService = new AIChatService();

// Utility functions for message formatting
export const formatAIMessage = (message: AIMessage): ChatMessage => {
	return {
		id: message._id || Math.random().toString(),
		content: message.content,
		sender: message.role === "assistant" ? "ai" : "user",
		timestamp: new Date(message.timestamp || message.createdAt),
		...(message.suggestions && { suggestions: message.suggestions }),
		...(message.properties && {
			propertyInfo: message.properties.map((prop: PropertySuggestion) => ({
				_id: prop._id || "unknown",
				title: prop.title || "Property Title Not Available",
				price: formatPrice(prop.price),
				location:
					typeof prop.address === "object"
						? prop.address?.city ||
						  prop.address?.area ||
						  "address not specified"
						: prop.address || "Location not specified",
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
				confidence: message.aiMetadata.confidence,
			},
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

interface SocketInstance {
	on: <T = unknown>(event: string, callback: (data: T) => void) => void;
	off: <T = unknown>(event: string, callback?: (data: T) => void) => void;
	emit: (event: string, data?: unknown) => void;
}

interface SearchProgress {
	progress: number;
	status: string;
	message?: string;
	propertiesFound?: number;
}

// Real-time socket event handlers
export const handleAISocketEvents = (
	socket: SocketInstance,
	callbacks: {
		onMessageReceived?: (message: AIMessage) => void;
		onTypingStart?: () => void;
		onTypingStop?: () => void;
		onSearchProgress?: (progress: SearchProgress) => void;
	}
) => {
	if (!socket) return;

	// Listen for AI responses
	socket.on(
		"aiMessageResponse",
		(data: SocketEventData & { message: AIMessage }) => {
			if (callbacks.onMessageReceived) {
				callbacks.onMessageReceived(data.message);
			}
		}
	);

	// Listen for typing indicators
	socket.on("aiChatTyping", (data: SocketEventData & { isTyping: boolean }) => {
		if (data.isTyping && callbacks.onTypingStart) {
			callbacks.onTypingStart();
		} else if (!data.isTyping && callbacks.onTypingStop) {
			callbacks.onTypingStop();
		}
	});

	// Listen for search progress
	socket.on("searchProgress", (data: SearchProgress) => {
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

export default aiChatService;
