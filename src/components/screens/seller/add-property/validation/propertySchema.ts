import { z } from "zod";

// ✅ Fixed Schema aligned with PropertyFormData
export const propertySchema = z.object({
	title: z
		.string()
		.min(5, "Title must be between 5 and 200 characters")
		.max(200, "Title must be between 5 and 200 characters"),
	description: z
		.string()
		.min(10, "Description must be between 10 and 2000 characters")
		.max(2000, "Description must be between 10 and 2000 characters"),

	propertyType: z.enum([
		"apartment",
		"house",
		"villa",
		"plot",
		"commercial",
		"office",
	]),
	listingType: z.enum(["sale", "rent", "lease"]),

	currency: z.enum(["INR", "USD", "EUR"]),

	area: z.object({
		value: z.string().min(1, "Area must be a positive number"),
		unit: z.enum(["sqft", "sqm", "acre", "hectare"]),
	}),

	bedrooms: z.string().optional(),
	bathrooms: z.string().optional(),
	balconies: z.string().optional(),
	parking: z.string().optional(),
	furnished: z.enum(["furnished", "semi-furnished", "unfurnished"]),
	floor: z.string().optional(),
	totalFloors: z.string().optional(),
	age: z.string().min(0).optional().or(z.literal("")),

	images: z.array(z.any()).optional(),
	videos: z.array(z.any()).optional(),

	amenities: z.array(z.string()).optional(),

	address: z.object({
		street: z.string().min(1, "Street address is required"),
		area: z.string().min(1, "Area is required"),
		city: z.string().min(1, "City is required"),
		state: z.string().min(1, "State is required"),
		zipCode: z.string().min(1, "Zip code is required"),
		country: z.string().min(1, "Country is required"),
		landmark: z.string().optional(),
	}),

	pricing: z.object({
		basePrice: z.object({
			value: z.string(),

			unit: z.enum(["Hundred", "Thousand", "Lakh", "Crore"]).default("Lakh"),
		}),

		maintenanceCharges: z
			.object({
				value: z.string().optional(),
				unit: z.enum(["Hundred", "Thousand", "Lakh", "Crore"]),
			})
			.optional(),
		securityDeposit: z
			.object({
				value: z.string().optional(),
				unit: z.enum(["Hundred", "Thousand", "Lakh", "Crore"]),
			})
			.optional(),

		priceNegotiable: z.boolean(),
	}),

	nearbyPlaces: z
		.object({
			schools: z
				.array(
					z.object({
						name: z.string(),
						distance: z.string(),
						unit: z.enum(["meter", "km"]).default("km"),
					})
				)
				.optional(),
			hospitals: z
				.array(
					z.object({
						name: z.string(),
						distance: z.string(),
						unit: z.enum(["meter", "km"]).default("km"),
					})
				)
				.optional(),
			malls: z
				.array(
					z.object({
						name: z.string(),
						distance: z.string(),
						unit: z.enum(["meter", "km"]).default("km"),
					})
				)
				.optional(),
			transport: z
				.array(
					z.object({
						name: z.string(),
						distance: z.string(),
						unit: z.enum(["meter", "km"]).default("km"),
					})
				)
				.optional(),
		})
		.optional(),
	contact: z.object({
		name: z.string().min(2, "Contact name required"),
		phone: z.string().min(10, "Phone number required"),
		whatsapp: z.string().min(10, "WhatsApp number required").optional(),
		type: z.enum(["owner", "agent", "builder"]).default("owner"),
	}),

	features: z
		.object({
			facing: z
				.enum([
					"north",
					"south",
					"east",
					"west",
					"northeast",
					"northwest",
					"southeast",
					"southwest",
				])
				.optional(),
			flooringType: z.string().optional(),
			waterSupply: z.string().optional(),
			powerBackup: z.boolean().optional(),
			servantRoom: z.boolean().optional(),
			poojaRoom: z.boolean().optional(),
			studyRoom: z.boolean().optional(),
			storeRoom: z.boolean().optional(),
			garden: z.boolean().optional(),
			swimmingPool: z.boolean().optional(),
			gym: z.boolean().optional(),
			lift: z.boolean().optional(),
			security: z.boolean().optional(),
		})
		.optional(),

	notes: z.string().optional(),
	legalInfo: z
		.object({
			ownershipType: z.string().optional(),
		})
		.optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
