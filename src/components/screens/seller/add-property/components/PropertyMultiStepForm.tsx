"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateProperty } from "@/lib";
import { isHttpError } from "@/lib/react-query/hooks/useProperties";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod";
import React from "react";
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
	videos: [],
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
	const form = useForm<PropertyFormData>({
		resolver: zodResolver(propertySchema),
		defaultValues: getPropertyDefaultValues(),
	});

	const listingType = form.watch("listingType");
	const propertyType = form.watch("propertyType");

	// Get the correct step configuration based on listing type
	const currentStepConfig = stepConfig[currentStep - 1];

	// Use static 4-step config to match parent
	const steps = stepConfig;

	const createProperty = useCreateProperty();
	const [submittedData, setSubmittedData] =
		React.useState<PropertyFormData | null>(null);
	const [validationFailed, setValidationFailed] = React.useState(false);
	const submit: SubmitHandler<PropertyFormData> = (data) => {
		setValidationFailed(false);
		setSubmittedData(data);
		console.log(data);
		createProperty.mutate(data);
	};

	const onInvalid = () => {
		setValidationFailed(true);
	};

	// Error and loading feedback
	const isLoading = createProperty.isPending;
	const isError = createProperty.isError;
	const errorMessage =
		createProperty.error && isHttpError(createProperty.error)
			? createProperty.error.response?.data?.message ||
			  createProperty.error.message
			: "Failed to submit property";
	const isSuccess = createProperty.isSuccess;

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
					"legalInfo.ownershipType",
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
				return <PropertyBasicDetails form={form} />;
			case "locationFeatures":
				return <PropertyLocationAndFeatures form={form} />;
			case "mediaPricing":
				return <PropertyMediaAndPricing form={form} />;
			case "contactNotes":
				return <PropertyContactAndNotes form={form} />;
			case "preview":
				// Show a read-only preview of all entered data
				return <ReviewStep form={form} />;
			default:
				return null;
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(submit, onInvalid)}
				className="space-y-8">
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
				{/* Success message */}

				{/* Submitted data log */}

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
									Submitting...
								</span>
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