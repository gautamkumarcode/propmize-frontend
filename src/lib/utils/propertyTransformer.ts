import { Property, PropertyImage } from "../../types";

/**
 * Transform backend property data to match frontend types
 * @param property - Property data from backend
 * @returns Transformed property data matching frontend types
 */
export function transformPropertyData(property: any): Property {
	// Transform images from string array to PropertyImage array
	let images: PropertyImage[] = [];
	if (property.images && Array.isArray(property.images)) {
		images = property.images.map((imageUrl: string, index: number) => ({
			id: `${property._id}-${index}`,
			url: imageUrl,
			alt: `${property.title} - Image ${index + 1}`,
			isPrimary: index === 0,
			order: index,
		}));
	}

	// Transform address
	const address = {
		area: property.address?.area || "",
		street: property.address?.street || "",
		city: property.address?.city || "",
		state: property.address?.state || "",
		pincode: property.address?.zipCode || "",
		latitude: property.address?.coordinates?.latitude || undefined,
		longitude: property.address?.coordinates?.longitude || undefined,
	};

	// Transform area
	const area = {
		size: property.area?.value || 0,
		unit: property.area?.unit || "sqft",
	};

	// Transform features
	let features: string[] = [];
	if (property.amenities && Array.isArray(property.amenities)) {
		features = [...property.amenities];
	}

	// Create the transformed property object
	const transformedProperty: Property = {
		_id: property._id,
		title: property.title,
		description: property.description,
		price: property.price || 0,
		type: "residential", // Default value, adjust based on propertyType if needed
		subType: property.propertyType || "",
		status: property.listingType === "rent" ? "rent" : "sale",
		area,
		address,
		features,
		amenities: property.amenities || [],
		images,
		sellerId: property.seller?._id || "",
		seller: property.seller || {},
		isPremium: property.premium || false,
		views: property.views || 0,
		inquiries: property.leads?.length || 0,
		createdAt: new Date(property.createdAt),
		updatedAt: new Date(property.updatedAt),
		isNew: false, // This would need to be calculated based on createdAt date
		featured: property.featured || false,
		isLiked: false, // This would need to be set based on user data
		bedrooms: property.bedrooms || undefined,
		bathrooms: property.bathrooms || undefined,
		parking: property.parking !== undefined ? property.parking > 0 : undefined,
		savedDate: "",
	};

	return transformedProperty;
}

/**
 * Transform an array of backend property data to match frontend types
 * @param properties - Array of property data from backend
 * @returns Array of transformed property data matching frontend types
 */
export function transformPropertyDataArray(properties: any[]): Property[] {
	return properties.map(transformPropertyData);
}
