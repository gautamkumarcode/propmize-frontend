import { QueryClient } from "@tanstack/react-query";

// Define proper error interface for HTTP errors
interface HttpError {
	response?: {
		status: number;
		data?: {
			message?: string;
			error?: string;
		};
	};
	message?: string;
}

// Type guard to check if error is an HttpError
function isHttpError(error: unknown): error is HttpError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'response' in error &&
		typeof (error as HttpError).response?.status === 'number'
	);
}

// Create query client with default options
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// 5 minutes cache time
			staleTime: 5 * 60 * 1000,
			// 10 minutes garbage collection time
			gcTime: 10 * 60 * 1000, // formerly cacheTime
			// Reduce retries to prevent rate limiting
			retry: (failureCount: number, error: unknown) => {
				// Don't retry rate limit errors
				if (isHttpError(error) && error.response?.status === 429) return false;
				// Don't retry client errors (4xx)
				if (
					isHttpError(error) &&
					error.response?.status &&
					error.response.status >= 400 &&
					error.response.status < 500
				)
					return false;
				// Only retry server errors up to 1 time
				return failureCount < 1;
			},
			// Increase retry delay to prevent rapid requests
			retryDelay: (attemptIndex: number) =>
				Math.min(3000 * 2 ** attemptIndex, 30000), // Increased base delay from 2000 to 3000
			// Don't refetch on window focus in development
			refetchOnWindowFocus: false, // Disabled to reduce API calls
			// Don't refetch on reconnect by default
			refetchOnReconnect: false, // Disabled to reduce API calls
		},
		mutations: {
			// Don't retry mutations to prevent duplicate requests
			retry: (error: unknown) => {
				// Never retry rate limit errors
				if (isHttpError(error) && error.response?.status === 429) return false;
				// Never retry client errors
				if (
					isHttpError(error) &&
					error.response?.status &&
					error.response.status >= 400 &&
					error.response.status < 500
				)
					return false;
				return false; // Don't retry mutations by default
			},
			// Longer delay for mutations
			retryDelay: 3000,
		},
	},
});

// Query keys for consistent cache management
export const QueryKeys = {
	// Auth
	auth: ["auth"] as const,
	profile: ["auth", "profile"] as const,

	// Properties
	properties: ["properties"] as const,
	property: (id: string) => ["properties", id] as const,
	myProperties: ["properties", "my-properties"] as const,
	featuredProperties: ["properties", "featured"] as const,
	premiumProperties: ["properties", "premium"] as const,
	likedProperties: ["properties", "liked"] as const,
	recentlyViewedProperties: ["properties", "recently-viewed"] as const,
	propertiesByLocation: (city: string, state?: string) =>
		state
			? ["properties", "location", city, state]
			: ["properties", "location", city],
	searchProperties: (
		query: string,
		filters?: Record<string, unknown> | null
	) => ["properties", "search", query, filters],
	propertyAnalytics: (id: string, period?: string) =>
		period
			? ["properties", id, "analytics", period]
			: ["properties", id, "analytics"],

	// Users
	users: ["users"] as const,
	userProfile: ["users", "profile"] as const,
	userStats: ["users", "stats"] as const,
	userActivity: ["users", "activity"] as const,

	// Leads
	leads: ["leads"] as const,
	myLeads: ["leads", "my-leads"] as const,
	myInquiries: ["leads", "my-inquiries"] as const,
	lead: (id: string) => ["leads", id] as const,
	propertyLeads: (propertyId: string) =>
		["leads", "property", propertyId] as const,
	leadAnalytics: ["leads", "analytics"] as const,

	// Chat
	chat: ["chat"] as const,
	conversations: ["chat", "conversations"] as const,
	conversation: (id: string) => ["chat", "conversations", id] as const,
	messages: (conversationId: string) =>
		["chat", "messages", conversationId] as const,
	unreadCount: ["chat", "unread-count"] as const,

	// AI Chat
	aiChats: ["ai-chats"] as const,
	aiChat: (id: string) => ["ai-chat", id] as const,
	aiChatAnalytics: (id: string) => ["ai-chat-analytics", id] as const,
	aiPropertySearch: ["ai-property-search"] as const,

	// Payments
	payments: ["payments"] as const,
	plans: ["payments", "plans"] as const,
	plan: (id: string) => ["payments", "plans", id] as const,
	paymentHistory: ["payments", "history"] as const,
	payment: (id: string) => ["payments", id] as const,
	subscriptionStatus: ["payments", "subscription-status"] as const,

	// Analytics
	analytics: ["analytics"] as const,
	dashboardAnalytics: ["analytics", "dashboard"] as const,
	analyticsProperty: (id: string) => ["analytics", "properties", id] as const,
	analyticsLeads: ["analytics", "leads"] as const,

	// Notifications
	notifications: ["notifications"] as const,
	notification: (id: string) => ["notifications", id] as const,
	notificationUnreadCount: ["notifications", "unread-count"] as const,
	notificationPreferences: ["notifications", "preferences"] as const,

	// Support
	support: ["support"] as const,
	supportTickets: ["support", "tickets"] as const,
	supportTicket: (id: string) => ["support", "tickets", id] as const,
	faqs: ["support", "faqs"] as const,
	faqCategories: ["support", "faqs", "categories"] as const,
	supportStats: ["support", "stats"] as const,
	sellerPropertyAnalytics: ["analytics", "seller-properties"] as const,
} as const;
