"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateProperty, useProperty, useUpdateProperty } from "@/lib";
import { isHttpError } from "@/lib/react-query/hooks/useProperties";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { Path, useForm, type SubmitHandler } from "react-hook-form";
import type { PropertyFormData } from "../validation/propertySchema";
import { propertySchema } from "../validation/propertySchema";
import PropertyBasicDetails from "./PropertyBasicDetails";
import PropertyContactAndNotes from "./PropertyContactAndNotes";
import PropertyLocationAndFeatures from "./PropertyLocationAndFeatures";
import PropertyMediaAndPricing from "./PropertyMediaAndPricing";
import ReviewStep from "./ReviewStep";

export const getPropertyDefaultValues = (): PropertyFormData => ({
	title: "",
	description: "",
	propertyType: "apartment",
	listingType: "sale",
	currency: "INR",
	area: { value: "", unit: "sqft" },
	bedrooms: "",
	bathrooms: "",
	balconies: "",
	parking: "",
	furnished: "unfurnished",
	floor: "",
	totalFloors: "",
	age: "",
	images: [],
	amenities: [],
	address: {
		street: "",
		area: "",
		city: "",
		state: "",
		zipCode: "",
		country: "",
		landmark: "",
	},
	pricing: {
		basePrice: { value: "", unit: "Lakh" },
		maintenanceCharges: { value: "", unit: "Thousand" },
		securityDeposit: { value: "", unit: "Thousand" },
		priceNegotiable: false,
	},
	nearbyPlaces: {
		schools: [],
		hospitals: [],
		malls: [],
		transport: [],
	},
	contact: {
		name: "",
		phone: "",
		whatsapp: "",
		type: "owner",
	},
	features: {
		facing: "north",
		flooringType: "",
		waterSupply: "",
		powerBackup: false,
		servantRoom: false,
		poojaRoom: false,
		studyRoom: false,
		storeRoom: false,
		garden: false,
		swimmingPool: false,
		gym: false,
		lift: false,
		security: false,
	},
	notes: "",
});

interface PropertyFormProps {
	currentStep: number;
	nextStep: () => void;
	prevStep: () => void;
}

// Refactored 4-step config
const stepConfig = [
	{ key: "basic", label: "Basic Details" },
	{ key: "locationFeatures", label: "Location & Features" },
	{ key: "mediaPricing", label: "Media & Pricing" },
	{ key: "contactNotes", label: "Contact & Notes" },
	{ key: "preview", label: "Preview" },
];

