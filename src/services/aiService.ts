// AI Response Service
export interface PropertySuggestion {
	id: string;
	title: string;
	location: string;
	price: number;
	beds: number;
	baths: number;
	area: string;
	type: string;
	image: string;
}

export interface ChatMessage {
	id: string;
	content: string;
	sender: "user" | "ai";
	timestamp: Date;
	isPropertySuggestion?: boolean;
	properties?: PropertySuggestion[];
}

export const generateAIResponse = (query: string): ChatMessage => {
	const lowerQuery = query.toLowerCase();

	// Sample property data
	const propertyDatabase = {
		apartments: [
			{
				id: "1",
				title: "Modern 2BHK in Tech Park Vicinity",
				location: "Whitefield, Bangalore",
				price: 4500000,
				beds: 2,
				baths: 2,
				area: "1,200 sq ft",
				type: "Apartment",
				image: "/api/placeholder/300/200",
			},
			{
				id: "2",
				title: "Luxury 2BHK with Amenities",
				location: "Electronic City, Bangalore",
				price: 3800000,
				beds: 2,
				baths: 2,
				area: "1,100 sq ft",
				type: "Apartment",
				image: "/api/placeholder/300/200",
			},
		],
		investment: [
			{
				id: "3",
				title: "Pre-Launch Premium Project",
				location: "Gurgaon Sector 83",
				price: 8500000,
				beds: 3,
				baths: 3,
				area: "1,800 sq ft",
				type: "Investment",
				image: "/api/placeholder/300/200",
			},
		],
		commercial: [
			{
				id: "4",
				title: "Premium Office Space",
				location: "Bandra Kurla Complex, Mumbai",
				price: 25000000,
				beds: 0,
				baths: 2,
				area: "2,500 sq ft",
				type: "Commercial",
				image: "/api/placeholder/300/200",
			},
		],
	};

	// Apartment/2BHK queries
	if (lowerQuery.includes("2bhk") || lowerQuery.includes("apartment")) {
		return {
			id: Date.now().toString(),
			content:
				"I found some excellent 2BHK apartments that match your criteria! Here are the top recommendations:",
			sender: "ai",
			timestamp: new Date(),
			isPropertySuggestion: true,
			properties: propertyDatabase.apartments,
		};
	}

	// Investment queries
	if (lowerQuery.includes("investment") || lowerQuery.includes("invest")) {
		return {
			id: Date.now().toString(),
			content:
				"Based on market trends and growth potential, here are the best investment opportunities in your preferred locations:",
			sender: "ai",
			timestamp: new Date(),
			isPropertySuggestion: true,
			properties: propertyDatabase.investment,
		};
	}

	// Commercial queries
	if (lowerQuery.includes("commercial") || lowerQuery.includes("office")) {
		return {
			id: Date.now().toString(),
			content:
				"I've found some prime commercial properties perfect for your business needs:",
			sender: "ai",
			timestamp: new Date(),
			isPropertySuggestion: true,
			properties: propertyDatabase.commercial,
		};
	}

	// Budget queries
	if (
		lowerQuery.includes("under") ||
		lowerQuery.includes("budget") ||
		lowerQuery.includes("cr") ||
		lowerQuery.includes("lakh")
	) {
		return {
			id: Date.now().toString(),
			content:
				"I'll help you find properties within your budget. Here are some great options that match your price range:",
			sender: "ai",
			timestamp: new Date(),
			isPropertySuggestion: true,
			properties: propertyDatabase.apartments,
		};
	}

	// Location-based queries
	if (
		lowerQuery.includes("bangalore") ||
		lowerQuery.includes("mumbai") ||
		lowerQuery.includes("delhi") ||
		lowerQuery.includes("gurgaon")
	) {
		return {
			id: Date.now().toString(),
			content:
				"I've found some excellent properties in your preferred location. Here are the top recommendations:",
			sender: "ai",
			timestamp: new Date(),
			isPropertySuggestion: true,
			properties: [
				...propertyDatabase.apartments,
				...propertyDatabase.investment,
			],
		};
	}

	// Generic response
	return {
		id: Date.now().toString(),
		content: `I understand you're looking for "${query}". Let me analyze your requirements and search our extensive property database. Based on current market trends and your preferences, I can help you find the perfect property. Would you like me to show you some specific options, or would you prefer to refine your search criteria first?`,
		sender: "ai",
		timestamp: new Date(),
		isPropertySuggestion: false,
	};
};

export const simulateTypingDelay = (): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(resolve, 1500 + Math.random() * 1000); // 1.5-2.5 seconds
	});
};
