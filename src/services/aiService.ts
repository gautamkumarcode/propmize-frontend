// AI Service Types and Interfaces for Frontend
export interface ChatMessage {
	id: string;
	content: string;
	sender: "user" | "ai";
	timestamp: Date;
	suggestions?: string[];
	propertyInfo?: PropertyInfo[];
	actions?: {
		type: string;
		label: string;
		value?: string;
		data?: Record<string, unknown>;
	}[];
	aiMetadata?: {
		model?: string;
		tokensUsed?: number;
		responseTime?: number;
		confidence?: number;
	};
}

export interface PropertyInfo {
	id: string;
	title: string;
	price: string;
	location: string;
	type: string;
	size: string;
	image: string;
}

export interface PropertySuggestion {
	id: string;
	title: string;
	price: number;
	address: {
		city?: string;
		area?: string;
	};
	type: string;
	area?: string;
	size?: string;
	images?: string[];
	image?: string;
}

export interface AISearchFilters {
	minPrice?: number;
	maxPrice?: number;
	bedrooms?: number;
	bathrooms?: number;
	propertyType?: string;
	location?: string;
	amenities?: string[];
}

export interface AISearchResult {
	properties: PropertySuggestion[];
	aiResponse: string;
	suggestions: string[];
	totalResults: number;
	searchId?: string;
	metadata?: {
		searchDuration: number;
		filters: AISearchFilters;
		source: string;
		confidence: number;
	};
}

export interface AIConversationContext {
	propertySearch?: {
		location?: string;
		priceRange?: { min: number; max: number };
		propertyType?: string;
		bedrooms?: number;
		bathrooms?: number;
		amenities?: string[];
	};
	userPreferences?: {
		budget?: number;
		preferredLocations?: string[];
		propertyTypes?: string[];
		mustHaveAmenities?: string[];
	};
	conversationType?:
		| "property-search"
		| "general-inquiry"
		| "recommendation"
		| "support";
}

// Utility functions for AI service
export const formatCurrency = (amount: number): string => {
	if (amount >= 10000000) {
		return `₹${(amount / 10000000).toFixed(1)} Cr`;
	} else if (amount >= 100000) {
		return `₹${(amount / 100000).toFixed(1)} L`;
	} else {
		return `₹${amount.toLocaleString()}`;
	}
};

export const extractSearchIntent = (
	message: string
): {
	location?: string;
	budget?: { min?: number; max?: number };
	propertyType?: string;
	bedrooms?: number;
} => {
	const result: {
		location?: string;
		budget?: { min?: number; max?: number };
		propertyType?: string;
		bedrooms?: number;
	} = {};

	// Extract location
	const locationRegex =
		/\b(mumbai|delhi|bangalore|chennai|kolkata|hyderabad|pune|ahmedabad|gurgaon|noida|thane|bandra|andheri|powai|worli)\b/gi;
	const locationMatch = message.match(locationRegex);
	if (locationMatch) {
		result.location = locationMatch[0].toLowerCase();
	}

	// Extract budget
	const budgetRegex = /(\d+)\s*(lakh|crore|l|cr)/gi;
	const budgetMatch = message.match(budgetRegex);
	if (budgetMatch) {
		const amount = parseFloat(budgetMatch[0]);
		const unit = budgetMatch[0].toLowerCase();
		if (unit.includes("cr")) {
			result.budget = { max: amount * 10000000 };
		} else if (unit.includes("l")) {
			result.budget = { max: amount * 100000 };
		}
	}

	// Extract property type
	if (/\b(apartment|flat)\b/gi.test(message)) {
		result.propertyType = "apartment";
	} else if (/\b(villa|house)\b/gi.test(message)) {
		result.propertyType = "villa";
	} else if (/\b(office|commercial)\b/gi.test(message)) {
		result.propertyType = "commercial";
	}

	// Extract bedrooms
	const bedroomRegex = /(\d+)\s*(bhk|bedroom)/gi;
	const bedroomMatch = message.match(bedroomRegex);
	if (bedroomMatch) {
		result.bedrooms = parseInt(bedroomMatch[0]);
	}

	return result;
};

export default {
	formatCurrency,
	extractSearchIntent,
};
