export type PropertyFormDataType = {
	title: string;
	description: string;
	propertyType:
		| "apartment"
		| "house"
		| "villa"
		| "plot"
		| "commercial"
		| "office";
	listingType: "sale" | "rent" | "lease";
	price: number;
	currency: string;
	area: {
		value: number;
		unit: "sqft" | "sqm" | "acre" | "hectare";
	};
	bedrooms?: number;
	bathrooms?: number;
	balconies?: number;
	parking?: number;
	furnished: "furnished" | "semi-furnished" | "unfurnished";
	floor?: number;
	totalFloors?: number;
	age: number;
	images: string[];
	videos?: string[];
	virtualTour?: string;
	amenities: string[];
	address: {
		street: string;
		area: string;
		city: string;
		state: string;
		zipCode: string;
		country: string;
		landmark?: string;
		coordinates?: {
			latitude: number;
			longitude: number;
		};
	};

	pricing: {
		basePrice: number;
		maintenanceCharges?: number;
		securityDeposit?: number;
		brokeragePercentage?: number;
		priceNegotiable: boolean;
	};
	availability: {
		immediatelyAvailable: boolean;
		possessionDate?: Date;
		leaseDuration?: number;
	};

	nearbyPlaces?: {
		schools?: { name: string; distance: number }[];
		hospitals?: { name: string; distance: number }[];
		malls?: { name: string; distance: number }[];
		transport?: { name: string; distance: number }[];
	};
};

export type Property = {
	_id: string;
	title: string;
	description: string;
	propertyType:
		| "apartment"
		| "house"
		| "villa"
		| "plot"
		| "commercial"
		| "office";
	listingType: "sale" | "rent" | "lease";
	price: number;
	currency: string;
	area: { value: number; unit: "sqft" | "sqm" | "acre" | "hectare" };
	bedrooms?: number;
	bathrooms?: number;
	balconies?: number;
	parking?: number;
	furnished: "furnished" | "semi-furnished" | "unfurnished";
	floor?: number;
	totalFloors?: number;
	age: number;
	images: string[];
	videos?: string[];
	virtualTour?: string;
	amenities: string[];
	address: {
		street: string;
		area: string;
		city: string;
		state: string;
		zipCode: string;
		country: string;
		landmark?: string;
		coordinates?: { latitude: number; longitude: number };
	};
	seller: string;
	status: "active" | "sold" | "rented" | "inactive" | "pending";
	featured: boolean;
	premium: boolean;
	views: number;
	likes: string[];
	leads: string[];
	approvalStatus: "pending" | "approved" | "rejected";
	rejectionReason?: string;
	seo: {
		metaTitle?: string;
		metaDescription?: string;
		slug: string;
	};
	pricing: {
		basePrice: {
			value: number;
			unit: "Hundred" | "Thousand" | "Lakh" | "Crore";
		};
		maintenanceCharges?: {
			value: number;
			unit: "Hundred" | "Thousand" | "Lakh" | "Crore";
		};
		securityDeposit?: {
			value: number;
			unit: "Hundred" | "Thousand" | "Lakh" | "Crore";
		};
		priceNegotiable: boolean;
	};
	availability?: {
		immediatelyAvailable: boolean;
		possessionDate?: string;
		leaseDuration?: number;
	};
	legalInfo?: {
		ownershipType: "freehold" | "leasehold";
		approvedBy?: string[];
		rera?: { number: string; approved: boolean };
		documents?: string[];
	};
	nearbyPlaces?: {
		schools?: { name: string; distance: number; unit?: string }[];
		hospitals?: { name: string; distance: number; unit?: string }[];
		malls?: { name: string; distance: number; unit?: string }[];
		transport?: { name: string; distance: number; unit?: string }[];
	};
	createdAt: string;
	updatedAt: string;
	expiresAt?: string;
	contact: {
		name: string;
		phone: string;
		whatsapp?: string;
		type: "owner" | "agent" | "builder";
	};
	features?: {
		facing?:
			| "north"
			| "south"
			| "east"
			| "west"
			| "northeast"
			| "northwest"
			| "southeast"
			| "southwest";
		flooringType?: string;
		waterSupply?: string;
		powerBackup?: boolean;
		servantRoom?: boolean;
		poojaRoom?: boolean;
		studyRoom?: boolean;
		storeRoom?: boolean;
		garden?: boolean;
		swimmingPool?: boolean;
		gym?: boolean;
		lift?: boolean;
		securities?: boolean;
	};
	notes?: string;
};
