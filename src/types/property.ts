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



export interface SellerPropertyAnalytics {
	overallStats: OverallStat[];
	propertyAnalytics: PropertyAnalytic[];
	periodData: WeeklyDatum[];
	marketInsights: MarketInsight[];
	summary: Summary;
}

export interface MarketInsight {
	title: string;
	value: string;
	insight: string;
	recommendation: string;
}

export interface OverallStat {
	label: string;
	value: string;
	change: string;
	trend: string;
	icon: string;
}

export interface PropertyAnalytic {
	id: string;
	title: string;
	views: number;
	inquiries: number;
	favorites: number;
	calls: number;
	likes: number;
	conversionRate: number;
	converted: number;
	daysListed: number;
	status: Status;
	propertyType: PropertyType;
	listingType: ListingType;
	location: Location;
	price: PriceClass | number;
}

export enum ListingType {
	Rent = "rent",
	Sale = "sale",
}

export enum Location {
	GhazipurUttarPradesh = "Ghazipur, Uttar Pradesh",
	VaranasiUttarPradesh = "Varanasi, Uttar Pradesh",
}

export interface PriceClass {
	value: number;
	unit: string;
}

export enum PropertyType {
	Apartment = "apartment",
	Commercial = "commercial",
	Plot = "plot",
}

export enum Status {
	Active = "active",
	Pending = "pending",
}

export interface Summary {
	totalProperties: number;
	activeProperties: number;
	totalValue: string;
	averagePrice: null;
}

export interface WeeklyDatum {
	day: string;
	views: number;
	inquiries: number;
}