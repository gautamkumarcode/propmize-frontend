// Import existing types from the main types file
import { PropertyResponse, User } from "../../types/index";

// API Response Types
export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
	meta?: {
		page?: number;
		limit?: number;
		total?: number;
		totalPages?: number;
	};
}

export interface ApiError {
	message: string;
	errors?: Record<string, string[]>;
	stack?: string;
}

// Auth Types
export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterData {
	name: string;
	email: string;
	phone: string;
	password: string;
	role: "buyer" | "seller";
}

export interface AuthResponse {
	user: User;
	tokens: {
		accessToken: string;
		refreshToken: string;
	};
}

// Property Types - extending the existing ones
export interface PropertyCreateData {
	title: string;
	description: string;
	price: number;
	type: "residential" | "commercial" | "land";
	subType: string;
	status: "sale" | "rent";
	area: {
		size: number;
		unit: "sqft" | "sqyard" | "acre";
	};
	location: {
		address: string;
		city: string;
		state: string;
		pincode: string;
		latitude?: number;
		longitude?: number;
	};
	features: string[];
	amenities: string[];
	images?: File[];
}

export interface PropertyFilters {
	type?: string;
	status?: string;
	minPrice?: number;
	maxPrice?: number;
	city?: string;
	state?: string;
	bedrooms?: number;
	search?: string;
	bathrooms?: number;
	area?: {
		min?: number;
		max?: number;
	};
	amenities?: string[];
	sortBy?: "price" | "date" | "area" | "views";
	sortOrder?: "asc" | "desc";
	page?: number;
	limit?: number;
}

// Lead Types
export interface LeadCreateData {
	propertyId: string;
	message?: string;
	interestedInSite?: boolean;
	preferredContactTime?: "morning" | "afternoon" | "evening";
	buyerContact: {
		phone?: string;
		email?: string;
		preferredContactTime?: string;
		contactMethod: "phone" | "email" | "whatsapp" | "any";
	};
}

export interface Lead {
	_id: string; // Changed from id to _id to match backend
	buyerId: string;
	sellerId: string;
	propertyId: string;
	message?: string;
	status: "new" | "contacted" | "qualified" | "converted" | "rejected";
	interestedInSite: boolean;
	preferredContactTime?: "morning" | "afternoon" | "evening";
	notes?: string;
	contactedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	followUps?: {
		date: Date;
		method: "phone" | "email" | "whatsapp" | "meeting";
		status: "scheduled" | "completed" | "missed";
		notes?: string;
		nextFollowUp?: Date;
	}[];
	// Relations
	buyer?: User;
	seller?: User;
	property?: PropertyResponse;
	priority?: "low" | "medium" | "high" | "urgent";
	source?: string;
	buyerContact?: {
		phone?: string;
		email?: string;
		preferredContactTime?: string;
		contactMethod?: "phone" | "email" | "whatsapp" | "any";
	};
}

export interface LeadAnalyticsData {
	totalLeads: number;
	converted: number;
	conversionRate: string;
	byStatus: { _id: string; count: number }[];
	byPriority: { _id: string; count: number }[];
}

// Chat Types
export interface MessageCreateData {
	conversationId: string;
	receiverId: string;
	content: string;
	type?: "text" | "image" | "document";
}

export interface ConversationCreateData {
	participantId: string; // The other user ID
	message?: string; // Initial message
}

// Payment Types
export interface PaymentCreateData {
	planId: string;
	duration: number; // in months
}

// User Types
export interface UserUpdateData {
	name?: string;
	phone?: string;
	avatar?: File;
	preferences?: {
		notifications: boolean;
		emailUpdates: boolean;
		smsAlerts: boolean;
	};
	// Additional fields can be added here
	address?: {
		street: string;
		city: string;
		state: string;
		country: string;
		zip: string;
	};
	// Additional fields can be added here
}

// Re-export existing types
export type { PropertyResponse, User } from "../../types/index";

