import { QueryClient } from "@tanstack/react-query";

// Create query client with default options
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// 5 minutes cache time
			staleTime: 5 * 60 * 1000,
			// 10 minutes garbage collection time
			gcTime: 10 * 60 * 1000, // formerly cacheTime
			// Retry failed requests 3 times
			retry: 3,
			// Retry with exponential backoff
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			// Don't refetch on window focus in development
			refetchOnWindowFocus: process.env.NODE_ENV === "production",
			// Don't refetch on reconnect by default
			refetchOnReconnect: true,
		},
		mutations: {
			// Retry mutations once
			retry: 1,
			// Retry after 1 second
			retryDelay: 1000,
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
	propertiesByLocation: (city: string, state?: string) =>
		state
			? ["properties", "location", city, state]
			: ["properties", "location", city],
	searchProperties: (query: string, filters?: any) => [
		"properties",
		"search",
		query,
		filters,
	],
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
} as const;
