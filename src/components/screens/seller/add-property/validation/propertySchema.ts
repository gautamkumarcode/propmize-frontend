import { z } from "zod";

// ✅ Fixed Schema aligned with PropertyFormData
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

	currency: z.string().default("INR"),

	area: z.object({
		value: z.string().min(1, "Area is required"),
		unit: z.enum(["sqft", "sqm", "acre", "hectare"]),
	}),

	bedrooms: z.string().optional(),
	bathrooms: z.string().optional(),
	balconies: z.string().optional(),
	parking: z.string().optional(),
	furnished: z.enum(["furnished", "semi-furnished", "unfurnished"]),
	floor: z.string().optional(),
	totalFloors: z.string().optional(),
	age: z.string().min(0),

	images: z.array(z.any()).min(1, "At least one image file is required"),
	videos: z.array(z.any()).optional(),

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
		basePrice: z.object({
			value: z.string().min(0),
			unit: z.enum(["Hundred", "Thousand", "Lakh", "Crore"]).default("Lakh"),
		}),

		maintenanceCharges: z
			.object({
				value: z.string().optional(),
				unit: z.enum(["Hundred", "Thousand", "Lakh", "Crore"]).default("Lakh"),
			})
			.optional(),
		securityDeposit: z
			.object({
				value: z.string().optional(),
				unit: z.enum(["Hundred", "Thousand", "Lakh", "Crore"]).default("Lakh"),
			})
			.optional(),

		priceNegotiable: z.boolean(),
	}),

	availability: z.object({
		immediatelyAvailable: z.boolean(),
		possessionDate: z.date().optional(),
		leaseDuration: z.number().optional(),
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
		type: z.enum(["owner", "agent", "builder"]).optional(),
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
	// Removed duplicate pricing object
});

export type PropertyFormData = z.infer<typeof propertySchema>;
