// AI Chat Types - Updated for new model
export interface AIChatMessage {
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
		type:
			| "schedule-viewing"
			| "request-info"
			| "save-property"
			| "contact-agent";
		data: {
			propertyId?: string;
			scheduledTime?: string;
			contactInfo?: {
				name?: string;
				phone?: string;
				email?: string;
			};
			message?: string;
		};
	}>;
	feedback?: {
		rating: 1 | 2 | 3 | 4 | 5;
		helpful: boolean;
		comment?: string;
	};
}

export interface AIChatContext {
	propertySearch?: {
		location?: string;
		priceRange?: { min: number; max: number };
		propertyType?: string;
		bedrooms?: number;
		bathrooms?: number;
		amenities?: string[];
	};
	conversationType:
		| "property-search"
		| "general-inquiry"
		| "recommendation"
		| "support";
	userPreferences?: {
		budget?: number;
		preferredLocations?: string[];
		propertyTypes?: string[];
		mustHaveAmenities?: string[];
	};
}

export interface AIChat {
	_id: string;
	user: string;
	sessionId: string;
	title: string;
	context: AIChatContext;
	messages: AIChatMessage[];
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
			type:
				| "property-viewed"
				| "inquiry-sent"
				| "viewing-scheduled"
				| "contact-made";
			timestamp: string;
			data?: {
				propertyId?: string;
				leadId?: string;
				contactMethod?: string;
				scheduledTime?: string;
			};
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
	sessionType:
		| "single-query"
		| "conversation"
		| "property-exploration"
		| "guided-search";
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

export interface PropertySuggestion {
	id: string;
	_id?: string;
	title: string;
	price: number;
	location:
		| string
		| {
				city?: string;
				area?: string;
		  };
	type: string;
	area?: string;
	images?: string[];
	image?: string;

	size?: string; // Added size property to fix the error
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
	properties: PropertySuggestion[];
	aiResponse: string;
	suggestions: string[];
	totalResults: number;
	metadata?: {
		searchQuery?: {
			query: string;
			filters?: {
				minPrice?: number;
				maxPrice?: number;
				propertyType?: string;
				location?: string;
				bedrooms?: number;
				bathrooms?: number;
			};
		};
		avgPrice?: number;
		topLocations?: string[];
	};
}

// Feedback Types
export interface MessageFeedback {
	messageId: string;
	rating: 1 | 2 | 3 | 4 | 5;
	helpful: boolean;
	comment?: string;
	timestamp: string;
}

export interface SessionFeedback {
	sessionId: string;
	overallRating: 1 | 2 | 3 | 4 | 5;
	wasHelpful: boolean;
	improvementSuggestions?: string;
	completedGoal: boolean;
	goalDescription?: string;
	timestamp: string;
}
