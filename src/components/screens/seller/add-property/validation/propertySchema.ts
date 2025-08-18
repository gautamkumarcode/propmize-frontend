import z from "zod/v3";

export const propertySchema = z.object({
	title: z.string().min(3, "Title is required"),
	description: z.string().min(10, "Description should be more detailed"),
	propertyType: z.enum([
		"apartment",
		"house",
		"villa",
		"plot",
		"commercial",
		"office",
	]),
	listingType: z.enum(["sale", "rent", "lease"]),
	price: z.number().min(0),
	currency: z.string().default("INR"),

	area: z.object({
		value: z.number().min(1),
		unit: z.enum(["sqft", "sqm", "acre", "hectare"]),
	}),

	bedrooms: z.number().optional(),
	bathrooms: z.number().optional(),
	balconies: z.number().optional(),
	parking: z.number().optional(),
	furnished: z.enum(["furnished", "semi-furnished", "unfurnished"]),
	floor: z.number().optional(),
	totalFloors: z.number().optional(),
	age: z.number().min(0),

	images: z.array(z.string().url()).min(1, "At least one image is required"),
	videos: z.array(z.string().url()).optional(),
	virtualTour: z.string().url().optional(),
	amenities: z.array(z.string()),

	address: z.object({
		street: z.string(),
		area: z.string(),
		city: z.string(),
		state: z.string(),
		zipCode: z.string(),
		country: z.string(),
		landmark: z.string().optional(),
		coordinates: z
			.object({
				latitude: z.number(),
				longitude: z.number(),
			})
			.optional(),
	}),

	pricing: z.object({
		basePrice: z.number().min(0),
		maintenanceCharges: z.number().optional(),
		securityDeposit: z.number().optional(),
		brokeragePercentage: z.number().optional(),
		priceNegotiable: z.boolean(),
	}),

	availability: z.object({
		immediatelyAvailable: z.boolean(),
		possessionDate: z.coerce.date().optional(),
		leaseDuration: z.number().optional(),
	}),

	legalInfo: z.object({
		ownershipType: z.enum(["freehold", "leasehold"]),
		approvedBy: z.array(z.string()).optional(),
		rera: z
			.object({
				number: z.string(),
				approved: z.boolean(),
			})
			.optional(),
		documents: z.array(z.string()).optional(),
	}),

	nearbyPlaces: z
		.object({
			schools: z
				.array(z.object({ name: z.string(), distance: z.number() }))
				.optional(),
			hospitals: z
				.array(z.object({ name: z.string(), distance: z.number() }))
				.optional(),
			malls: z
				.array(z.object({ name: z.string(), distance: z.number() }))
				.optional(),
			transport: z
				.array(z.object({ name: z.string(), distance: z.number() }))
				.optional(),
		})
		.optional(),
});

export type PropertyFormInput = z.infer<typeof propertySchema>;
