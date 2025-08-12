// User and Authentication Types
export interface User {
	id: string;
	email: string;
	name: string;
	phone: string;
	avatar?: string;
	role: "buyer" | "seller" | "admin";
	isVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
	location?: string;
	verified?: boolean;
}

// Property Types
export interface Property {
	_id: string;
	title: string;
	description: string;
	price: number;
	type: "residential" | "commercial" | "land" | "industrial";
	subType: string; // apartment, villa, plot, office, etc.
	status: "sale" | "rent" | "sold" | "rented";
	area: {
		size: number;
		unit: "sqft" | "sqyard" | "acre";
	};
	address: {
		area: string;
		street: string;
		city: string;
		state: string;
		pincode: string;
		latitude?: number;
		longitude?: number;
	};
	features: string[];
	amenities: string[];
	images: PropertyImage[];
	sellerId: string;
	seller: User;
	isPremium: boolean;
	views: number;
	inquiries: number;
	createdAt: Date;
	updatedAt: Date;
	isNew?: boolean; // Indicates if the property is newly listed
	featured?: boolean; // Indicates if the property is featured
	isLiked?: boolean;
	bedrooms?: number;
	bathrooms?: number;
	parking?: boolean;
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
	property: Property;
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
	metadata?: any;
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
	type?: Property["type"];
	subType?: string;
	status?: Property["status"];
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
	property: Property;
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
	properties: Property[];
	filters: PropertyFilters;
	isLoading: boolean;
	error: string | null;
}