export default function PropertyForm({
	currentStep,
	nextStep,
	prevStep,
}: PropertyFormProps) {
	const searchParams = useSearchParams();
	const mode = searchParams.get("mode"); // 'create' or 'edit'
	const id = searchParams.get("id"); // property ID if in edit mode
	const isEditMode = mode === "edit" && id;

	const router = useRouter();
	const form = useForm<PropertyFormData>({
		resolver: zodResolver(propertySchema),
		defaultValues: getPropertyDefaultValues(),
	});

	// Store original data for comparison
	const originalDataRef = useRef<PropertyFormData | null>(null);

	// Fetch property data if in edit mode
	const { data: existingProperty, isLoading: isLoadingProperty } = useProperty(
		isEditMode ? id : null
	);

	// Pre-fill form with existing data when in edit mode
	useEffect(() => {
		if (isEditMode && existingProperty) {
			// Type-safe reset with proper type assertions
			const resetData: PropertyFormData = {
				title: existingProperty.title || "",
				description: existingProperty.description || "",
				propertyType: ([
					"apartment",
					"house",
					"villa",
					"plot",
					"commercial",
					"office",
				].includes(existingProperty.propertyType)
					? existingProperty.propertyType
					: "apartment") as PropertyFormData["propertyType"],
				listingType: (["sale", "rent", "lease"].includes(
					existingProperty.listingType
				)
					? existingProperty.listingType
					: "sale") as PropertyFormData["listingType"],
				currency: (["INR", "USD", "EUR"].includes(
					(existingProperty as any).currency
				)
					? (existingProperty as any).currency
					: "INR") as PropertyFormData["currency"],
				area: {
					value:
						existingProperty.area &&
						typeof existingProperty.area.value !== "undefined"
							? String(existingProperty.area.value)
							: "",
					unit: (existingProperty.area &&
					["sqft", "sqm", "acre", "hectare"].includes(
						existingProperty.area.unit
					)
						? existingProperty.area.unit
						: "sqft") as "sqft" | "sqm" | "acre" | "hectare",
				},
				bedrooms: existingProperty.bedrooms?.toString() || "",
				bathrooms: existingProperty.bathrooms?.toString() || "",
				balconies: existingProperty.balconies?.toString() || "",
				parking: existingProperty.parking?.toString() || "",
				furnished: ([
					"unfurnished",
					"semi-furnished",
					"fully-furnished",
				].includes(existingProperty.furnished)
					? existingProperty.furnished
					: "unfurnished") as PropertyFormData["furnished"],
				floor: existingProperty.floor?.toString() || "",
				totalFloors: existingProperty.totalFloors?.toString() || "",
				age: existingProperty.age?.toString() || "",
				images: existingProperty.images || [],
				amenities: existingProperty.amenities || [],
				address: existingProperty.address || {
					street: "",
					area: "",
					city: "",
					state: "",
					zipCode: "",
					country: "",
					landmark: "",
				},
				pricing: existingProperty.pricing
					? {
							basePrice: {
								value: existingProperty.pricing.basePrice?.value
									? String(existingProperty.pricing.basePrice.value)
									: "",
								unit: (["Lakh", "Thousand", "Crore"].includes(
									existingProperty.pricing.basePrice?.currency || ""
								)
									? existingProperty.pricing.basePrice?.currency
									: "Lakh") as "Lakh" | "Thousand" | "Crore",
							},
							maintenanceCharges: {
								value: existingProperty.pricing.maintenanceCharges
									? String(existingProperty.pricing.maintenanceCharges)
									: "",
								unit: (["Lakh", "Thousand", "Crore"].includes(
									(existingProperty.pricing.maintenanceCharges
										?.currency as string) || ""
								)
									? existingProperty.pricing.maintenanceCharges?.currency
									: "Thousand") as "Lakh" | "Thousand" | "Crore",
							},
							securityDeposit: {
								value: existingProperty.pricing.securityDeposit?.value
									? String(existingProperty.pricing.securityDeposit.value)
									: "",
								unit: (["Lakh", "Thousand", "Crore"].includes(
									existingProperty.pricing.securityDeposit?.currency || ""
								)
									? existingProperty.pricing.securityDeposit?.currency
									: "Thousand") as "Lakh" | "Thousand" | "Crore",
							},
							priceNegotiable:
								existingProperty.pricing.priceNegotiable || false,
					  }
					: {
							basePrice: { value: "", unit: "Lakh" },
							maintenanceCharges: { value: "", unit: "Thousand" },
							securityDeposit: { value: "", unit: "Thousand" },
							priceNegotiable: false,
					  },
				nearbyPlaces: existingProperty.nearbyPlaces
					? {
							schools:
								existingProperty.nearbyPlaces.schools?.map((item) => ({
									name: item.name,
									distance: String(item.distance),
									unit:
										item.unit === "meter" || item.unit === "km"
											? item.unit
											: "meter",
								})) ?? [],
							hospitals:
								existingProperty.nearbyPlaces.hospitals?.map((item) => ({
									name: item.name,
									distance: String(item.distance),
									unit:
										item.unit === "meter" || item.unit === "km"
											? item.unit
											: "meter",
								})) ?? [],
							malls:
								existingProperty.nearbyPlaces.malls?.map((item) => ({
									name: item.name,
									distance: String(item.distance),
									unit:
										item.unit === "meter" || item.unit === "km"
											? item.unit
											: "meter",
								})) ?? [],
							transport:
								existingProperty.nearbyPlaces.transport?.map((item) => ({
									name: item.name,
									distance: String(item.distance),
									unit:
										item.unit === "meter" || item.unit === "km"
											? item.unit
											: "meter",
								})) ?? [],
					  }
					: {
							schools: [],
							hospitals: [],
							malls: [],
							transport: [],
					  },
				contact: existingProperty.contact
					? {
							name: existingProperty.contact.name || "",
							phone: existingProperty.contact.phone || "",
							whatsapp: existingProperty.contact.whatsapp,
							type: ["owner", "agent", "builder"].includes(
								existingProperty.contact.type
							)
								? (existingProperty.contact.type as
										| "owner"
										| "agent"
										| "builder")
								: "owner",
					  }
					: {
							name: "",
							phone: "",
							whatsapp: "",
							type: "owner",
					  },
				features: existingProperty.features
					? {
							...existingProperty.features,
							facing: [
								"north",
								"south",
								"east",
								"west",
								"northeast",
								"northwest",
								"southeast",
								"southwest",
							].includes(existingProperty.features.facing as string)
								? (existingProperty.features.facing as
										| "north"
										| "south"
										| "east"
										| "west"
										| "northeast"
										| "northwest"
										| "southeast"
										| "southwest")
								: "north",
					  }
					: {
							facing: "north",
							flooringType: "",
							waterSupply: "",
							powerBackup: false,
							servantRoom: false,
							poojaRoom: false,
							studyRoom: false,
							storeRoom: false,
							garden: false,
							swimmingPool: false,
							gym: false,
							lift: false,
							security: false,
					  },
				// notes: existingProperty.notes || "",
			};

			form.reset(resetData);
			// Store the original data for comparison
			originalDataRef.current = resetData;
		}
	}, [isEditMode, existingProperty, form]);

	// Function to get only changed fields
	const getChangedFields = (currentData: PropertyFormData) => {
		if (!originalDataRef.current || !isEditMode) {
			return currentData; // Return all data for new properties
		}

		const changedData: Partial<PropertyFormData> = {};

		// Compare each field
		(Object.keys(currentData) as (keyof PropertyFormData)[]).forEach((key) => {
			const currentValue = currentData[key];
			const originalValue = originalDataRef.current![key];

			// Handle nested objects and arrays
			if (
				typeof currentValue === "object" &&
				currentValue !== null &&
				typeof originalValue === "object" &&
				originalValue !== null
			) {
				// Special handling for arrays (images, amenities)
				if (Array.isArray(currentValue) && Array.isArray(originalValue)) {
					if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
						(changedData as any)[key] = currentValue;
					}
				}
				// Handle nested objects (address, pricing, features, etc.)
				else {
					const currentObj = currentValue as Record<string, any>;
					const originalObj = originalValue as Record<string, any>;

					const nestedChanges: Record<string, any> = {};
					let hasNestedChanges = false;

					Object.keys(currentObj).forEach((nestedKey) => {
						if (
							JSON.stringify(currentObj[nestedKey]) !==
							JSON.stringify(originalObj[nestedKey])
						) {
							nestedChanges[nestedKey] = currentObj[nestedKey];
							hasNestedChanges = true;
						}
					});

					if (hasNestedChanges) {
						(changedData as any)[key] = nestedChanges;
					}
				}
			}
			// Handle primitive values
			else if (currentValue !== originalValue) {
				(changedData as any)[key] = currentValue;
			}
		});

		return changedData;
	};

	const listingType = form.watch("listingType");
	const propertyType = form.watch("propertyType");

	// Get the correct step configuration based on listing type
	const currentStepConfig = stepConfig[currentStep - 1];

	// Use static 4-step config to match parent
	const steps = stepConfig;

	const createProperty = useCreateProperty();
	const updateProperty = useUpdateProperty();
	const [submittedData, setSubmittedData] =
		React.useState<PropertyFormData | null>(null);
	const [validationFailed, setValidationFailed] = React.useState(false);

	const submit: SubmitHandler<PropertyFormData> = (data) => {
		setValidationFailed(false);
		setSubmittedData(data);

		// Get only the changed fields for update, or all data for create
		const payload = isEditMode ? getChangedFields(data) : data;

		// Ensure required fields are present and not undefined
		const ensureRequiredFields = (
			payloadObj: Partial<PropertyFormData>
		): PropertyFormData => {
			return {
				...getPropertyDefaultValues(),
				...payloadObj,
				title: payloadObj.title ?? data.title,
				description: payloadObj.description ?? data.description,
				propertyType: payloadObj.propertyType ?? data.propertyType,
				listingType: payloadObj.listingType ?? data.listingType,
				currency: payloadObj.currency ?? data.currency,
				area: payloadObj.area ?? data.area,
				bedrooms: payloadObj.bedrooms ?? data.bedrooms,
				bathrooms: payloadObj.bathrooms ?? data.bathrooms,
				balconies: payloadObj.balconies ?? data.balconies,
				parking: payloadObj.parking ?? data.parking,
				furnished: payloadObj.furnished ?? data.furnished,
				floor: payloadObj.floor ?? data.floor,
				totalFloors: payloadObj.totalFloors ?? data.totalFloors,
				age: payloadObj.age ?? data.age,
				images: payloadObj.images ?? data.images,
				amenities: payloadObj.amenities ?? data.amenities,
				address: payloadObj.address ?? data.address,
				pricing: payloadObj.pricing ?? data.pricing,
				nearbyPlaces: payloadObj.nearbyPlaces ?? data.nearbyPlaces,
				contact: payloadObj.contact ?? data.contact,
				features: payloadObj.features ?? data.features,
				notes: payloadObj.notes ?? data.notes,
			};
		};

		if (isEditMode && id) {
			// Update existing property with only changed data, ensuring required fields are present
			updateProperty.mutate({
				id,
				data: ensureRequiredFields(payload),
			});
		} else {
			// Create new property
			createProperty.mutate(data);
		}
	};

	const onInvalid = () => {
		setValidationFailed(true);
	};

	// Determine which mutation to use for loading/error states
	const isLoading = isEditMode
		? updateProperty.isPending
		: createProperty.isPending;
	const isError = isEditMode ? updateProperty.isError : createProperty.isError;
	const error = isEditMode ? updateProperty.error : createProperty.error;
	const errorMessage =
		error && isHttpError(error)
			? error.response?.data?.message || error.message
			: `Failed to ${isEditMode ? "update" : "submit"} property`;
	const isSuccess = isEditMode
		? updateProperty.isSuccess
		: createProperty.isSuccess;

	// Redirect on success
	React.useEffect(() => {
		if (isSuccess) {
			router.push("/seller/my-property");
		}
	}, [isSuccess, router]);

	const [stepErrors, setStepErrors] = React.useState<string[]>([]);
	const validateAndNext = async () => {
		let fieldsToValidate: Path<PropertyFormData>[] = [];
		const currentStepKey = steps[currentStep - 1]?.key;
		switch (currentStepKey) {
			case "basic":
				fieldsToValidate = [
					"title",
					"description",
					"propertyType",
					"listingType",
					"currency",
					"area.value",
					"area.unit",
					"bedrooms",
					"bathrooms",
					"balconies",
					"parking",
					"furnished",
					"floor",
					"totalFloors",
					"age",
				];
				break;
			case "locationFeatures":
				fieldsToValidate = [
					"address.street",
					"address.area",
					"address.city",
					"address.state",
					"address.zipCode",
					"address.country",
					"features.facing",
					"features.flooringType",
					"features.waterSupply",
				];
				break;
			case "mediaPricing":
				fieldsToValidate = [
					"images",
					"pricing.basePrice.value",
					"pricing.basePrice.unit",
					"pricing.priceNegotiable",
				];
				break;
			case "contactNotes":
				fieldsToValidate = [
					"contact.name",
					"contact.phone",
					"contact.whatsapp",
					"contact.type",
					"nearbyPlaces",
				];
				break;
			default:
				break;
		}
		const isValid = await form.trigger(fieldsToValidate);
		if (isValid) {
			setStepErrors([]);
			nextStep();
		} else {
			// Collect errors for current step
			const errors = fieldsToValidate
				.map((field) => {
					const err = form.getFieldState(field).error;
					return err?.message;
				})
				.filter(Boolean) as string[];
			setStepErrors(errors);
		}
	};

	const renderStepContent = () => {
		const stepKey = steps[currentStep - 1]?.key;
		switch (stepKey) {
			case "basic":
				return <PropertyBasicDetails form={form} isEditMode={isEditMode} />;
			case "locationFeatures":
				return (
					<PropertyLocationAndFeatures form={form} isEditMode={isEditMode} />
				);
			case "mediaPricing":
				return <PropertyMediaAndPricing form={form} isEditMode={isEditMode} />;
			case "contactNotes":
				return <PropertyContactAndNotes form={form} isEditMode={isEditMode} />;
			case "preview":
				// Show a read-only preview of all entered data
				return <ReviewStep form={form} isEditMode={isEditMode} />;
			default:
				return null;
		}
	};

	// Show loading state while fetching property data in edit mode
	if (isEditMode && isLoadingProperty) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(submit, onInvalid)}
				className="space-y-8">
				{/* Show mode indicator */}
				{isEditMode && (
					<div className="bg-blue-50 p-4 rounded-lg mb-6">
						<h2 className="text-xl font-semibold text-blue-800">
							Editing Property: {existingProperty?.title || ""}
						</h2>
						<p className="text-blue-600">Only changed fields will be updated</p>
					</div>
				)}

				{/* Error summary for current step */}
				{stepErrors.length > 0 && (
					<div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
						<div className="font-bold mb-1">
							Please fix the following errors:
						</div>
						<ul className="list-disc ml-5">
							{stepErrors.map((err, idx) => (
								<li key={idx}>{err}</li>
							))}
						</ul>
					</div>
				)}

				{/* Only Step Content (step indicator is in parent) */}
				{renderStepContent()}

				{/* Error message */}
				{isError && (
					<div className="text-red-600 font-semibold mt-2">{errorMessage}</div>
				)}

				{/* Validation failed message */}
				{validationFailed && (
					<div className="text-yellow-700 font-semibold mt-2">
						Please fill all required fields correctly before submitting.
					</div>
				)}

				<div className="flex justify-between mt-8">
					<Button
						disabled={currentStep === 1 || isLoading}
						type="button"
						onClick={prevStep}
						variant="outline">
						Back
					</Button>
					{currentStep < stepConfig.length ? (
						<Button
							type="button"
							onClick={validateAndNext}
							className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
							disabled={isLoading}>
							Next
						</Button>
					) : (
						<Button
							type="submit"
							className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
							disabled={isLoading}>
							{isLoading ? (
								<span className="flex items-center gap-2">
									<svg
										className="animate-spin h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8v8z"
										/>
									</svg>
									{isEditMode ? "Updating..." : "Submitting..."}
								</span>
							) : isEditMode ? (
								"Update Property"
							) : (
								"Submit Property"
							)}
						</Button>
					)}
				</div>
			</form>
		</Form>
	);
}