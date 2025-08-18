export type PropertyFormData = {
	_id?: string;
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
	status?: "active" | "sold" | "rented" | "inactive" | "pending";
	featured?: boolean;
	premium?: boolean;
	views?: number;
	approvalStatus?: "pending" | "approved" | "rejected";
	rejectionReason?: string;
	seo: {
		metaTitle?: string;
		metaDescription?: string;
		slug: string;
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
	legalInfo: {
		ownershipType: "freehold" | "leasehold";
		approvedBy?: string[];
		rera?: {
			number: string;
			approved: boolean;
		};
		documents?: string[];
	};
	nearbyPlaces?: {
		schools?: { name: string; distance: number }[];
		hospitals?: { name: string; distance: number }[];
		malls?: { name: string; distance: number }[];
		transport?: { name: string; distance: number }[];
	};
	createdAt?: Date;
	updatedAt?: Date;
	expiresAt?: Date;
};
