// User and Authentication Types
export interface User {
	_id: string;
	name: string;
	email: string;
	phone?: string;
	bio?: string;
	avatar?: string;
	address?: {
		street?: string;
		city?: string;
		state?: string;
		zipCode?: string;
		country?: string;
	};
	verified?: boolean;
	createdAt?: string;
	updatedAt?: string;
	preferences?: {
		propertyTypes?: string[];
		priceRange?: { min: number; max: number };
		locations?: string[];
		notifications?: { email: boolean; sms: boolean; push: boolean };
	};
	role: "buyer" | "seller" | "admin";
	savedProperties?: string[]; // Array of property IDs
	viewedProperties?: string[]; // Array of property IDs
	contactedOwners?: string[]; // Array of owner IDs or property IDs
	notifications?: Notification[]; // Use the Notification interface
}

// Property Types
export interface PropertyResponse {
	_id: string;
	title: string;
	description: string;
	images: string[];
	status: string;
	featured?: boolean;
	isPremium?: boolean;
	propertyType: string;
	listingType: string;
	price: number;
	pricing?: {
		basePrice?: {
			value: number;
			currency: string;
		};
		priceNegotiable?: boolean;
		maintenanceCharges?: number;
		securityDeposit?: number;
		brokeragePercentage?: number;
	};
	bedrooms?: number;
	bathrooms?: number;
	area: {
		value: number;
		unit: string;
	};
	parking?: number;
	balconies?: number;
	floor?: number;
	totalFloors?: number;
	age: number;
	furnished: string;
	amenities?: string[];
	features?: {
		facing?: string;
		flooringType?: string;
		waterSupply?: string;
		powerBackup?: boolean;
	};
	address: {
		street: string;
		area: string;
		city: string;
		state: string;
		zipCode: string;
		country: string;
		landmark?: string;
	};
	nearbyPlaces?: {
		schools?: { name: string; distance: number; unit?: string }[];
		hospitals?: { name: string; distance: number; unit?: string }[];
		malls?: { name: string; distance: number; unit?: string }[];
		transport?: { name: string; distance: number; unit?: string }[];
	};
	createdAt: string;
	expiresAt?: string;
	views?: number;
	contact: {
		name: string;
		type: string;
		phone: string;
		whatsapp?: string;
	};
	legalInfo?: {
		ownershipType: string;
		rera?: {
			number: string;
			approved: boolean;
		};
	};
	availability?: {
		immediatelyAvailable: boolean;
		possessionDate?: string;
		leaseDuration?: number;
	};
	postedBy: {
		id: string;
		name: string;
		contact: string;
	};
	likedBy: [
		{
			user: string;
			likedAt: string;
			_id: string;
		}
	];
}
export interface PropertyImage {
	id: string;
	url: string;
	alt: string;
	isPrimary: boolean;
	order: number;
}

// Inquiry and Lead Types
export interface Inquiry {
	id: string;
	propertyId: string;
	property: PropertyResponse;
	buyerId: string;
	buyer: User;
	sellerId: string;
	message: string;
	status: "pending" | "responded" | "closed";
	createdAt: Date;
	updatedAt: Date;
}

// Chat Types
export interface ChatMessage {
	_id: string;
	content: string;
	sender: "user" | "ai";
	timestamp: Date;
	metadata?: {
		propertyId?: string;
		searchQuery?: string;
	};
	attachments?: {
		type: "image" | "document" | "video";
		url: string;
		filename: string;
		size: number;
	}[];
}

export interface ChatSession {
	id: string;
	userId: string;
	title: string;
	messages: ChatMessage[];
	createdAt: Date;
	updatedAt: Date;
}

// Notification Types
export interface Notification {
	id: string;
	userId: string;
	type: "inquiry" | "property_update" | "payment" | "system";
	title: string;
	message: string;
	isRead: boolean;
	metadata?: NotificationMetadata;
	createdAt: Date;
}

// Premium Plan Types
export interface PremiumPlan {
	id: string;
	name: string;
	description: string;
	price: number;
	duration: number; // in days
	features: string[];
	propertyListingLimit: number;
	premiumListingLimit: number;
	isActive: boolean;
}

export interface UserSubscription {
	id: string;
	userId: string;
	planId: string;
	plan: PremiumPlan;
	startDate: Date;
	endDate: Date;
	status: "active" | "expired" | "cancelled";
	paymentId: string;
}

// API Response Types
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

// Filter and Search Types
export interface PropertyFilters {
	type?: PropertyResponse["propertyType"];
	subType?: string;
	status?: PropertyResponse["status"];
	priceRange?: {
		min: number;
		max: number;
	};
	areaRange?: {
		min: number;
		max: number;
	};
	city?: string;
	features?: string[];
	amenities?: string[];
}

// Integration Types
export interface RazorpayConfig {
	keyId: string;
	keySecret: string;
	webhookSecret: string;
}

export interface MSG91Config {
	authKey: string;
	templateId: string;
	route: string;
}

export interface OpenAIConfig {
	apiKey: string;
	model: string;
	maxTokens: number;
}

export interface FirebaseConfig {
	apiKey: string;
	authDomain: string;
	projectId: string;
	storageBucket: string;
	messagingSenderId: string;
	appId: string;
}

export interface ZohoConfig {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}

// Component Props Types
export interface LayoutProps {
	children: React.ReactNode;
	user?: User;
	userMode: "buyer" | "seller";
}

export interface PropertyCardProps {
	property: PropertyResponse;
	showSaveButton?: boolean;
	showContactButton?: boolean;
	className?: string;
}

export interface ChatBubbleProps {
	message: ChatMessage;
	isTyping?: boolean;
}

// Store Types
export interface AppState {
	user: User | null;
	userMode: "buyer" | "seller";
	isAuthenticated: boolean;
	notifications: Notification[];
	chatSessions: ChatSession[];
	currentChatId: string | null;
	savedProperties: string[];
	recentlyViewed: string[];
}

export interface AuthState {
	isLoading: boolean;
	error: string | null;
}

export interface PropertyState {
	properties: PropertyResponse[];
	filters: PropertyFilters;
	isLoading: boolean;
	error: string | null;
}

// AI Chat Action Types
export type AIActionType =
	| "schedule-viewing"
	| "request-info"
	| "save-property"
	| "contact-agent";

export interface AIAction {
	type: AIActionType;
	propertyId?: string;
	data?: {
		propertyId?: string;
		scheduledTime?: string;
		contactInfo?: {
			name?: string;
			phone?: string;
			email?: string;
		};
		message?: string;
	};
}

// Notification metadata types
export interface NotificationMetadata {
	propertyId?: string;
	leadId?: string;
	paymentId?: string;
	actionUrl?: string;
	additionalData?: Record<string, string | number | boolean>;
}

// API Error type
export interface APIError {
	response?: {
		status: number;
		data?: {
			message?: string;
			error?: string;
		};
	};
	message?: string;
}
