// Import existing types from the main types file
import { Property, User } from "../../types/index";

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
}

export interface Lead {
	id: string;
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
	// Relations
	buyer?: User;
	seller?: User;
	property?: Property;
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
}

// Re-export existing types
export type { Property, User } from "../../types/index";

