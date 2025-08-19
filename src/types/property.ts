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
